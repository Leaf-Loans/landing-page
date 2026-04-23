/**
 * Leaf Loans — Lead capture webhook for the contact modal.
 *
 * Deploy this as a Google Apps Script Web App attached to a Google Sheet.
 * The web app URL becomes window.LL_SHEET_WEBHOOK in assets/config.js.
 *
 * Setup is documented in scripts/SETUP-SHEETS.md.
 */

// Sheet tab name (created on first request if missing).
var SHEET_NAME = 'Leads';

// Slack incoming webhook for instant notifications. Optional —
// set via Project Settings → Script properties → SLACK_WEBHOOK.
function getSlackWebhook() {
  return PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK') || '';
}

// Header row matches the JSON keys posted by leafloans.js.
var HEADERS = [
  'timestamp',
  'name', 'email', 'company', 'role',
  'usecase', 'usecase_label', 'notes',
  'source', 'cta',
  'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'referrer',
];

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) || '{}';
    var data = JSON.parse(body);

    var sheet = ensureSheet_();
    var row = HEADERS.map(function (h) { return data[h] != null ? String(data[h]) : ''; });
    sheet.appendRow(row);

    notifySlack_(data);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

// Browsers may probe with GET — return a tiny health check.
function doGet() {
  return jsonOut_({ ok: true, service: 'leafloans-leads' });
}

function ensureSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function notifySlack_(data) {
  var url = getSlackWebhook();
  if (!url) return;
  var attribution = (data.source || '—');
  if (data.utm_campaign) attribution += ' / ' + data.utm_campaign;
  if (data.utm_medium) attribution += ' (' + data.utm_medium + ')';
  var lines = [
    '*New Leaf Loans lead*',
    '> *' + (data.name || '?') + '* — ' + (data.role || '') + ' @ ' + (data.company || '?'),
    '> ' + (data.email || ''),
    '> Use case: ' + (data.usecase_label || data.usecase || '—'),
    '> Source: ' + attribution + (data.cta ? '  ·  CTA: ' + data.cta : ''),
  ];
  if (data.notes) lines.push('> ' + String(data.notes).replace(/\n/g, ' '));
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text: lines.join('\n') }),
    muteHttpExceptions: true,
  });
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
