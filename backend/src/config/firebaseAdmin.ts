// firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json'; // update path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://uengage-278e4.firebaseio.com', // update project ID
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };