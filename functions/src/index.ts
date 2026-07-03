import {setGlobalOptions} from "firebase-functions";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import {onRequest, onCall, HttpsError, CallableRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import sgMail from "@sendgrid/mail";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {initializeApp, getApps} from "firebase-admin/app";
import busboy from "busboy";

if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

const sendgridApiKey = defineSecret("SENDGRID_API_KEY");

setGlobalOptions({maxInstances: 10, region: "europe-west2"});

const FROM_EMAIL = "admin@ferromaps.com";
const FROM_NAME = "Ferro Maps";
const ADMIN_NOTIFICATION_EMAIL = "admin@ferromaps.com";
const ADMIN_DASHBOARD_URL = "https://admin.ferromaps.com";

function formatTicketNumber(ticketNumber: number): string {
  return "#" + String(ticketNumber).slice(-5).padStart(5, "0");
}

export const onNewTicket = onDocumentCreated(
  {document: "supportRequests/{ticketId}", secrets: [sendgridApiKey]},
  async (event) => {
    sgMail.setApiKey(sendgridApiKey.value());

    const data = event.data?.data();
    if (!data) {
      logger.warn("onNewTicket: no data in event, skipping");
      return;
    }

    const {name, email, message, ticketNumber, subject} = data as {
      name: string;
      email: string;
      message: string;
      ticketNumber: number;
      subject: string;
    };

    const formattedTicket = formatTicketNumber(ticketNumber);

    // EMAIL A — confirmation to driver
    try {
      await sgMail.send({
        from: {email: FROM_EMAIL, name: FROM_NAME},
        replyTo: `ticket-${ticketNumber}@reply.ferromaps.com`,
        to: email,
        subject: `Thank you for contacting us (${formattedTicket})`,
        text: [
          `Hi ${name},`,
          "",
          "Thank you for contacting Ferro Maps support. We've received your message and will review your request and get back to you soon.",
          "",
          `Your ticket reference is ${formattedTicket}.`,
          "",
          "The Ferro Maps Team",
        ].join("\n"),
        html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1E7BFF;margin-bottom:8px">We've received your message</h2>
  <p>Hi ${name},</p>
  <p>Thank you for contacting <strong>Ferro Maps</strong> support. We've received your message and will review your request and get back to you soon.</p>
  <p>Your ticket reference is <strong>${formattedTicket}</strong>.</p>
  <p style="margin-top:32px;color:#666">The Ferro Maps Team</p>
</div>`,
      });
      logger.info(`onNewTicket: confirmation email sent to ${email} (${formattedTicket})`);
    } catch (err) {
      logger.error(`onNewTicket: failed to send confirmation email to ${email}`, err);
    }

    // EMAIL B — admin notification
    try {
      await sgMail.send({
        from: {email: FROM_EMAIL, name: FROM_NAME},
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `New support ticket (${formattedTicket})`,
        text: [
          `New support ticket ${formattedTicket}`,
          "",
          `Driver name:  ${name}`,
          `Driver email: ${email}`,
          `Subject:      ${subject}`,
          "",
          "Message:",
          message,
          "",
          `View in dashboard: ${ADMIN_DASHBOARD_URL}/messages`,
        ].join("\n"),
        html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1E7BFF;margin-bottom:8px">New support ticket ${formattedTicket}</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
    <tr><td style="padding:4px 8px 4px 0;color:#666;white-space:nowrap">Driver name</td><td style="padding:4px 0">${name}</td></tr>
    <tr><td style="padding:4px 8px 4px 0;color:#666;white-space:nowrap">Driver email</td><td style="padding:4px 0"><a href="mailto:${email}">${email}</a></td></tr>
    <tr><td style="padding:4px 8px 4px 0;color:#666;white-space:nowrap">Subject</td><td style="padding:4px 0">${subject}</td></tr>
  </table>
  <p style="background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap">${message}</p>
  <a href="${ADMIN_DASHBOARD_URL}/messages" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#1E7BFF;color:#fff;text-decoration:none;border-radius:6px">View in dashboard</a>
</div>`,
      });
      logger.info(`onNewTicket: admin notification sent for ${formattedTicket}`);
    } catch (err) {
      logger.error(`onNewTicket: failed to send admin notification for ${formattedTicket}`, err);
    }
  }
);

export const onTicketUpdated = onDocumentUpdated(
  {document: "supportRequests/{ticketId}", secrets: [sendgridApiKey]},
  async (event) => {
    sgMail.setApiKey(sendgridApiKey.value());

    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    if (!beforeData || !afterData) {
      logger.warn("onTicketUpdated: missing before/after data, skipping");
      return;
    }

    const {email, ticketNumber} = afterData as {
      email: string;
      ticketNumber: number;
      replies?: { text: string }[];
      status?: string;
    };
    const formattedTicket = formatTicketNumber(ticketNumber);

    // CASE A: new reply added
    const beforeRepliesLen: number = (beforeData.replies as unknown[] | undefined)?.length ?? 0;
    const afterReplies = afterData.replies as { text: string }[] | undefined;
    const afterRepliesLen = afterReplies?.length ?? 0;

    if (afterRepliesLen > beforeRepliesLen && afterReplies) {
      const newestReply = afterReplies[afterReplies.length - 1];
      try {
        await sgMail.send({
          from: {email: FROM_EMAIL, name: FROM_NAME},
          replyTo: `ticket-${afterData.ticketNumber}@reply.ferromaps.com`,
          to: email,
          subject: `New reply to your ticket (${formattedTicket})`,
          text: [
            "Hi,",
            "",
            `There's a new reply on your support ticket ${formattedTicket}:`,
            "",
            newestReply.text,
            "",
            "If you need further assistance, feel free to visit our contact page and submit a new message. Our team will continue to follow up with you.",
            "",
            "The Ferro Maps Team",
          ].join("\n"),
          html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1E7BFF;margin-bottom:8px">New reply on ticket ${formattedTicket}</h2>
  <p style="background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap">${newestReply.text}</p>
  <p>If you need further assistance, feel free to visit our contact page and submit a new message. Our team will continue to follow up with you.</p>
  <p style="margin-top:32px;color:#666">The Ferro Maps Team</p>
</div>`,
        });
        logger.info(`onTicketUpdated: reply notification sent to ${email} (${formattedTicket})`);
      } catch (err) {
        logger.error(`onTicketUpdated: failed to send reply notification to ${email}`, err);
      }
    }

    // CASE B: status changed to closed
    if (beforeData.status !== "closed" && afterData.status === "closed") {
      try {
        await sgMail.send({
          from: {email: FROM_EMAIL, name: FROM_NAME},
          replyTo: `ticket-${afterData.ticketNumber}@reply.ferromaps.com`,
          to: email,
          subject: `Your ticket (${formattedTicket}) has been closed`,
          text: [
            "Hi,",
            "",
            `Your support ticket ${formattedTicket} has been marked as resolved and closed.`,
            "",
            "If you need further help, feel free to submit a new request.",
            "",
            "The Ferro Maps Team",
          ].join("\n"),
          html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1E7BFF;margin-bottom:8px">Ticket ${formattedTicket} closed</h2>
  <p>Your support ticket has been marked as resolved and closed.</p>
  <p>If you need further help, feel free to submit a new request.</p>
  <p style="margin-top:32px;color:#666">The Ferro Maps Team</p>
</div>`,
        });
        logger.info(`onTicketUpdated: closed notification sent to ${email} (${formattedTicket})`);
      } catch (err) {
        logger.error(`onTicketUpdated: failed to send closed notification to ${email}`, err);
      }
    }
  }
);

export const onInboundEmail = onRequest(
  {region: "europe-west2"},
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      // Parse multipart form data from SendGrid Inbound Parse
      const bb = busboy({headers: req.headers});
      const fields: Record<string, string> = {};

      await new Promise<void>((resolve, reject) => {
        bb.on("field", (name, value) => {
          fields[name] = value;
        });
        bb.on("close", resolve);
        bb.on("error", reject);
        bb.end(req.rawBody);
      });

      // SendGrid Inbound Parse provides 'to', 'from', 'subject', 'text' fields
      const toAddress = fields["to"] || "";
      const bodyText = fields["text"] || "";

      // Extract ticket number from the 'to' address, e.g. ticket-49779@reply.ferromaps.com
      const match = toAddress.match(/ticket-(\d+)@/);
      if (!match) {
        logger.warn("onInboundEmail: could not extract ticket number from", toAddress);
        res.status(200).send("OK"); // Always 200 so SendGrid doesn't retry
        return;
      }

      const ticketNumber = Number(match[1]);

      // Find the ticket document by ticketNumber field
      const snapshot = await db
        .collection("supportRequests")
        .where("ticketNumber", "==", ticketNumber)
        .limit(1)
        .get();

      if (snapshot.empty) {
        logger.warn("onInboundEmail: no ticket found for number", ticketNumber);
        res.status(200).send("OK");
        return;
      }

      const ticketDoc = snapshot.docs[0];

      // Strip common quoted-reply patterns (basic heuristic - keeps only text
      // before the first quoted-reply marker)
      const cleanedText = bodyText
        .split(/\nOn .+ wrote:\n/)[0]
        .split(/\n-----Original Message-----/)[0]
        .trim();

      await ticketDoc.ref.update({
        replies: FieldValue.arrayUnion({
          text: cleanedText || bodyText.trim(),
          sentAt: new Date(),
          sentBy: "driver",
        }),
      });

      logger.info(`onInboundEmail: appended driver reply to ticket #${ticketNumber}`);
      res.status(200).send("OK");
    } catch (error) {
      logger.error("onInboundEmail: failed to process inbound email", error);
      res.status(200).send("OK"); // Still 200 to prevent SendGrid retry storms
    }
  }
);

export const setDriverSuspended = onCall(
  {region: "europe-west2"},
  async (request: CallableRequest) => {
    // Verify caller is an authenticated admin
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }
    if (request.auth.token.role !== "admin") {
      throw new HttpsError("permission-denied", "Admin access required.");
    }

    const {uid, suspend} = request.data as {uid: string; suspend: boolean};

    if (!uid || typeof suspend !== "boolean") {
      throw new HttpsError("invalid-argument", "uid and suspend are required.");
    }

    const userRef = db.collection("users").doc(uid);

    if (suspend) {
      await userRef.update({
        isSuspended: true,
        suspendedAt: FieldValue.serverTimestamp(),
      });
    } else {
      await userRef.update({
        isSuspended: false,
      });
    }

    logger.info(`setDriverSuspended: uid=${uid} suspend=${suspend} by admin=${request.auth.uid}`);
    return {success: true};
  }
);
