#!/usr/bin/env node
/**
 * FM-WEB-041 — Set the 'role: admin' custom claim on a Ferro Maps admin user.
 *
 * Usage:
 *   node set-admin-claim.mjs <email>             Set role: admin on this user
 *   node set-admin-claim.mjs <email> --check     Show current custom claims
 *   node set-admin-claim.mjs <email> --remove    Remove the admin claim
 *
 * Auth: ferro-maps-staging-v2 has iam.disableServiceAccountKeyCreation enabled
 * via org policy, so the expected auth method is Application Default Credentials:
 *
 *   gcloud auth application-default login
 *   gcloud auth application-default set-quota-project ferro-maps-staging-v2
 *
 * If serviceAccountKey.json is present in this folder it is used instead (fallback
 * for if the org policy is ever relaxed). See README.md.
 */

import { readFileSync, existsSync } from 'fs';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const SERVICE_ACCOUNT_PATH = new URL('./serviceAccountKey.json', import.meta.url);
const PROJECT_ID = 'ferro-maps-staging-v2';

const [, , email, flag] = process.argv;

if (!email) {
  console.error('Usage: node set-admin-claim.mjs <email> [--check|--remove]');
  process.exit(1);
}

const credential = existsSync(SERVICE_ACCOUNT_PATH)
  ? cert(JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8')))
  : applicationDefault();

initializeApp({ credential, projectId: PROJECT_ID });

const auth = getAuth();
const user = await auth.getUserByEmail(email);

if (flag === '--check') {
  console.log(`Current custom claims for ${email} (uid: ${user.uid}):`);
  console.log(user.customClaims ?? '(none)');
  process.exit(0);
}

if (flag === '--remove') {
  await auth.setCustomUserClaims(user.uid, null);
  console.log(`Removed admin claim from ${email} (uid: ${user.uid}).`);
  process.exit(0);
}

await auth.setCustomUserClaims(user.uid, { role: 'admin' });
console.log(`Set role: admin for ${email} (uid: ${user.uid}).`);
console.log('They must sign out and sign in again before the claim takes effect.');
