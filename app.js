import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://your-project-ref.supabase.co'; // <- from dashboard
const SUPABASE_ANON_KEY = 'your-anon-key';                  // <- from dashboard

const supabase = createClient(https://siezhoprxbmpejslvvwo.supabase.co, sb_secret_WqNKwCk-SrpOPaqGFVZsvA_qFEhYjA_);

// --- simple UI hooks (assumes elements exist in index.html) ---
const saveBtn = document.getElementById('save');
const loadBtn = document.getElementById('load');
const output = document.getElementById('output');

// Example: save current state object
async function saveCampaign(name, stateObj) {
  // if you want owner tracking, sign-in flow is needed (magic link)
  const { data, error } = await supabase
    .from('campaigns')
    .insert([{ name, state: stateObj }])
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