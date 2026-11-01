
---

## 2. Requirements

**To run it**
- Any modern browser: Chrome, Edge, Firefox, Safari (or an equivalent).
- No installation, no Node.js, no npm, no build tools required.

**Optional (nice to have)**
- A code editor such as VS Code.
- A local development server (VS Code *Live Server* extension, or `python -m http.server`).
  Double-clicking `index.html` works too, since there are no modules or fetch calls.

**Knowledge assumed**
- Basic HTML elements and attributes
- Basic CSS selectors and the box model
- Basic JavaScript: functions, objects, events, DOM queries

---

## 3. How I made it

### Step 1 — Markup (`index.html`)
- Used **semantic HTML5**: `<main>`, `<section>`, `<header>`, `<form>`, `<fieldset>`, `<legend>`.
- Every control has a `<label for="…">` so clicking the label focuses the field.
- Grouped the level options in a `<fieldset>` with a `<legend>` (correct for radio groups).
- Added `novalidate` to the form so **JavaScript** handles validation instead of the browser's
  default pop-ups, giving consistent, styled error messages.
- Kept `required` attributes anyway — they document the rules and are announced by screen readers.
- Each field has an empty `<p class="error">` with an `id`, linked to its input via
  `aria-describedby`, so the message is read out by assistive technology.
- Wrapped every field group in `<div class="field" data-field="…">`. The `data-field` attribute
  lets the JavaScript find a field's wrapper and error slot by name — no fragile DOM walking.

### Step 2 — Styling (`css/style.css`)
- Defined all colours, radii and shadows as **CSS custom properties** in `:root`, so the theme can
  be changed in one place.
- Used **CSS Grid** for the form (`display: grid; gap: …`) — no margin hacks.
- Mobile-first, fluid layout: `clamp()` for padding and font sizes, a `max-width` card, and a
  media query that stacks the buttons on narrow screens.
- Gave inputs a clear `:focus` ring and visible `:focus-visible` outlines on buttons, radios and
  checkboxes for keyboard users.
- Created two validation states, `.is-invalid` and `.is-valid`, driven by classes the JavaScript
  toggles. Empty error paragraphs use `.error:empty { display: none }` so no blank space is left
  when there is no error.

### Step 3 — Behaviour (`js/script.js`)
The script is one IIFE with `'use strict'`, split into small functions:

1. **`getValues()`** — reads the whole form into one plain object using `FormData`.
2. **`rules`** — an object mapping each field name to a validator function. Each validator returns
   `true` when the value is valid, or an error message string when it is not. Keeping the rules in
   one place makes them easy to read, change and test.
3. **`setState(name, message)`** — toggles the `is-invalid` / `is-valid` classes, writes the error
   text, and sets or removes `aria-invalid` on the controls.
4. **`validateField(name)`** — runs the rule for a single field and updates the UI.
5. **Live validation** — each control validates on `blur` and `change`; once a field has been
   "touched", it re-validates on every keystroke so errors disappear as soon as they are fixed.
   Changing the password re-checks "confirm password" too.
6. **Submit handler** — `event.preventDefault()`, validates **all** fields at once (using `.map`
   so no validator is skipped), and focuses the first invalid control if anything failed.
   On success it resets the form and shows a confirmation message in a `role="status"` box.
7. **Password toggle** — the Show/Hide button swaps `type="password"` and `type="text"` and keeps
   `aria-pressed` in sync.

### Step 4 — Testing
Checked by hand in Chrome and Firefox:
- Submitting an empty form shows every error at once and focuses the first bad field.
- Typing a valid value clears that field's error immediately.
- Mismatched passwords, a 7-character password, and a password with no digit are all rejected.
- Unchecking the terms box and submitting is rejected.
- An empty phone number is accepted (the field is optional).
- The layout holds up at 320 px, 768 px and 1440 px widths.
- The whole form can be completed with the keyboard only (Tab / Shift+Tab / Space / Enter).

---

## 4. Features

- Semantic, accessible HTML5 form
- Responsive card layout (mobile → desktop)
- Inline, per-field error messages with `aria-invalid` and `aria-describedby`
- Live validation on blur, plus re-validation while typing after the first attempt
- Password confirmation check
- Show / Hide password toggle
- Optional phone field (validated only if filled in)
- Success message announced with `role="status"`
- Reset button that also clears all validation states

---

## 5. How to run

**Option A — just open it**
1. Download or clone the folder.
2. Double-click `index.html`.

**Option B — local server (recommended)**
```bash
# from inside the project folder
python -m http.server 8000
# then visit http://localhost:8000