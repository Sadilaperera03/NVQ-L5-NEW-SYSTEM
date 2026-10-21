import {firebaseConfig} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getFirestore} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
export const ADMIN_EMAIL='sadilaperera4545@gmail.com';
export const ready=Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId && firebaseConfig.authDomain);
export const app=ready?initializeApp(firebaseConfig):null;
export const auth=app?getAuth(app):null;
export const db=app?getFirestore(app):null;
export function isAdmin(user){return Boolean(user && user.email?.toLowerCase()===ADMIN_EMAIL && user.emailVerified);}
