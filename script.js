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

if (form && statusEl) {
  const submitButton = form.querySelector('.submit-button');

  const setStatus = (message, type = '') => {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`.trim();
  };

  const markValidity = () => {
    form.querySelectorAll('input:not([type="hidden"]), textarea').forEach(field => {
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

      if (!response.ok) {
        throw new Error(result.error || 'Your message could not be sent. Please try again.');
      }

      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
      setStatus('Thanks — your enquiry has been sent. I’ll get back to you directly.', 'success');
    } catch (error) {
      setStatus(error.message || 'Your message could not be sent. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send enquiry <span aria-hidden="true">→</span>';
    }
  });
}
