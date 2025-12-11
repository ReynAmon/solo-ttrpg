import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- AUTH HANDLING ---
const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');
const authStatus = document.getElementById('auth-status');

// Send magic link
if (loginBtn) loginBtn.onclick = async () => {
  const email = emailInput.value;
  const { error } = await supabase.auth.signInWithOtp({ email });
  authStatus.textContent = error ? error.message : "Magic link sent!";
};

// Logout
if (logoutBtn) logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  authStatus.textContent = "Logged out.";
};

// Listen for auth changes (user logs in via magic link)
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    authStatus.textContent = "Logged in as: " + session.user.email;
  } else {
    authStatus.textContent = "Not logged in.";
  }
});

const SUPABASE_URL = 'https://siezhoprxbmpejslvvwo.supabase.co'; // <- from dashboard
const SUPABASE_ANON_KEY = 'sb_secret_WqNKwCk-SrpOPaqGFVZsvA_qFEhYjA_'; // <- from dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- simple UI hooks (assumes elements exist in index.html) ---
const saveBtn = document.getElementById('save');
const loadBtn = document.getElementById('load');
const output = document.getElementById('output');

// Example: save current state object
async function saveCampaign(name, stateObj) {
  // if you want owner tracking, sign-in flow is needed (magic link)
async function saveCampaign(name, stateObj) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    output.textContent = "You must log in first.";
    return;
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert([{
      owner: user.id,
      name,
      state: stateObj
    }])
    .select()
    .single();

  if (error) { output.textContent = 'Save error: ' + error.message; return null; }
  output.textContent = 'Saved id: ' + data.id;
  return data;
}

// Example: load last campaign
async function loadLast() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) { output.textContent = 'Load error: ' + error.message; return null; }
  if (!data) { output.textContent = 'No campaigns found.'; return null; }
  output.textContent = 'Loaded: ' + JSON.stringify(data.state);
  return data;
}

// Wire the buttons (create buttons in HTML with ids save/load)
if (saveBtn) saveBtn.onclick = () => saveCampaign('My Solo Run', { hp: 10, notes: ['start'] });
if (loadBtn) loadBtn.onclick = () => loadLast();