/* ================================================================
   script.js — is-a.dev JSON Generator
   Handles: record card creation, DNS conflict enforcement,
   real-time regex validation, JSON serialisation, and clipboard.
   Zero dependencies. Vanilla JS only.
   ================================================================ */

'use strict';

/* ── Record Rules ─────────────────────────────────────────────────
   isArray : true  → value serialised as a JSON array   ["..."]
   isArray : false → value serialised as a plain string "..."
   regex         → validated on every keystroke
   placeholder   → shown inside the dynamic input field
   ──────────────────────────────────────────────────────────────── */
const RECORD_RULES = {
  A: {
    isArray: true,
    placeholder: '192.168.1.1',
    regex: /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/,
  },
  AAAA: {
    isArray: true,
    placeholder: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    regex: /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/,
  },
  CNAME: {
    isArray: false,
    placeholder: 'username.github.io',
    regex: /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
  },
  MX: {
    isArray: true,
    placeholder: 'mx.example.com',
    regex: /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
  },
  TXT: {
    isArray: true,
    placeholder: 'v=spf1 include:_spf.google.com ~all',
    regex: /.+/,
  },
  URL: {
    isArray: false,
    placeholder: 'https://mywebsite.com',
    regex: /^https?:\/\/.+/,
  },
};

/* Tracks which record types are currently active (one card per type) */
let activeRecords = {};

/* ── Card Management ──────────────────────────────────────────── */

/**
 * Adds a new record-type card to the form.
 * Enforces one card per type and updates DNS conflict rules.
 *
 * @param {string} type - One of the keys in RECORD_RULES
 */
function addCard(type) {
  if (activeRecords[type]) return; // Guard: no duplicate cards
  activeRecords[type] = true;

  const container = document.getElementById('cardsContainer');
  const card = document.createElement('div');
  card.className = 'record-card';
  card.id = `card-${type}`;
  card.dataset.type = type;

  card.innerHTML = `
    <h3>${type} RECORD</h3>
    <button class="btn-del-card" onclick="removeCard('${type}')">X</button>
    <div class="inputs-wrapper" id="wrapper-${type}"></div>
  `;

  container.appendChild(card);
  addInputField(type); // Seed with one empty field

  // Array types (A, AAAA, MX, TXT) allow multiple values
  if (RECORD_RULES[type].isArray) {
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-input';
    addBtn.innerText = `+ ADD ANOTHER ${type} VALUE`;
    addBtn.onclick = () => addInputField(type);
    card.appendChild(addBtn);
  }

  enforceDNSConflicts();
  generateJSON();
}

/**
 * Removes the card for the given record type and cleans up state.
 *
 * @param {string} type - Record type to remove
 */
function removeCard(type) {
  const card = document.getElementById(`card-${type}`);
  if (card) card.remove();
  delete activeRecords[type];
  enforceDNSConflicts();
  generateJSON();
}

/* ── Input Field Management ───────────────────────────────────── */

/**
 * Appends a new text input inside the given record card's wrapper.
 * Inputs after the first also receive a delete button.
 *
 * @param {string} type - Record type the input belongs to
 */
function addInputField(type) {
  const wrapper = document.getElementById(`wrapper-${type}`);
  const row = document.createElement('div');
  row.className = 'input-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = RECORD_RULES[type].placeholder;
  input.className = 'record-value';
  input.oninput = function () {
    validateInput(this, type);
    generateJSON();
  };

  row.appendChild(input);

  // Show a per-row delete button only when there's already at least one row
  if (wrapper.children.length > 0) {
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-remove-input';
    delBtn.innerText = 'X';
    delBtn.onclick = function () {
      row.remove();
      generateJSON();
    };
    row.appendChild(delBtn);
  }

  wrapper.appendChild(row);
}

/* ── Validation ───────────────────────────────────────────────── */

/**
 * Applies or removes the `.invalid` CSS class based on regex match.
 * Empty fields are considered neutral (not invalid).
 *
 * @param {HTMLInputElement} input - The input element to check
 * @param {string}           type  - Record type for regex lookup
 */
function validateInput(input, type) {
  const val = input.value.trim();
  if (val === '') {
    input.classList.remove('invalid');
    return;
  }
  const isValid = RECORD_RULES[type].regex.test(val);
  input.classList.toggle('invalid', !isValid);
}

/* ── DNS Conflict Enforcement ─────────────────────────────────── */

/**
 * Implements the is-a.dev CI rule: a CNAME record cannot coexist
 * with A, AAAA, MX, or TXT records at the same node.
 *
 * Disables the relevant add-buttons to make invalid combinations
 * physically impossible to generate.
 */
function enforceDNSConflicts() {
  const hasCname  = !!activeRecords['CNAME'];
  const hasOthers = !!(
    activeRecords['A']    ||
    activeRecords['AAAA'] ||
    activeRecords['MX']   ||
    activeRecords['TXT']
  );

  setDisabled('btn-CNAME', hasOthers                        );
  setDisabled('btn-A',     hasCname || !!activeRecords['A'] );
  setDisabled('btn-AAAA',  hasCname || !!activeRecords['AAAA']);
  setDisabled('btn-MX',    hasCname || !!activeRecords['MX']);
  setDisabled('btn-TXT',   hasCname || !!activeRecords['TXT']);
  setDisabled('btn-URL',   !!activeRecords['URL']           );
}

/**
 * Helper: sets the disabled property on a button by its ID.
 *
 * @param {string}  id       - Element ID
 * @param {boolean} disabled - Whether to disable
 */
function setDisabled(id, disabled) {
  const el = document.getElementById(id);
  if (el) el.disabled = disabled;
}

/* ── JSON Serialisation ───────────────────────────────────────── */

/**
 * Reads all form fields and record cards, builds the is-a.dev
 * JSON structure, writes it to the <pre> output, and updates
 * the CI status bar.
 *
 * Called on every form input event — effectively a live preview.
 */
function generateJSON() {
  const desc     = document.getElementById('desc').value.trim();
  const repo     = document.getElementById('repo').value.trim();
  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();

  let recordsObj       = {};
  let hasInvalidInputs = false;
  let hasAtLeastOneRecord = false;

  // Traverse all active record cards
  document.querySelectorAll('.record-card').forEach(card => {
    const type = card.dataset.type;
    const inputs = card.querySelectorAll('.record-value');

    let validValues = [];
    inputs.forEach(input => {
      if (input.classList.contains('invalid')) {
        hasInvalidInputs = true;
      } else if (input.value.trim() !== '') {
        validValues.push(input.value.trim());
      }
    });

    if (validValues.length > 0) {
      hasAtLeastOneRecord = true;
      // Array type  → keep as array; String type → take first value only
      recordsObj[type] = RECORD_RULES[type].isArray
        ? validValues
        : validValues[0];
    }
  });

  // Build the exact schema the is-a.dev repository expects
  const outputJSON = {
    description: desc || 'Add description...',
    ...(repo ? { repo } : {}),       // Omit key entirely when blank
    owner: {
      username: username || 'add-username',
      email:    email    || 'add-email',
    },
    records: recordsObj,
  };

  document.getElementById('jsonOutput').innerText =
    JSON.stringify(outputJSON, null, 2);

  updateStatusBar(hasInvalidInputs, username, email, hasAtLeastOneRecord);
}

/* ── Status Bar ───────────────────────────────────────────────── */

/**
 * Updates the CI status bar colour and message.
 *
 * @param {boolean} hasInvalidInputs    - Any field currently fails validation
 * @param {string}  username            - Current username field value
 * @param {string}  email               - Current email field value
 * @param {boolean} hasAtLeastOneRecord - At least one valid record value present
 */
function updateStatusBar(hasInvalidInputs, username, email, hasAtLeastOneRecord) {
  const statusBar = document.getElementById('statusBar');

  if (hasInvalidInputs) {
    setStatus(statusBar, 'fail', 'CI CHECK FAILED: Invalid Record Formatting');
  } else if (!username || !email) {
    setStatus(statusBar, 'fail', 'CI CHECK FAILED: Missing Owner Info');
  } else if (!hasAtLeastOneRecord) {
    setStatus(statusBar, 'fail', 'CI CHECK FAILED: Must contain at least one record');
  } else {
    setStatus(statusBar, 'pass', 'ALL CI CHECKS PASSED: Ready for Pull Request!');
  }
}

/**
 * Applies the correct CSS classes and text to the status bar element.
 *
 * @param {HTMLElement} el      - The status bar element
 * @param {'pass'|'fail'} state - Pass or fail state
 * @param {string}        msg   - Message to display
 */
function setStatus(el, state, msg) {
  el.className = `status-bar status-${state}`;
  el.innerText = msg;
}

/* ── Clipboard ────────────────────────────────────────────────── */

/**
 * Copies the current JSON output to the system clipboard and
 * notifies the user via a native alert.
 */
function copyToClipboard() {
  const text = document.getElementById('jsonOutput').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Flawless JSON Copied! Go submit your Pull Request.');
  });
}

/* ── Initialise ───────────────────────────────────────────────── */
generateJSON();
