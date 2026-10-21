import {auth,db,ready,isAdmin} from './firebase-auth.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {collection,query,orderBy,limit,onSnapshot,doc,updateDoc,deleteDoc} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const $ = id => document.getElementById(id);
const status = $('admin-status');
const membersBody = $('members-body');
const messagesBody = $('messages-body');
const dialog = $('member-dialog');
let members = [];
let messages = [];
let stopMembers = null;
let stopMessages = null;
let currentAdmin = null;
function tableInfo(target, message, isError = false) {
  target.replaceChildren();
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = target === membersBody ? 7 : 4;
  td.textContent = message;
  td.style.padding = '22px';
  td.style.color = isError ? '#b42342' : 'var(--lh-sub, #795B6B)';
  tr.append(td);
  target.append(tr);
}
function reportError(area, error) {
  const detail = error?.message || String(error);
  status.textContent = `${area}: ${detail}`;
  tableInfo(area === 'Members' ? membersBody : messagesBody,
    `Unable to load ${area.toLowerCase()}: ${detail}`, true);
  console.error(`${area} Firestore error`, error);
}

const fmtDate = t => t?.toDate?.()?.toLocaleString() || '—';

function makeCell(tr, text) {
  const td = document.createElement('td');
  td.textContent = text ?? '—';
  tr.append(td);
  return td;
}
function action(text, actionName, id, dangerous = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'admin-action' + (dangerous ? ' admin-danger' : '');
  button.dataset.action = actionName;
  button.dataset.id = id;
  button.textContent = text;
  return button;
}
function drawMembers() {
  const term = $('member-filter').value.trim().toLowerCase();
  const fragment = document.createDocumentFragment();
  const filtered = members.filter(m => `${m.name || ''} ${m.email || ''} ${m.uid || m.id}`.toLowerCase().includes(term));
  for (const m of filtered) {
    const tr = document.createElement('tr');
    makeCell(tr, m.name || '—');
    makeCell(tr, m.email || '—');
    const uidCell = makeCell(tr, m.uid || m.id);
    uidCell.className = 'admin-uid';
    makeCell(tr, fmtDate(m.createdAt || m.joinedAt));
    makeCell(tr, m.email?.toLowerCase() === 'sadilaperera4545@gmail.com' ? 'Admin' : (m.role || 'Member'));
    const state = m.status === 'blocked' ? 'blocked' : 'active';
    const statusCell = makeCell(tr, m.email?.toLowerCase() === 'sadilaperera4545@gmail.com' ? 'Admin' : state);
    statusCell.className = 'admin-tag ' + state;
    const td = makeCell(tr, '');
    td.className = 'admin-button-row';
    td.append(action('Details', 'details', m.id));
    if (m.id !== currentAdmin?.uid) {
      td.append(action(state === 'blocked' ? 'Unblock' : 'Block', 'block', m.id, state !== 'blocked'));
    }
    fragment.append(tr);
  }
  if (!filtered.length) {
    const tr = document.createElement('tr');
    const td = makeCell(tr, 'No matching members');
    td.colSpan = 7;
    fragment.append(tr);
  }
  membersBody.replaceChildren(fragment);
}
function drawMessages() {
  const fragment = document.createDocumentFragment();
  for (const m of messages) {
    const tr = document.createElement('tr');
    makeCell(tr, m.name || 'Member');
    makeCell(tr, m.text || '');
    makeCell(tr, fmtDate(m.createdAt));
    const td = makeCell(tr, '');
    td.append(action('Delete', 'delete-message', m.id, true));
    fragment.append(tr);
  }
  if (!messages.length) {
    const tr = document.createElement('tr');
    const td = makeCell(tr, 'No messages yet');
    td.colSpan = 4;
    fragment.append(tr);
  }
  messagesBody.replaceChildren(fragment);
}
$('member-filter').addEventListener('input', () => { try { drawMembers(); } catch (error) { reportError('Members', error); } });
$('close-member-dialog').addEventListener('click', () => dialog.close());

membersBody.addEventListener('click', async event => {
  const button = event.target.closest('button[data-action]');
  if (!button || !currentAdmin || !isAdmin(currentAdmin)) return;
  const member = members.find(m => m.id === button.dataset.id);
  if (!member) return;
  if (button.dataset.action === 'details') {
    const details = $('member-details');
    details.replaceChildren();
    for (const [key, value] of [
      ['Name', member.name || '—'],
      ['Email', member.email || '—'],
      ['UID', member.uid || member.id],
      ['Joined', fmtDate(member.createdAt || member.joinedAt)],
      ['Access', member.status === 'blocked' ? 'Blocked' : 'Active'],
      ['Role', member.email?.toLowerCase() === 'sadilaperera4545@gmail.com' ? 'Admin' : (member.role || 'Member')],
      ['Profile data', 'Firebase Firestore / members']
    ]) {
      const line = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = key + ': ';
      line.className = 'member-detail-row';
      line.append(title, document.createTextNode(String(value)));
      details.append(line);
    }
    dialog.showModal();
    return;
  }
  if (button.dataset.action === 'block') {
    if (member.id === currentAdmin.uid) return;
    const next = member.status === 'blocked' ? 'active' : 'blocked';
    if (!confirm(`${next === 'blocked' ? 'Block' : 'Unblock'} ${member.email || member.name || member.id}?`)) return;
    button.disabled = true;
    try {
      await updateDoc(doc(db, 'members', member.id), {status: next});
      status.textContent = `Member ${next}: ${member.email || member.id}`;
    } catch (err) { status.textContent = `Could not update member: ${err.message}`; }
    finally { button.disabled = false; }
  }
});
messagesBody.addEventListener('click', async event => {
  const button = event.target.closest('button[data-action="delete-message"]');
  if (!button || !currentAdmin || !isAdmin(currentAdmin)) return;
  if (!confirm('Permanently delete this chat message?')) return;
  button.disabled = true;
  try {
    await deleteDoc(doc(db, 'learning_hub_messages', button.dataset.id));
    status.textContent = 'Chat message deleted.';
  } catch (err) { status.textContent = `Could not delete message: ${err.message}`; }
  finally { button.disabled = false; }
});

if (!ready) {
  status.textContent = 'Firebase is not configured. Check firebase-config.js.';
} else {
  onAuthStateChanged(auth, user => {
    stopMembers?.(); stopMessages?.();
    stopMembers = null; stopMessages = null;
    currentAdmin = user;
    $('admin-content').hidden = true;
    if (!user) { status.textContent = 'Please sign in as the admin.'; return; }
    if (!isAdmin(user)) { status.textContent = 'Access denied. Verified administrator required.'; return; }
    $('admin-content').hidden = false;
    status.textContent = 'Admin Access Granted: ' + user.email;
    tableInfo(membersBody, 'Loading registered members…');
    tableInfo(messagesBody, 'Loading chat messages…');
    stopMembers = onSnapshot(collection(db, 'members'), snapshot => {
      members = snapshot.docs.map(d => ({...d.data(), id:d.id}));
      $('total-members').textContent = String(members.length);
      $('active-members').textContent = String(members.filter(m => m.status !== 'blocked').length);
      $('blocked-members').textContent = String(members.filter(m => m.status === 'blocked').length);
      try { drawMembers(); }
      catch (error) { reportError('Members', error); }
    }, err => reportError('Members', err));
    stopMessages = onSnapshot(query(collection(db, 'learning_hub_messages'), orderBy('createdAt', 'desc'), limit(100)), snapshot => {
      messages = snapshot.docs.map(d => ({...d.data(), id:d.id}));
      $('total-messages').textContent = String(messages.length);
      try { drawMessages(); }
      catch (error) { reportError('Messages', error); }
    }, err => reportError('Messages', err));
  });
}
