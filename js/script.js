/* =========================================================
   CSC401 — Simple HTML Form
   script.js — client-side validation + small UX touches
   ========================================================= */

(() => {
  'use strict';

  const form = document.getElementById('registrationForm');
  const successBox = document.getElementById('formSuccess');
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('togglePassword');

  /* -----------------------------------------------------
     1. Read every field into a plain object
     ----------------------------------------------------- */
  function getValues() {
    const data = new FormData(form);
    return {
      fullName:        String(data.get('fullName') ?? '').trim(),
      email:           String(data.get('email') ?? '').trim(),
      phone:           String(data.get('phone') ?? '').trim(),
      course:          String(data.get('course') ?? ''),
      level:           String(data.get('level') ?? ''),
      password:        String(data.get('password') ?? ''),
      confirmPassword: String(data.get('confirmPassword') ?? ''),
      terms:           form.elements.terms.checked
    };
  }

  /* -----------------------------------------------------
     2. Validation rules
        Each rule returns `true` when valid,
        or an error message string when invalid.
     ----------------------------------------------------- */
  const rules = {
    fullName: (v) =>
      /^[A-Za-z][A-Za-z\s'.-]{1,49}$/.test(v) ||
      'Enter your full name (2–50 letters).',

    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v) ||
      'Enter a valid email, e.g. ada@example.com.',

    phone: (v) =>
      v === '' || /^\+?\d[\d\s-]{6,14}$/.test(v) ||
      'Enter 7–15 digits, or leave this field empty.',

    course: (v) =>
      v !== '' || 'Choose a course.',

    level: (v) =>
      v !== '' || 'Select your level.',

    password: (v) =>
      (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)) ||
      'Use at least 8 characters, including a letter and a number.',

    confirmPassword: (v, all) =>
      (v !== '' && v === all.password) || 'Passwords do not match.',

    terms: (v) =>
      v === true || 'Please accept the terms to continue.'
  };

  /* -----------------------------------------------------
     3. Paint the result on screen
     ----------------------------------------------------- */
  const fieldOf = (name) => form.querySelector(`[data-field="${name}"]`);

  function setState(name, message) {
    const wrapper = fieldOf(name);
    if (!wrapper) return;

    const invalid = Boolean(message);
    const errorEl = wrapper.querySelector('.error');

    wrapper.classList.toggle('is-invalid', invalid);
    wrapper.classList.toggle('is-valid', !invalid);
    if (errorEl) errorEl.textContent = message;

    wrapper.querySelectorAll('input, select').forEach((el) => {
      if (invalid) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
  }

  function validateField(name) {
    const values = getValues();
    const result = rules[name](values[name], values);
    const message = result === true ? '' : String(result);
    setState(name, message);
    return message === '';
  }

  function clearAllStates() {
    form.querySelectorAll('[data-field]').forEach((wrapper) => {
      wrapper.classList.remove('is-invalid', 'is-valid');
      const errorEl = wrapper.querySelector('.error');
      if (errorEl) errorEl.textContent = '';
      wrapper.querySelectorAll('input, select').forEach((el) => {
        el.removeAttribute('aria-invalid');
      });
    });
  }

  /* -----------------------------------------------------
     4. Live validation
        - validate on blur / change
        - after a field has been touched, validate as the user types
     ----------------------------------------------------- */
  const touched = new Set();

  Object.keys(rules).forEach((name) => {
    const wrapper = fieldOf(name);
    if (!wrapper) return;

    wrapper.querySelectorAll('input, select').forEach((control) => {
      control.addEventListener('blur', () => {
        touched.add(name);
        validateField(name);
      });

      control.addEventListener('change', () => {
        touched.add(name);
        validateField(name);
      });

      control.addEventListener('input', () => {
        if (touched.has(name)) validateField(name);
      });
    });
  });

  // Changing the password should re-check "confirm password" if it was touched.
  passwordInput.addEventListener('input', () => {
    if (touched.has('confirmPassword')) validateField('confirmPassword');
  });

  /* -----------------------------------------------------
     5. Show / hide password
     ----------------------------------------------------- */
  function resetPasswordToggle() {
    passwordInput.type = 'password';
    toggleBtn.textContent = 'Show';
    toggleBtn.setAttribute('aria-pressed', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    toggleBtn.textContent = show ? 'Hide' : 'Show';
    toggleBtn.setAttribute('aria-pressed', String(show));
    passwordInput.focus();
  });

  /* -----------------------------------------------------
     6. Submit
     ----------------------------------------------------- */
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const names = Object.keys(rules);
    names.forEach((name) => touched.add(name));

    // `.map` runs every validator, so all errors show at once.
    const results = names.map((name) => validateField(name));
    const firstInvalid = names.find((name, i) => !results[i]);

    if (firstInvalid) {
      successBox.hidden = true;
      const control = fieldOf(firstInvalid).querySelector('input, select');
      if (control) control.focus();
      return;
    }

    const fullName = getValues().fullName;

    form.reset(); // also fires the "reset" handler below
    successBox.textContent = `Thanks, ${fullName}! Your registration was submitted successfully.`;
    successBox.hidden = false;
    successBox.focus();
  });

  /* -----------------------------------------------------
     7. Reset
     ----------------------------------------------------- */
  form.addEventListener('reset', () => {
    clearAllStates();
    touched.clear();
    successBox.hidden = true;
    successBox.textContent = '';
    resetPasswordToggle();
  });
})();