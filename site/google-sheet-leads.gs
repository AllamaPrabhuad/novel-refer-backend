/**
 * Novel Tissues — copy every website lead into this Google Sheet.
 *
 * 1. Create a Google Sheet, then Extensions → Apps Script, paste this file and Save.
 * 2. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
 * 3. Copy the web app URL into 'sheet_webhook' in novel-config.php (or answer the novel-setup prompt).
 */
const COLUMNS = ['received', 'type', 'name', 'company', 'email', 'phone', 'business', 'products', 'volume',
  'launch', 'formula', 'mode', 'plant', 'date', 'time', 'address', 'city', 'pincode', 'notes', 'page', 'id'];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  const lead = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow(COLUMNS.map(k => {
    const v = lead[k] == null ? '' : String(lead[k]);
    return /^[=@]|^[+\-](?![\d\s()]+$)/.test(v) ? "'" + v : v; // keep values as text, never formulas
  }));
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
