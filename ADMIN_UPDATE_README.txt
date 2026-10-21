LEARNINGHUB ICT NVQ Level 05 - Member Details Dashboard Update

Files updated: admin.html, admin.js. All other files preserved.

Features: full name, email, Firebase UID, date registered, role, status, details modal, member search, active/blocked counters, block/unblock, messages & delete.
Only fields already stored in members collection can be displayed. Phone, class, student ID, address are NOT currently collected. Firebase Authentication user-only accounts without a matching Firestore members document will NOT appear.

To deploy: extract ZIP and upload the extracted site folder to your existing Netlify site under Deploys. Keep Firestore rules from firestore-admin.rules in Firebase Console, unless you have custom rules that need merging.

Security: Admin checked via verified email and Firestore security rules; don't permit ordinary users to read the whole members collection.
