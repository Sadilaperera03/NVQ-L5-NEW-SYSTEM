import {auth,ready} from './firebase-auth.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
// Guard client-side navigation; Firestore rules enforce database access separately.
if (!ready || !auth) {
  location.replace('login.html');
} else {
  onAuthStateChanged(auth,user=>{
    if (!user) location.replace('login.html');
    else document.documentElement.style.visibility='visible';
  },error=>{console.error('Authentication check failed',error);location.replace('login.html');});
}
