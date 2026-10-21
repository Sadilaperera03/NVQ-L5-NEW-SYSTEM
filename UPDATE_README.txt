LEARNINGHUB – Firebase verification and dynamic forgot password update

1. Upload contents of this nvq5 folder to your Netlify site.
2. Login page now expands the Forgot Password form without leaving the page.
3. After registration, the site displays Send Verification Email and I've Verified – Continue buttons.
4. Firebase verification and password-reset emails still contain action links. You can customize the email template in Firebase Console > Authentication > Templates. You cannot replace the secure action link with a website-only button.
5. Add the deployed Netlify domain under Firebase Authentication > Settings > Authorized domains.
6. Test registration, email verification, password reset and member chat with a test user.
7. Website is static: PDFs linked directly are not privately protected just by the login redirect.
