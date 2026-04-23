/* Site-wide runtime config. Loaded before assets/leafloans.js so the
   modal submit handler can pick up the webhook URL.
   Set this once after deploying the Apps Script (see scripts/SETUP-SHEETS.md). */
window.LL_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbw06jMSONcUfE3fYXeWqkBCCIJKqsugAD0gARtBpa4xGc8SWKZlKKcGUosc2atj4JZ2IA/exec'
