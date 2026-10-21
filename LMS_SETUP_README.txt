LEARNINGHUB NVQ LEVEL 05 – LMS UPDATE

Deployment:
1. BACK UP the existing site and Firebase rules first.
2. Extract this ZIP. Upload the contents of this folder (index.html at root) to Netlify Deploys.
3. In Firebase Console > Firestore Database > Rules, replace the rules with firestore.rules and Publish.
4. Confirm Authentication > Settings > Authorized domains contains your Netlify domain.
5. Sign in as verified admin sadilaperera4545@gmail.com. Open admin.html then LMS Manager (manage.html).
6. Create an announcement, assignment, resource, event and practice quiz. Test them with a separate verified member.
7. Check Storage, Firestore and Hosting free quotas and costs.

New pages:
student-dashboard.html, profile.html, learning.html, academics.html, manage.html
New scripts: lms-student.js, lms-admin.js and styles lms.css

IMPORTANT LIMITATIONS:
- Assignment submissions accept HTTPS links, NOT file uploads; do not paste sensitive personal file links.
- Practice quiz answers are shipped to the browser and scored in the browser, so they are NOT secure official tests. Scores may be manipulated.
- Progress is self-reported. NOT an official graded assessment.
- Uploaded original PDF notes remain static files accessible to anyone with a direct public URL; for truly private PDFs use storage with authorization.
- New Firestore features require published rules and an internet connection. Firebase usage can incur charges beyond free quotas.
- Admin authorization uses a single verified email in both firebase-auth.js and Firestore Rules. For advanced roles, move to secure server-managed custom claims.
- Firebase Chat code is unchanged; verify blocking/chat functionality after deploy.
- Existing project credentials are web app identifiers, not service account keys. Do NOT include private keys in client code.
- Admin and student content is real-time. For production scale, paginate collections; the examples limit results.

Test checklist: [ ] login [ ] email verify [ ] member registration [ ] admin [ ] member list [ ] chat [ ] blocked account [ ] profile save [ ] progress [ ] announcements [ ] resources [ ] assignments [ ] submission [ ] MCQ practice [ ] timetable [ ] dark mode [ ] mobile [ ] PDF links
