import {auth,db,ready,isAdmin} from './firebase-auth.js';
import {onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,signOut,updateProfile,sendPasswordResetEmail,reload} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {doc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const el = id => document.getElementById(id);
const status = el('login-status');
const form = el('login-form');
let signup = false;
let currentUser = null;

function showVerification(user) {
  el('verification-panel').hidden = !user || user.emailVerified;
  el('verify-button').hidden = !user || user.emailVerified;
  if (user && !user.emailVerified) {
    el('verification-status').textContent = `Verification required for ${user.email}. Check your inbox.`;
  }
}

function goToWebsite(user) {
  window.location.replace(isAdmin(user) ? 'admin.html' : 'home.html');
}

if (!ready) {
  status.textContent = 'Firebase is not configured. Check firebase-config.js.';
  el('login-submit').disabled = true;
  el('forgot-submit').disabled = true;
} else {
  onAuthStateChanged(auth, user => {
    currentUser = user;
    el('current-user').hidden = !user;
    el('signed-email').textContent = user ? user.email + (user.emailVerified ? ' (verified)' : ' (verification pending)') : '';
    el('admin-shortcut').hidden = !isAdmin(user);
    showVerification(user);
  });
}

el('switch-mode').addEventListener('click', () => {
  signup = !signup;
  el('forgot-panel').hidden = true;
  el('reset-button').setAttribute('aria-expanded','false');
  el('name-field').hidden = !signup;
  el('name-input').required = signup;
  el('login-password').autocomplete = signup ? 'new-password' : 'current-password';
  el('form-title').textContent = signup ? 'Create Member Account' : 'Member Login';
  el('login-submit').textContent = signup ? 'Create Account' : 'Sign in ↗';
  el('switch-mode').textContent = signup ? 'Already registered? Sign in' : 'New member? Create an account';
  status.textContent = '';
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!ready) return;
  const button = el('login-submit');
  button.disabled = true;
  status.textContent = 'Please wait…';
  const email = el('login-email').value.trim();
  const password = el('login-password').value;
  try {
    if (signup) {
      const name = el('name-input').value.trim().slice(0,60);
      if (!name) throw new Error('Please enter your name.');
      const {user} = await createUserWithEmailAndPassword(auth,email,password);
      await updateProfile(user,{displayName:name});
      await setDoc(doc(db,'members',user.uid),{
        uid:user.uid,email:user.email,name,role:'member',createdAt:serverTimestamp()
      });
      try {
        await sendEmailVerification(user);
        status.textContent = 'Account created. Verification email sent!';
      } catch (mailError) {
        status.textContent = 'Account created, but verification email could not be sent. Please use Send Verification Email.';
        console.error(mailError);
      }
      showVerification(user);
    } else {
      const {user} = await signInWithEmailAndPassword(auth,email,password);
      if (!user.emailVerified) {
        status.textContent = 'Please verify your email before continuing.';
        showVerification(user);
      } else {
        goToWebsite(user);
      }
    }
  } catch (error) {
    console.error('Login/registration error:',error);
    const errors = {
      'auth/email-already-in-use':'This email is already registered. Sign in instead.',
      'auth/invalid-credential':'Incorrect email or password.',
      'auth/invalid-email':'Enter a valid email address.',
      'auth/weak-password':'Password must have at least six characters.',
      'permission-denied':'Firestore permission denied. Check Firestore Security Rules.'
    };
    status.textContent = errors[error.code] || error.message || 'Something went wrong.';
  } finally {
    button.disabled = false;
  }
});

el('reset-button').addEventListener('click', () => {
  const panel = el('forgot-panel');
  panel.hidden = !panel.hidden;
  el('reset-button').setAttribute('aria-expanded',String(!panel.hidden));
  if (!panel.hidden) {
    el('forgot-email').value = el('login-email').value.trim();
    el('forgot-email').focus();
  }
});
el('forgot-back').addEventListener('click', () => {
  el('forgot-panel').hidden = true;
  el('reset-button').setAttribute('aria-expanded','false');
});
el('forgot-form').addEventListener('submit',async event => {
  event.preventDefault();
  if (!ready) return;
  const button = el('forgot-submit');
  const message = el('forgot-status');
  button.disabled = true;
  message.textContent = 'Sending password reset email…';
  try {
    await sendPasswordResetEmail(auth,el('forgot-email').value.trim());
    message.textContent = 'If this email has an account, a password reset email will arrive shortly. Check Spam too.';
  } catch(error) {
    if(error.code === 'auth/invalid-email') message.textContent = 'Enter a valid email address.';
    else if(error.code === 'auth/too-many-requests') message.textContent = 'Too many requests. Try again later.';
    else message.textContent = 'Unable to send reset email. Please try again later.';
    console.error(error);
  } finally { button.disabled = false; }
});

async function sendVerification() {
  const message = el('verification-status');
  if (!auth?.currentUser) {
    message.textContent = 'Please sign in first.';
    return;
  }
  try {
    await sendEmailVerification(auth.currentUser);
    message.textContent = 'Verification email sent. Check your inbox or Spam folder.';
  } catch(error) {
    message.textContent = error.code === 'auth/too-many-requests' ? 'Too many requests. Please wait and try again.' : 'Unable to send verification email: '+error.message;
  }
}
el('send-verification').addEventListener('click',sendVerification);
el('verify-button').addEventListener('click',sendVerification);
el('check-verification').addEventListener('click',async () => {
  const message = el('verification-status');
  if (!auth?.currentUser) {message.textContent='Please sign in first.';return;}
  try {
    await reload(auth.currentUser);
    await auth.currentUser.getIdToken(true);
    if (auth.currentUser.emailVerified) goToWebsite(auth.currentUser);
    else message.textContent='Email is not verified yet. Open the email and click the verification button/link first.';
  } catch(error) {message.textContent='Could not check verification. Please try again.';console.error(error);}
});
el('logout-button').addEventListener('click',async () => {
  try {await signOut(auth);window.location.replace('index.html');}
  catch(error) {status.textContent=error.message;}
});
