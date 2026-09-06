// GA4 is configured server-side through /api/ga-config so the Measurement ID
// can live in Vercel Environment Variables without being hard-coded here.
(async function initGA4() {
  try {
    const response = await fetch('/api/ga-config', { cache: 'no-store' });
    if (!response.ok) return;
    const { measurementId } = await response.json();
    if (!measurementId || measurementId === 'G-XXXXXXXXXX' || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(tag);

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search
    });
  } catch (error) {
    console.warn('GA4 did not initialise', error);
  }
})();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const formContent = document.getElementById('form-content');
const successPanel = document.getElementById('form-success-panel');
const turnstileContainer = document.getElementById('turnstile-widget');
const turnstileTokenInput = document.getElementById('turnstile-token');
let turnstileWidgetId = null;

const waitForTurnstile = () => new Promise((resolve, reject) => {
  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    if (window.turnstile && typeof window.turnstile.render === 'function') {
      clearInterval(timer);
      resolve(window.turnstile);
    } else if (attempts >= 100) {
      clearInterval(timer);
      reject(new Error('Security verification could not load. Please refresh and try again.'));
    }
  }, 100);
});

if (form && statusEl && formContent && successPanel) {
  const submitButton = form.querySelector('.submit-button');

  const initTurnstile = async () => {
    if (!turnstileContainer || !turnstileTokenInput) return;

    try {
      const response = await fetch('/api/turnstile-config', { cache: 'no-store' });
      if (!response.ok) throw new Error('Security verification is not configured.');
      const { siteKey } = await response.json();
      if (!siteKey) throw new Error('Security verification is not configured.');

      const turnstile = await waitForTurnstile();
      turnstileWidgetId = turnstile.render(turnstileContainer, {
        sitekey: siteKey,
        theme: 'light',
        size: 'flexible',
        appearance: 'always',
        action: 'contact_form',
        callback: token => {
          turnstileTokenInput.value = token;
          submitButton.disabled = false;
          if (statusEl.classList.contains('error')) {
            statusEl.textContent = '';
            statusEl.className = 'form-status';
          }
        },
        'expired-callback': () => {
          turnstileTokenInput.value = '';
          submitButton.disabled = true;
          setStatus('Security verification expired. Please complete it again.', 'error');
        },
        'error-callback': () => {
          turnstileTokenInput.value = '';
          submitButton.disabled = true;
          setStatus('Security verification could not complete. Please try again.', 'error');
        }
      });
    } catch (error) {
      submitButton.disabled = true;
      setStatus(error.message || 'Security verification could not load. Please refresh and try again.', 'error');
    }
  };

  const setStatus = (message, type = '') => {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`.trim();
  };

  const markValidity = () => {
    form.querySelectorAll('input, textarea').forEach(field => {
      field.setAttribute('aria-invalid', field.validity.valid ? 'false' : 'true');
    });
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    markValidity();

    if (!form.checkValidity()) {
      setStatus('Please complete all fields with a valid email address.', 'error');
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (!turnstileTokenInput || !turnstileTokenInput.value) {
      setStatus('Please complete the security verification.', 'error');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    setStatus('Sending your enquiry…');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      let result = {};
      try { result = await response.json(); } catch (_) {}

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Your message could not be sent. Please try again.');
      }

      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
      form.classList.add('is-sent');
      formContent.hidden = true;
      successPanel.hidden = false;
      successPanel.focus({ preventScroll: true });
    } catch (error) {
      setStatus(error.message || 'Your message could not be sent. Please try again.', 'error');
      submitButton.innerHTML = 'Send enquiry <span aria-hidden="true">→</span>';
      if (window.turnstile && turnstileWidgetId !== null) {
        window.turnstile.reset(turnstileWidgetId);
        turnstileTokenInput.value = '';
        submitButton.disabled = true;
      } else {
        submitButton.disabled = false;
      }
    }
  });

  initTurnstile();
}


// Robust back-to-top control: preserve the #top fallback while ensuring
// consistent scrolling across browsers and sticky-header layouts.
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#top');
  });
}
