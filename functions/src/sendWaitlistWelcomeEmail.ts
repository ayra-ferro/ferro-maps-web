import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import sgMail from "@sendgrid/mail";

const sendgridApiKey = defineSecret("SENDGRID_API_KEY");

const FROM_EMAIL = "admin@ferromaps.com";
const FROM_NAME = "Ferro Maps";

export const sendWaitlistWelcomeEmail = onDocumentCreated(
  {document: "waitlist/{docId}", region: "europe-west2", secrets: [sendgridApiKey]},
  async (event) => {
    const data = event.data?.data();
    if (!data) {
      logger.warn("sendWaitlistWelcomeEmail: no data in event, skipping");
      return;
    }

    const {email} = data as {email: string};
    if (!email) {
      logger.warn("sendWaitlistWelcomeEmail: no email field on document, skipping");
      return;
    }

    sgMail.setApiKey(sendgridApiKey.value());

    try {
      await sgMail.send({
        from: {email: FROM_EMAIL, name: FROM_NAME},
        to: email,
        subject: "You're on the Ferro Maps waitlist",
        text: [
          "Thank you for signing up - you're now on the Ferro Maps waitlist.",
          "",
          "Keep an eye on your inbox (and spam/junk folder, just in case) for an email from Ferro Maps letting you know when the app launches in your area.",
          "",
          "The Ferro Maps Team",
        ].join("\n"),
        html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1E7BFF;margin-bottom:8px">You're on the waitlist</h2>
  <p>Thank you for signing up - you're now on the Ferro Maps waitlist.</p>
  <p>Keep an eye on your inbox (and spam/junk folder, just in case) for an email from Ferro Maps letting you know when the app launches in your area.</p>
  <p style="margin-top:32px;color:#666">The Ferro Maps Team</p>
</div>`,
      });
      logger.info(`sendWaitlistWelcomeEmail: welcome email sent to ${email}`);
    } catch (err) {
      logger.error(`sendWaitlistWelcomeEmail: failed to send welcome email to ${email}`, err);
    }
  }
);
