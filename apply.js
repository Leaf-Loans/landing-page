#!/usr/bin/env node
/* Local-only: replaces the inline <style data-leafloans-inject>
   and <script data-leafloans-inject> blocks with external file references.
   Run once; after that, edit assets/leafloans.{css,js} directly.
   No scraper, no deploy — just static files. */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = dirname(fileURLToPath(import.meta.url))

const LINK_TAG = '<link data-leafloans-inject="true" rel="stylesheet" href="assets/leafloans.css" />'
const CONFIG_TAG = '<script data-leafloans-inject="true" src="assets/config.js"></script>'
const SCRIPT_TAG = '<script data-leafloans-inject="true" src="assets/leafloans.js"></script>'

const files = readdirSync(ROOT).filter((f) => f.endsWith('.html'))
for (const file of files) {
  const path = join(ROOT, file)
  let html = readFileSync(path, 'utf8')
  // Strip any previous injections (inline or external). Handled per-tag so
  // a stray `/>` inside <script> content can't cut the match short.
  html = html.replace(/<style data-leafloans-inject="true"[\s\S]*?<\/style>\s*/g, '')
  html = html.replace(/<script data-leafloans-inject="true"[\s\S]*?<\/script>\s*/g, '')
  html = html.replace(/<link data-leafloans-inject="true"[^>]*\/?>\s*/g, '')
  // Insert new external references (config must load before leafloans.js
  // so the modal submit handler sees window.LL_SHEET_WEBHOOK)
  html = html.replace('</head>', `${LINK_TAG}\n${CONFIG_TAG}\n${SCRIPT_TAG}\n</head>`)
  writeFileSync(path, html)
  console.log(`  ✓ ${file}`)
}
console.log(`\nLinked assets/leafloans.css + assets/leafloans.js into ${files.length} pages`)
