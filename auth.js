(() => {
  const accountButton = document.querySelector('#account-button');
  const accountLabel = document.querySelector('#account-label');
  const accountNote = document.querySelector('#account-note');
  let profile = null;
  let googleConfigured = false;
  let saveTimer = 0;
  let noteTimer = 0;

  function note(message) {
    accountNote.textContent = message;
    accountNote.hidden = false;
    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(() => { accountNote.hidden = true; }, 5000);
  }

  function publish(progress = null) {
    const signedIn = Boolean(profile);
    accountLabel.textContent = signedIn ? (profile.name?.split(' ')[0] || 'My account') : googleConfigured ? 'Sign in' : 'Cloud soon';
    accountButton.disabled = !signedIn && !googleConfigured;
    accountButton.setAttribute('aria-label', signedIn ? `Signed in as ${profile.name || profile.email}. Sign out` : googleConfigured ? 'Sign in with Google' : 'Cloud sign-in unavailable until setup');
    accountButton.title = signedIn ? `${profile.email} · click to sign out` : googleConfigured ? 'Sign in with Google to sync your game' : 'Cloud sign-in is not configured yet';
    if (signedIn) accountNote.hidden = true;
    window.dispatchEvent(new CustomEvent('bao-cloud-state', { detail: { signedIn, profile, progress } }));
  }

  async function login() {
    if (!googleConfigured) {
      note('Cloud sign-in is not set up yet. Guest progress resets when this page reloads.');
      return;
    }
    window.location.assign('/api/auth/google');
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch {}
    profile = null;
    publish();
    note('Signed out. Guest progress will reset when this page reloads.');
  }

  function saveProgress(progress) {
    if (!profile) return;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/progress', {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress })
        });
        if (!response.ok) throw new Error('Cloud save failed');
      } catch {
        note('Cloud sync failed. Your progress stays in this page until it reloads.');
      }
    }, 350);
  }

  window.BaoCloud = { get signedIn() { return Boolean(profile); }, login, logout, saveProgress };

  async function initialize() {
    const loginStatus = new URLSearchParams(window.location.search).get('login');
    if (loginStatus) window.history.replaceState({}, '', window.location.pathname);
    try {
      const configResponse = await fetch('/api/auth/config', { credentials: 'same-origin' });
      if (configResponse.ok) {
        const config = await configResponse.json();
        googleConfigured = Boolean(config.googleConfigured);
      }
    } catch {}

    try {
      const response = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (response.ok) {
        const result = await response.json();
        profile = result.profile || null;
        publish(result.progress || null);
        return;
      }
    } catch {}

    publish();
    if (loginStatus === 'error') note('Google sign-in did not finish. Please try again.');
    else if (loginStatus === 'setup') note('Cloud sign-in is not configured yet. Guest saves work on this device.');
    else if (!googleConfigured) note('Guest mode is on. Progress resets when this page reloads because cloud sign-in is not set up yet.');
  }

  initialize();
})();
