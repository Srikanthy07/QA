/**
 * feedback.js — Feedback Form Logic
 * Handles validation, character counting, and form submission via fetch to feedback.php
 */
(function () {
  'use strict';

  /* ── DOM refs ── */
  const form         = document.getElementById('feedbackForm');
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const msgInput     = document.getElementById('message');
  const charCountEl  = document.getElementById('charCount');
  const submitBtn    = document.getElementById('submitBtn');

  const successAlert = document.getElementById('successAlert');
  const errorAlert   = document.getElementById('errorAlert');
  const successMsg   = document.getElementById('successMessage');
  const errorMsg     = document.getElementById('errorMessage');

  const EMAIL_REGEX  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form) return;  // guard: only run on pages with the form

  /* ── Live character counter ── */
  msgInput.addEventListener('input', () => {
    charCountEl.textContent = msgInput.value.length;
  });

  /* ── Clear field errors on input ── */
  [nameInput, emailInput, msgInput].forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
  });

  /* ─────────────────────────────
     Helpers
  ───────────────────────────── */
  function clearFieldError(el) {
    el.classList.remove('invalid');
    const errEl = document.getElementById(el.id + 'Error');
    if (errEl) errEl.textContent = '';
  }

  function setFieldError(el, message) {
    el.classList.add('invalid');
    const errEl = document.getElementById(el.id + 'Error');
    if (errEl) errEl.textContent = message;
    if (!el._focused) { el.focus(); el._focused = true; }
  }

  function hideAlerts() {
    successAlert.classList.remove('show');
    errorAlert.classList.remove('show');
  }

  function showSuccess(message) {
    hideAlerts();
    successMsg.textContent = message || 'Thank you! Your feedback has been submitted successfully.';
    successAlert.classList.add('show');
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showError(message) {
    hideAlerts();
    errorMsg.textContent = message || 'Something went wrong. Please try again.';
    errorAlert.classList.add('show');
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('loading', isLoading);
  }

  /* ─────────────────────────────
     Client-side Validation
  ───────────────────────────── */
  function validateForm() {
    let valid = true;

    // Reset focus guard
    [nameInput, emailInput, msgInput].forEach(el => { el._focused = false; });

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (!name) {
      setFieldError(nameInput, 'Name is required.');
      valid = false;
    } else if (name.length < 2 || name.length > 100) {
      setFieldError(nameInput, 'Name must be between 2 and 100 characters.');
      valid = false;
    }

    if (!email) {
      setFieldError(emailInput, 'Email is required.');
      valid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setFieldError(emailInput, 'Please provide a valid email address.');
      valid = false;
    }

    if (!message) {
      setFieldError(msgInput, 'Message is required.');
      valid = false;
    } else if (message.length < 10 || message.length > 2000) {
      setFieldError(msgInput, 'Message must be between 10 and 2000 characters.');
      valid = false;
    }

    return valid;
  }

  /* ─────────────────────────────
     Apply server field errors
  ───────────────────────────── */
  function applyServerFieldErrors(errors) {
    if (!errors) return;
    const map = { name: nameInput, email: emailInput, message: msgInput };
    Object.keys(errors).forEach(field => {
      if (map[field]) setFieldError(map[field], errors[field]);
    });
  }

  /* ─────────────────────────────
     Submit Handler
  ───────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlerts();

    if (!validateForm()) return;

    const payload = {
      name:    nameInput.value.trim(),
      email:   emailInput.value.trim(),
      message: msgInput.value.trim(),
    };

    setLoading(true);

    try {
      const response = await fetch('feedback.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await response.json(); } catch (_) { /* non-JSON body */ }

      if (response.ok && data && data.success) {
        showSuccess(data.message);
        form.reset();
        charCountEl.textContent = '0';
        [nameInput, emailInput, msgInput].forEach(el => el.classList.remove('invalid'));
      } else if (response.status === 400 && data) {
        applyServerFieldErrors(data.errors);
        showError(data.message || 'Please correct the highlighted fields and try again.');
      } else if (data && data.message) {
        showError(data.message);
      } else {
        showError('Unable to submit feedback right now. Please try again later.');
      }

    } catch (networkErr) {
      console.error('Feedback submission error:', networkErr);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  });

})();
