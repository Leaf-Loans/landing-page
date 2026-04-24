(function () {
  'use strict'

  const ACCENT = 'rgb(120, 39, 207)' // Framer's purple accent

  /* ─────────────────────────────────────────
     CONTACT MODAL
     Triggers: Let's talk to an expert, Get API Keys,
     Contact Us, Open An Account, Book a Demo, Get Started
  ───────────────────────────────────────── */
  const SHEET_WEBHOOK_URL = window.LL_SHEET_WEBHOOK || ''

  const MODAL_TRIGGER_TEXTS = [
    "let's talk to an expert",
    'talk to an expert',
    'get api keys',
    'contact us',
    'open an account',
    'book a demo',
    'get started',
    'discover more',
    'partner with us',
  ]

  const USE_CASE_OPTIONS = [
    { v: '', l: 'Select one…' },
    { v: 'marketplace', l: 'Embedding credit in our marketplace or platform' },
    { v: 'nbfc_fintech', l: 'Launching a new lending product (NBFC / fintech)' },
    { v: 'supply_chain', l: 'Supplier / buyer financing on our supply chain' },
    { v: 'partnership', l: 'Partnership & distribution' },
    { v: 'investor', l: 'Investor / strategic conversation' },
    { v: 'other', l: 'Other' },
  ]

  /* Map the CTA text that opened the modal to title/sub/submit strings.
     Keys are lowercase CTA phrases. Falls back to `default`. */
  const INTENT_MAP = {
    'partner with us':      { title: "Let's partner.",        sub: "Tell us what you're building. We'll route you to the right team.", submit: 'Request Partnership' },
    'book a demo':          { title: 'Book your demo.',       sub: 'Tell us about your use case. We\u2019ll tailor the walkthrough.',  submit: 'Request Demo' },
    'contact us':           { title: 'Say hello.',            sub: 'Drop us a note \u2014 we\u2019ll get back to you.',                  submit: 'Send message' },
    'get started':          { title: "Let's get started.",    sub: 'A few details and we\u2019ll set you up.',                           submit: 'Get Started' },
    'get api keys':         { title: 'Get API access.',       sub: 'Tell us about your integration.',                                    submit: 'Request Access' },
    'open an account':      { title: 'Open an account.',      sub: 'Tell us a bit about your company.',                                  submit: 'Request Account' },
    "let's talk to an expert": { title: "Let's talk.",        sub: 'Our team will reach out with a tailored walkthrough.',               submit: 'Connect Me' },
    'talk to an expert':    { title: "Let's talk.",           sub: 'Our team will reach out with a tailored walkthrough.',               submit: 'Connect Me' },
    'discover more':        { title: "Let's talk.",           sub: 'Tell us about your use case \u2014 we\u2019ll come prepared.',       submit: 'Get in Touch' },
    default:                { title: "Let's talk.",           sub: 'Tell us a bit about you. We\u2019ll be in touch.',                   submit: 'Send message' },
  }

  function buildModal() {
    if (document.getElementById('ll-modal-overlay')) return
    const overlay = document.createElement('div')
    overlay.id = 'll-modal-overlay'
    overlay.innerHTML =
      '<div id="ll-modal-card">' +
      '<button id="ll-modal-close" aria-label="Close">\u00d7</button>' +
      '<div id="ll-modal-form-wrap">' +
      '<div id="ll-modal-brand"><img src="assets/img/leafloans-wordmark.png" alt="Leaf Loans" /></div>' +
      '<h2 id="ll-modal-title">Let\u2019s talk.</h2>' +
      '<p id="ll-modal-sub">Tell us a bit about you. We\u2019ll be in touch.</p>' +
      '<form id="ll-modal-form" novalidate>' +
        '<div class="ll-row">' +
          '<div class="ll-field"><label for="ll-name">Name</label><input id="ll-name" name="name" type="text" required autocomplete="name" /></div>' +
          '<div class="ll-field"><label for="ll-email">Work email</label><input id="ll-email" name="email" type="email" required autocomplete="email" placeholder="you@company.com" /></div>' +
        '</div>' +
        '<div class="ll-row">' +
          '<div class="ll-field"><label for="ll-company">Company</label><input id="ll-company" name="company" type="text" required autocomplete="organization" /></div>' +
          '<div class="ll-field"><label for="ll-role">Role</label><input id="ll-role" name="role" type="text" required placeholder="e.g. Head of Partnerships" /></div>' +
        '</div>' +
        '<div class="ll-field"><label for="ll-usecase-trigger">I am exploring Leaf Loans for</label>' +
        '<div class="ll-dropdown" id="ll-usecase" data-value="">' +
          '<button type="button" class="ll-dropdown-trigger" id="ll-usecase-trigger" aria-haspopup="listbox" aria-expanded="false">' +
            '<span class="ll-dropdown-label">Select one\u2026</span>' +
            '<svg class="ll-dropdown-chevron" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<ul class="ll-dropdown-menu" role="listbox">' +
          USE_CASE_OPTIONS.filter(function (o) { return o.v !== '' }).map(function (o) {
            return '<li class="ll-dropdown-item" role="option" data-value="' + o.v + '">' + o.l + '</li>'
          }).join('') +
          '</ul>' +
          '<input type="hidden" name="usecase" />' +
        '</div></div>' +
        '<div class="ll-field"><label for="ll-notes">Tell us what you\u2019re looking to build <span class="ll-optional">(optional)</span></label>' +
        '<textarea id="ll-notes" name="notes" rows="3" maxlength="500" placeholder="A few words about your use case \u2014 we\u2019ll come prepared."></textarea></div>' +
        '<button id="ll-modal-submit" type="submit">Send message</button>' +
        '<div id="ll-modal-error" role="alert"></div>' +
      '</form>' +
      '</div>' +
      '<div id="ll-modal-success">' +
        '<div class="check">\u2713</div>' +
        '<h3 id="ll-modal-success-title">Thank you for reaching out.</h3>' +
        '<p id="ll-modal-success-copy">A member of our team will reach out within <strong>2 business days</strong>. Something urgent? Write to <a href="mailto:connect@leafloans.ai">connect@leafloans.ai</a>.</p>' +
        '<button id="ll-modal-close-2" class="ll-secondary">Back to site</button>' +
      '</div>' +
      '</div>'
    document.body.appendChild(overlay)

    function close() {
      overlay.classList.remove('ll-open')
      // Reset form state for next open
      setTimeout(function () {
        const form = document.getElementById('ll-modal-form')
        const success = document.getElementById('ll-modal-success')
        const formWrap = document.getElementById('ll-modal-form-wrap')
        if (form) form.reset()
        if (success) success.classList.remove('show')
        if (formWrap) formWrap.style.display = ''
        const successTitle = document.getElementById('ll-modal-success-title')
        if (successTitle) successTitle.textContent = 'Thank you for reaching out.'
        const err = document.getElementById('ll-modal-error')
        if (err) err.textContent = ''
        // Reset the custom dropdown too (form.reset doesn't touch it)
        const dropdown = document.getElementById('ll-usecase')
        if (dropdown) {
          dropdown.dataset.value = ''
          dropdown.classList.remove('ll-dropdown-open', 'll-dropdown-invalid')
          const lbl = dropdown.querySelector('.ll-dropdown-label')
          if (lbl) {
            lbl.textContent = 'Select one\u2026'
            lbl.classList.add('ll-dropdown-placeholder')
          }
          const hidden = dropdown.querySelector('input[type="hidden"]')
          if (hidden) hidden.value = ''
          dropdown.querySelectorAll('.ll-dropdown-item').forEach(function (i) {
            i.classList.remove('ll-dropdown-selected')
          })
        }
      }, 250)
    }
    overlay.querySelector('#ll-modal-close').addEventListener('click', close)
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close() })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('ll-open')) close()
    })

    // Custom dropdown behavior (replaces native <select> styling)
    const dd = overlay.querySelector('#ll-usecase')
    if (dd) {
      const trigger = dd.querySelector('.ll-dropdown-trigger')
      const label = dd.querySelector('.ll-dropdown-label')
      const menu = dd.querySelector('.ll-dropdown-menu')
      const hidden = dd.querySelector('input[type="hidden"]')
      const items = Array.from(dd.querySelectorAll('.ll-dropdown-item'))

      function openDD() {
        dd.classList.add('ll-dropdown-open')
        trigger.setAttribute('aria-expanded', 'true')
      }
      function closeDD() {
        dd.classList.remove('ll-dropdown-open')
        trigger.setAttribute('aria-expanded', 'false')
      }
      function selectValue(value, text) {
        dd.dataset.value = value
        hidden.value = value
        label.textContent = text
        label.classList.remove('ll-dropdown-placeholder')
        dd.classList.remove('ll-dropdown-invalid')
        items.forEach(function (i) {
          i.classList.toggle('ll-dropdown-selected', i.dataset.value === value)
        })
        closeDD()
      }

      trigger.addEventListener('click', function (e) {
        e.stopPropagation()
        if (dd.classList.contains('ll-dropdown-open')) closeDD(); else openDD()
      })
      items.forEach(function (item) {
        item.addEventListener('click', function () {
          selectValue(item.dataset.value, item.textContent.trim())
        })
      })
      document.addEventListener('click', function (e) {
        if (!dd.contains(e.target)) closeDD()
      })
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dd.classList.contains('ll-dropdown-open')) closeDD()
      })
      // Placeholder styling on first render
      label.classList.add('ll-dropdown-placeholder')
    }

    const closeBtn2 = overlay.querySelector('#ll-modal-close-2')
    if (closeBtn2) closeBtn2.addEventListener('click', close)

    // Form submit
    const form = overlay.querySelector('#ll-modal-form')
    form.addEventListener('submit', async function (e) {
      e.preventDefault()
      const submit = document.getElementById('ll-modal-submit')
      const errEl = document.getElementById('ll-modal-error')
      errEl.textContent = ''

      // Required-field validation (native required doesn't cover the
      // custom dropdown's hidden input). Bail before hitting the network.
      const dropdown = document.getElementById('ll-usecase')
      const usecaseVal = dropdown ? dropdown.dataset.value : ''
      const missing = []
      if (!form.name.value.trim()) missing.push('name')
      if (!form.email.value.trim()) missing.push('work email')
      if (!form.company.value.trim()) missing.push('company')
      if (!form.role.value.trim()) missing.push('role')
      if (!usecaseVal) {
        missing.push('use case')
        if (dropdown) dropdown.classList.add('ll-dropdown-invalid')
      }
      if (missing.length) {
        errEl.textContent = 'Please fill in: ' + missing.join(', ') + '.'
        return
      }

      submit.disabled = true
      submit.textContent = 'Sending\u2026'

      const params = new URLSearchParams(window.location.search)
      const utmSource = params.get('utm_source') || ''
      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim(),
        role: form.role.value.trim(),
        usecase: usecaseVal,
        usecase_label: (USE_CASE_OPTIONS.find(function (o) { return o.v === usecaseVal }) || {}).l || '',
        notes: form.notes.value.trim(),
        source: utmSource || 'Leaf Loans Landing Page',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_term: params.get('utm_term') || '',
        utm_content: params.get('utm_content') || '',
        referrer: document.referrer || '',
        cta: overlay.dataset.source || '',
        timestamp: new Date().toISOString(),
      }

      try {
        if (SHEET_WEBHOOK_URL) {
          // Apps Script web-app endpoint rejects CORS preflight, so we use no-cors.
          // Response is opaque, but POST goes through reliably.
          await fetch(SHEET_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' }, // avoid preflight
            body: JSON.stringify(payload),
          })
        } else {
          // No endpoint configured — log for dev and pretend success
          console.info('[LeafLoans] No SHEET_WEBHOOK_URL set. Submission would have been:', payload)
          await new Promise(function (r) { setTimeout(r, 400) })
        }
        const firstName = (payload.name || '').split(/\s+/)[0]
        const successTitle = document.getElementById('ll-modal-success-title')
        if (successTitle && firstName) {
          successTitle.textContent = 'Thank you for reaching out, ' + firstName + '.'
        }
        document.getElementById('ll-modal-form-wrap').style.display = 'none'
        document.getElementById('ll-modal-success').classList.add('show')
      } catch (err) {
        errEl.textContent = 'Something went wrong. Please try again.'
        console.error('[LeafLoans] submit failed', err)
      } finally {
        submit.disabled = false
        submit.textContent = overlay.dataset.submitLabel || 'Send message'
      }
    })

    return overlay
  }

  function resolveIntent(source) {
    const key = (source || '').trim().toLowerCase().replace(/\s*\u2192\s*$/, '').replace(/\s*->\s*$/, '')
    return INTENT_MAP[key] || INTENT_MAP.default
  }

  function openModal(source) {
    const overlay = document.getElementById('ll-modal-overlay') || buildModal()
    overlay.dataset.source = source || 'Contact'
    const intent = resolveIntent(source)
    overlay.dataset.submitLabel = intent.submit
    const title = document.getElementById('ll-modal-title')
    const sub = document.getElementById('ll-modal-sub')
    const submit = document.getElementById('ll-modal-submit')
    if (title) title.textContent = intent.title
    if (sub) sub.textContent = intent.sub
    if (submit) submit.textContent = intent.submit
    overlay.classList.add('ll-open')
    setTimeout(function () {
      const nameInput = document.getElementById('ll-name')
      if (nameInput) nameInput.focus()
    }, 250)
  }

  function wireModalTriggers() {
    const all = document.querySelectorAll('a, button')
    all.forEach(function (el) {
      const text = (el.textContent || '').trim().toLowerCase()
      if (!text || text.length > 50) return
      const match = MODAL_TRIGGER_TEXTS.find(function (m) { return text.includes(m) })
      if (!match) return
      // Strip href so the link doesn't navigate
      if (el.hasAttribute('href')) {
        el.setAttribute('data-ll-href-removed', el.getAttribute('href'))
        el.removeAttribute('href')
      }
      el.style.cursor = 'pointer'
      el.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        openModal(el.textContent.trim())
      }, true)
    })
  }

  /* ─────────────────────────────────────────
     SMOOTH-SCROLL NAV LINKS
     Home / Technology / How It Works / About Us
     route to specific sections via heading text match.
  ───────────────────────────────────────── */
  function findSectionByHeadingText(patterns) {
    // Iterate patterns OUTER so the most specific pattern (patterns[0])
    // gets the first shot at every candidate. A broader fallback pattern
    // won't beat a specific one just because a non-target heading appears
    // earlier in the DOM. Framer often uses div/p with large-text classes
    // instead of h1-h4, so we fall back to those after the heading pass.
    const headings = document.querySelectorAll('h1, h2, h3, h4')
    const others = document.querySelectorAll('div, p, span')
    for (const p of patterns) {
      for (const h of headings) {
        const t = (h.textContent || '').trim()
        if (p.test(t)) return h
      }
      for (const el of others) {
        const t = (el.textContent || '').trim()
        if (t.length > 200 || t.length < 5) continue
        if (p.test(t)) {
          const size = parseFloat(getComputedStyle(el).fontSize) || 0
          if (size >= 20) return el
        }
      }
    }
    return null
  }

  function scrollToHeading(heading) {
    if (!heading) return
    // Walk up to section-like ancestor for better visual anchoring
    let target = heading
    for (let i = 0; i < 6 && target.parentElement; i++) {
      target = target.parentElement
      const r = target.getBoundingClientRect()
      if (r.height > 300) break
    }
    // Measure sticky nav height dynamically, add breathing room so the
    // target section's top sits comfortably below the nav instead of flush.
    const nav = document.querySelector(
      'nav.framer-v-g1fdcd, nav[data-framer-name="Desktop White"]'
    )
    const navH = nav ? nav.getBoundingClientRect().height : 72
    const y = target.getBoundingClientRect().top + window.scrollY - navH - 48
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  function wireNavLinks() {
    // Iterate ALL link/nav-like elements on the page (not limited to <nav> descendants)
    // so we catch anchors Framer renders outside the nav too.
    const items = document.querySelectorAll(
      'a, [data-framer-name="Nav Link"], [data-framer-component-type="RichTextContainer"]'
    )
    items.forEach(function (a) {
      const text = (a.textContent || '').trim().toLowerCase()
      if (!text || text.length > 30) return
      if (a.dataset.llNavWired === '1') return // idempotent

      const bind = function (handler) {
        a.dataset.llNavWired = '1'
        if (a.hasAttribute('href')) {
          a.setAttribute('data-ll-href-removed', a.getAttribute('href'))
          a.removeAttribute('href')
        }
        a.style.cursor = 'pointer'
        a.addEventListener('click', function (e) {
          e.preventDefault()
          e.stopPropagation()
          if (e.stopImmediatePropagation) e.stopImmediatePropagation()
          handler()
        }, true)
      }

      if (text === 'home') {
        bind(function () { window.scrollTo({ top: 0, behavior: 'smooth' }) })
      } else if (text === 'technology' || text === 'technology →') {
        bind(function () {
          scrollToHeading(findSectionByHeadingText([
            /built on india['’]s most advanced/i,
            /built on india/i,
            /most advanced ai lending/i,
          ]))
        })
      } else if (text === 'how it works' || text === 'how it works?' || text.indexOf('how it works') === 0) {
        bind(function () {
          scrollToHeading(findSectionByHeadingText([/how it works/i]))
        })
      } else if (text === 'about us' || text === 'about') {
        bind(function () {
          scrollToHeading(findSectionByHeadingText([
            /modern credit infrastructure/i,
            /credit infrastructure for india/i,
            /b2b economy/i,
          ]))
        })
      }
      // 'contact us' handled via wireModalTriggers
    })
  }

  /* ─────────────────────────────────────────
     Replace the Framer logo with local Leaf Loans logo
     Swaps every nav-positioned logo image on the page.
  ───────────────────────────────────────── */
  const LOGO_URL = 'assets/img/leafloans-logo.png'

  function swapNavLogo() {
    document.querySelectorAll('nav').forEach(function (nav) {
      // Find the logo — usually the first wrapper marked "Logo" OR the first
      // small SVG/IMG inside a nav link to "/"
      const logoWrapper =
        nav.querySelector('[data-framer-name="Logo"]') ||
        nav.querySelector('a[href="/"], a[href="./"], a[href="#"]')
      if (!logoWrapper) return

      // Clear any inner SVG/IMG content, inject our img
      const existingImg = logoWrapper.querySelector('img[data-ll-logo]')
      if (existingImg) return // already swapped

      const img = document.createElement('img')
      img.src = LOGO_URL
      img.alt = 'Leaf Loans'
      img.setAttribute('data-ll-logo', 'true')
      img.style.cssText =
        'height: 28px; width: auto; display: block; opacity: 1; visibility: visible;'

      // Remove previous logo children (svg/img/spans)
      while (logoWrapper.firstChild) logoWrapper.removeChild(logoWrapper.firstChild)
      logoWrapper.appendChild(img)
      logoWrapper.style.display = 'flex'
      logoWrapper.style.alignItems = 'center'
    })
  }

  /* ─────────────────────────────────────────
     Hide "Get API Keys" CTA site-wide
  ───────────────────────────────────────── */
  /* Force the Banner Section heading onto exactly 2 lines:
     "Modern credit infrastructure" / "for India's B2B economy."
     Framer's preset cascade has been beating the CSS override, so we
     set inline styles directly. Inline wins over any stylesheet rule
     of equal-or-lower specificity, !important or not. */
  function enforceBannerHeading() {
    const section = document.querySelector('section[data-framer-name="Banner Section"]')
    if (!section) return
    const heading = section.querySelector('[data-styles-preset="XTknRAdUH"]') ||
      section.querySelector('.framer-styles-preset-8z6aw4')
    if (!heading) return
    const mobile = window.innerWidth < 720
    const px = mobile ? 28 : 40
    heading.style.setProperty('font-size', px + 'px', 'important')
    heading.style.setProperty('line-height', '1.15', 'important')
    heading.style.setProperty('letter-spacing', '-0.02em', 'important')
    heading.style.setProperty('white-space', mobile ? 'normal' : 'nowrap', 'important')
    heading.style.setProperty('--framer-font-size', px + 'px', 'important')
    // Widen the surrounding wrapper so nowrap has room.
    const titleWrap = heading.closest('[data-framer-name="Title Wrapper"]')
    const title = heading.closest('[data-framer-name="Title"]')
    ;[titleWrap, title].forEach(function (el) {
      if (!el) return
      el.style.setProperty('max-width', 'none', 'important')
      el.style.setProperty('width', '100%', 'important')
    })
  }

  function hideGetApiKeys() {
    document.querySelectorAll('a, button').forEach(function (el) {
      const text = (el.textContent || '').trim().toLowerCase()
      if (
        text === 'get api keys' ||
        text === 'get api keys →' ||
        text === 'open an account' ||
        text === 'open an account →'
      ) {
        el.style.setProperty('display', 'none', 'important')
      }
    })
  }

  /* ─────────────────────────────────────────
     Hide "Learn More" button in Why Leaf Loans
  ───────────────────────────────────────── */
  /* ─────────────────────────────────────────
     Render Option A footer — minimal centered.
     Hides Framer's footer internals via body class + CSS.
  ───────────────────────────────────────── */
  function renderCustomFooter() {
    if (document.getElementById('ll-custom-footer')) return

    const foot = document.createElement('footer')
    foot.id = 'll-custom-footer'
    foot.innerHTML =
      '<a href="#" class="ll-foot-logo" aria-label="Leaf Loans home">' +
      '<img src="assets/img/leafloans-logo.png" alt="Leaf Loans" />' +
      '</a>' +
      '<p class="ll-foot-tagline">AI-Native Lending Infrastructure</p>' +
      '<a href="mailto:connect@leafloans.ai" class="ll-foot-email">connect@leafloans.ai</a>' +
      '<div class="ll-foot-socials">' +
      '<a href="https://x.com/leafloans" target="_blank" rel="noopener" aria-label="X">' +
      '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
      '</a>' +
      '<a href="https://www.linkedin.com/company/leafloans" target="_blank" rel="noopener" aria-label="LinkedIn">' +
      '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z"/></svg>' +
      '</a>' +
      '</div>' +
      '<p class="ll-foot-copy">© 2026 Leaf Loans Private Limited. All rights reserved.</p>'

    // Append after the Framer footer so page flow is preserved, then hide Framer's footer internals
    document.body.appendChild(foot)
    document.body.classList.add('ll-footer-replaced')

    // Home-link behavior on logo
    const homeLink = foot.querySelector('.ll-foot-logo')
    if (homeLink) {
      homeLink.addEventListener('click', function (e) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  }

  /* Retained as alias so initEager doesn't break */
  function cleanupFooter() { renderCustomFooter() }
  /* Original cleanup kept for reference below (unused) */
  function _legacyFooterCleanup() {
    // 1. Hide first 3 Nav Columns (Company, Services, Showcases), keep Contacts
    document.querySelectorAll('[data-framer-name="Nav Column"]').forEach(function (col) {
      const titleEl = col.querySelector('[data-framer-name="Title"]')
      const titleText = ((titleEl && titleEl.textContent) || '').trim().toLowerCase()
      if (titleText === 'contacts' || titleText === 'contact') {
        if (titleEl) titleEl.textContent = 'Contact'
        const linksWrap = col.querySelector('[data-framer-name="Nav Links Wrapper"]')
        if (linksWrap) {
          linksWrap.innerHTML =
            '<a href="mailto:connect@leafloans.ai" style="color:#666;font-size:14px;text-decoration:none;font-family:inherit;">connect@leafloans.ai</a>'
        }
      } else {
        col.style.setProperty('display', 'none', 'important')
      }
    })

    // 2. Copyright line — replace Finix with Leaf Loans Private Limited
    document.querySelectorAll('[data-framer-name="Copyright Wrapper"] *, [data-framer-name="Copyright"]').forEach(function (el) {
      if (el.children.length > 0) return
      const t = el.textContent
      if (t && /Finix/i.test(t)) {
        el.textContent = t.replace(/Finix/gi, 'Leaf Loans Private Limited')
      }
    })
    // Also cover any p/span with "Finix" in the bottom 1/3 of the page
    document.querySelectorAll('p, span, div').forEach(function (el) {
      if (el.children.length === 0 && el.textContent && /\bFinix\b/.test(el.textContent)) {
        el.textContent = el.textContent.replace(/\bFinix\b/g, 'Leaf Loans Private Limited')
      }
    })
    // Remove "Designed by fourtwelve" style credit lines
    document.querySelectorAll('p, span, div, a').forEach(function (el) {
      if (el.children.length === 0 && /fourtwelve/i.test(el.textContent || '')) {
        el.style.setProperty('display', 'none', 'important')
      }
    })

    // 3. Socials — keep only X, hide everything else
    const socialLinks = document.querySelectorAll('[data-framer-name="Social Icons Wrapper"] a[href]')
    socialLinks.forEach(function (a) {
      const href = (a.getAttribute('href') || '').toLowerCase()
      if (/x\.com|twitter/.test(href)) {
        a.setAttribute('href', 'https://x.com/leafloans')
        a.setAttribute('aria-label', 'X')
      } else {
        a.style.setProperty('display', 'none', 'important')
      }
    })
  }

  function hideWhyLearnMore() {
    const heading = [...document.querySelectorAll('h1, h2, h3, h4, h5')].find(
      function (h) { return /why\s+leaf\s+loans/i.test((h.textContent || '').trim()) }
    )
    if (!heading) return
    // Walk up to the Why section
    let section = heading
    for (let i = 0; i < 10 && section.parentElement; i++) {
      section = section.parentElement
      const r = section.getBoundingClientRect()
      if (r.height > 400) break
    }
    section.querySelectorAll('a, button').forEach(function (el) {
      const text = (el.textContent || '').trim().toLowerCase()
      if (/^learn more/.test(text)) {
        el.style.setProperty('display', 'none', 'important')
      }
    })
  }

  /* ─────────────────────────────────────────
     FIX 1: Card hover — lift + purple title
     Targets the 6 Why Leaf Loans cards by title match.
     Non-clickable: hover-only interaction.
  ───────────────────────────────────────── */
  function findWhyCards() {
    // Find the "Why Leaf Loans" heading, walk up to its section container,
    // then collect all card-sized anchor elements within it.
    const heading = [...document.querySelectorAll('h1, h2, h3, h4, h5')].find(
      function (h) { return /why\s+leaf\s+loans/i.test((h.textContent || '').trim()) }
    )
    if (!heading) return []

    let cur = heading
    for (let i = 0; i < 12 && cur.parentElement; i++) {
      cur = cur.parentElement
      const links = [...cur.querySelectorAll('a')].filter(function (a) {
        const box = a.getBoundingClientRect()
        return box.width > 250 && box.width < 520 && box.height > 300
      })
      if (links.length >= 4) return links
    }
    return []
  }

  function setupCardHovers() {
    const cards = findWhyCards()
    if (cards.length === 0) return
    cards.forEach(function (card) {
      // Non-clickable: strip href, block click events
      if (card.hasAttribute('href')) {
        card.setAttribute('data-ll-href-removed', card.getAttribute('href'))
        card.removeAttribute('href')
      }
      card.style.cursor = 'default'
      card.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
      }, true)
      const r = card.getBoundingClientRect()
      if (r.width < 150 || r.height < 80) return

      // Find the title element — first heading or the largest text element in the card
      const title =
        card.querySelector('h1, h2, h3, h4, h5, h6') ||
        card.querySelector('[data-framer-name*="Title"]') ||
        card.querySelector('p')

      // Snapshot title original color (don't wipe Framer's inline style)
      let origTitleColor = ''
      let origTitlePrio = ''
      if (title) {
        origTitleColor = title.style.getPropertyValue('color')
        origTitlePrio = title.style.getPropertyPriority('color')
        title.style.transition =
          (title.style.transition ? title.style.transition + ', ' : '') +
          'color 0.28s ease'
      }

      card.style.transition =
        'transform 0.42s cubic-bezier(0.22, 0.68, 0, 1.2), box-shadow 0.42s ease'
      card.style.willChange = 'transform'

      card.addEventListener('mouseenter', function () {
        card.style.transform = 'translateY(-10px)'
        if (title) title.style.setProperty('color', ACCENT, 'important')
      })
      card.addEventListener('mouseleave', function () {
        card.style.transform = ''
        if (title) {
          if (origTitleColor) {
            title.style.setProperty('color', origTitleColor, origTitlePrio)
          } else {
            title.style.removeProperty('color')
          }
        }
      })
    })
  }

  /* ─────────────────────────────────────────
     FIX 2: Button hover color inversion
     - Outlined/transparent → fill dark
     - Dark filled → invert to outlined
     - Light filled → invert to dark
     - Small text pill → purple color
     Snapshots original inline styles so leave restores perfectly.
  ───────────────────────────────────────── */
  function parseRgb(str) {
    const m = str.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(',').map(function (s) { return parseFloat(s.trim()) })
    return { r: p[0], g: p[1], b: p[2], a: p[3] !== undefined ? p[3] : 1 }
  }

  function isPillButton(el) {
    const cs = getComputedStyle(el)
    const radius = parseFloat(cs.borderTopLeftRadius) || 0
    const rect = el.getBoundingClientRect()
    return radius >= 20 && rect.height >= 20 && rect.width >= 60
  }

  function isTextOnlyButton(el) {
    const cs = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    return rect.height < 36 && /rgba?\([^,]+,[^,]+,[^,]+,\s*0/.test(cs.backgroundColor)
  }

  function setupButtonHovers() {
    // Match ALL anchors (not just a[href]) because wireModalTriggers strips href.
    const links = document.querySelectorAll('a')
    links.forEach(function (btn) {
      if (!isPillButton(btn)) return

      const cs = getComputedStyle(btn)
      const bg = parseRgb(cs.backgroundColor)
      if (!bg) return

      const brightness = (bg.r + bg.g + bg.b) / 3
      const isTransparent = bg.a < 0.15
      const isDark = bg.a > 0.5 && brightness < 80
      const isLight = bg.a > 0.5 && brightness > 200
      const textOnly = isTextOnlyButton(btn)

      let hoverBg = null
      let hoverColor = null

      if (textOnly) {
        hoverBg = null
        hoverColor = ACCENT
      } else if (isTransparent) {
        hoverBg = 'rgb(14, 14, 14)'
        hoverColor = 'rgb(255, 255, 255)'
      } else if (isDark) {
        hoverBg = 'rgba(255, 255, 255, 0)'
        hoverColor = 'rgb(14, 14, 14)'
      } else if (isLight) {
        hoverBg = 'rgb(14, 14, 14)'
        hoverColor = 'rgb(255, 255, 255)'
      } else {
        return
      }

      // Snapshot originals so restore is lossless
      const orig = {
        bg: btn.style.getPropertyValue('background-color'),
        bgPrio: btn.style.getPropertyPriority('background-color'),
        color: btn.style.getPropertyValue('color'),
        colorPrio: btn.style.getPropertyPriority('color'),
      }

      const origTransition = btn.style.transition || ''
      btn.style.transition =
        (origTransition ? origTransition + ', ' : '') +
        'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.22, 0.68, 0, 1.2)'

      const textNodes = btn.querySelectorAll('p, span, div')
      const textNodeOrig = new Map()
      textNodes.forEach(function (n) {
        textNodeOrig.set(n, {
          color: n.style.getPropertyValue('color'),
          prio: n.style.getPropertyPriority('color'),
        })
      })

      const arrow = btn.querySelector('[data-framer-name="Arrow Icon"], svg')
      if (arrow) arrow.style.transition = 'transform 0.28s cubic-bezier(0.22, 0.68, 0, 1.2)'

      btn.addEventListener('mouseenter', function () {
        if (hoverBg) btn.style.setProperty('background-color', hoverBg, 'important')
        btn.style.setProperty('color', hoverColor, 'important')
        if (!textOnly) btn.style.transform = 'translateY(-2px)'
        textNodes.forEach(function (n) {
          n.style.setProperty('color', hoverColor, 'important')
        })
        if (arrow) arrow.style.transform = 'translateX(4px)'
      })
      btn.addEventListener('mouseleave', function () {
        if (orig.bg) {
          btn.style.setProperty('background-color', orig.bg, orig.bgPrio)
        } else {
          btn.style.removeProperty('background-color')
        }
        if (orig.color) {
          btn.style.setProperty('color', orig.color, orig.colorPrio)
        } else {
          btn.style.removeProperty('color')
        }
        btn.style.transform = ''
        textNodes.forEach(function (n) {
          const o = textNodeOrig.get(n)
          if (o && o.color) {
            n.style.setProperty('color', o.color, o.prio)
          } else {
            n.style.removeProperty('color')
          }
        })
        if (arrow) arrow.style.transform = ''
      })
    })
  }

  /* ─────────────────────────────────────────
     Scroll-reveal: staggered per-component cascade.
     Rather than fading an entire section as one block (the previous
     behavior), we hide each meaningful child inside a section (title
     wrapper, body text, CTA buttons, individual cards, images, etc.),
     apply a stagger delay based on its DOM order, and cascade them in
     when the parent section enters the viewport. Above-the-fold
     sections cascade on load (no "preloaded" flash).
     Respects prefers-reduced-motion by skipping the whole setup.
  ───────────────────────────────────────── */
  const REVEAL_CHILD_SEL = [
    '[data-framer-name="Title Wrapper"]',
    '[data-framer-name="Description"]',
    '[data-framer-name="Body"]',
    '[data-framer-name="Body & Buttons Wrapper"]',
    '[data-framer-name="Buttons Wrapper"]',
    '[data-framer-name="CTA Wrapper"]',
    '[data-framer-name="Benefit Wrapper"]',
    '[data-framer-name="Feature Card"]',
    '[data-framer-name="Service Card"]',
    '[data-framer-name="Process Card"]',
    '[data-framer-name="Showcase Card"]',
    '[data-framer-name="Card"]',
    '[data-framer-name="Image Wrapper"]',
    '[data-framer-name="Thumbnail"]',
  ].join(', ')

  const REVEAL_STAGGER_MS = 80
  const REVEAL_BASE_DELAY_MS = 40

  function collectRevealTargets(section) {
    const all = Array.from(section.querySelectorAll(REVEAL_CHILD_SEL))
    // Keep only top-level reveal targets within the section — exclude
    // nested ones (e.g. a Body inside a Card). Prevents double-animating.
    return all.filter(function (el) {
      let cur = el.parentElement
      while (cur && cur !== section) {
        if (cur.matches(REVEAL_CHILD_SEL)) return false
        cur = cur.parentElement
      }
      return true
    })
  }

  function setupScrollReveals() {
    if (typeof IntersectionObserver === 'undefined') return

    const reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.documentElement.classList.add('ll-anims-ready')
      return
    }

    const sections = Array.from(
      document.querySelectorAll('[data-framer-name$="Section"]')
    ).filter(function (s) { return s.getBoundingClientRect().height > 120 })

    // Build the target map. Each section → list of top-level children to stagger.
    // Fallback: if a section has no matching children, animate the whole section.
    const sectionTargets = new Map()
    sections.forEach(function (section) {
      let targets = collectRevealTargets(section)
      if (targets.length === 0) targets = [section]
      sectionTargets.set(section, targets)
      targets.forEach(function (el, idx) {
        el.classList.add('ll-reveal')
        el.style.setProperty('--ll-delay',
          (REVEAL_BASE_DELAY_MS + idx * REVEAL_STAGGER_MS) + 'ms')
      })
    })

    // Why Leaf Loans cards (discovered via layout heuristic, not a named section).
    const whyCards = findWhyCards()
    whyCards.forEach(function (card, idx) {
      if (card.classList.contains('ll-reveal')) return
      card.classList.add('ll-reveal')
      card.style.setProperty('--ll-delay',
        (REVEAL_BASE_DELAY_MS + idx * REVEAL_STAGGER_MS) + 'ms')
    })

    // Flip the body flag so the pre-hide CSS stops suppressing content.
    document.documentElement.classList.add('ll-anims-ready')

    const viewportH = window.innerHeight
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        const section = entry.target
        const targets = sectionTargets.get(section) || [section]
        targets.forEach(function (t) { t.classList.add('ll-in-view') })
        observer.unobserve(section)
      })
    }, { threshold: 0.12, rootMargin: '-40px 0px' })

    sections.forEach(function (section) {
      const r = section.getBoundingClientRect()
      // Already on screen at load → cascade next frame so the user sees
      // the reveal happen instead of instant content.
      if (r.top < viewportH * 0.9) {
        requestAnimationFrame(function () {
          const targets = sectionTargets.get(section) || [section]
          targets.forEach(function (t) { t.classList.add('ll-in-view') })
        })
      } else {
        observer.observe(section)
      }
    })

    // Why Leaf cards observed individually (each may enter at a different scroll point).
    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        entry.target.classList.add('ll-in-view')
        cardObserver.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '-40px 0px' })
    whyCards.forEach(function (c) {
      if (c.classList.contains('ll-in-view')) return
      const r = c.getBoundingClientRect()
      if (r.top < viewportH * 0.9) {
        requestAnimationFrame(function () { c.classList.add('ll-in-view') })
      } else {
        cardObserver.observe(c)
      }
    })
  }

  /* ─────────────────────────────────────────
     How It Works — progress line animation.
     Framer ships a vertical bar (Progress Line) that's meant to fill
     as the user scrolls through the 4 numbered steps, but the hydration
     handler doesn't fire on our static mirror. Sync translateY manually
     from start (-{maxShift}px, hidden above) to 0 (fully extended) based
     on how far through the How It Works block the viewport has scrolled.
  ───────────────────────────────────────── */
  function setupProgressLine() {
    const line = document.querySelector('[data-framer-name="Progress Line"]')
    if (!line) return
    // Track against the 4-steps container (Benefits Wrapper), NOT the
    // outer Progress Wrapper. Tracking the outer wrapper makes progress
    // hit 100% only after the section is scrolling out of view.
    const progressWrapper = line.closest('[data-framer-name="Progress Wrapper"]') ||
      line.parentElement.parentElement
    const items = progressWrapper
      ? progressWrapper.querySelector('[data-framer-name="Benefits Wrapper"]')
      : null
    if (!items) return

    // Respect Framer's baked-in starting translateY (typically -440px).
    const initial = line.style.transform || ''
    const m = /translateY\((-?\d+(?:\.\d+)?)px\)/.exec(initial)
    const startY = m ? parseFloat(m[1]) : -440
    const endY = 0

    function update() {
      const r = items.getBoundingClientRect()
      const viewportH = window.innerHeight
      // Anchor progress to the viewport's vertical midpoint passing
      // through the items container. Progress hits 1 when the midpoint
      // crosses the last item — i.e. while step 4 is still on screen.
      const anchor = viewportH * 0.55 // slightly below center
      const progress = (anchor - r.top) / r.height
      const clamped = Math.max(0, Math.min(1, progress))
      const y = startY + (endY - startY) * clamped
      line.style.transform = 'translateY(' + y.toFixed(1) + 'px)'
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
  }

  /* ─────────────────────────────────────────
     FIX 4: Manual nav scroll-variant swap
     Framer's own scroll handler doesn't fire on our static mirror,
     so we do it ourselves. Swap one class on <nav> and Framer's CSS
     does the rest (content swap + white background).
  ───────────────────────────────────────── */
  const NAV_DEFAULT = 'framer-v-q635xq' // Home/About/Team/Pricing/Services
  const NAV_SCROLLED = 'framer-v-g1fdcd' // Home/Technology/HowItWorks/About/Contact + white bg

  function setupNavScrollVariant() {
    const scrolledNav = document.querySelector('nav[data-ll-scrolled-nav]')
    if (!scrolledNav) return

    // Transparent at top, white on scroll (via .ll-nav-solid class)
    let lastSolid = null
    function update() {
      const solid = window.scrollY > 40
      if (solid === lastSolid) return
      lastSolid = solid
      scrolledNav.classList.toggle('ll-nav-solid', solid)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()

    // Hide "All Pages" link in the scrolled nav
    scrolledNav.querySelectorAll('a, button, div').forEach(function (el) {
      const text = (el.textContent || '').trim()
      if (/^All Pages/i.test(text) && text.length < 40 && el.children.length < 6) {
        el.style.setProperty('display', 'none', 'important')
      }
    })
  }

  /* ─────────────────────────────────────────
     FIX 5: "All Pages" hover dropdown
     Framer hover-opens a Menu panel. That JS doesn't fire for us.
     Reimplement: on mouseenter of trigger/container, show the menu.
  ───────────────────────────────────────── */
  function setupAllPagesDropdown() {
    const triggers = [...document.querySelectorAll('a, button, div, span')].filter(function (el) {
      const t = (el.textContent || '').trim()
      return /^All Pages/i.test(t) && t.length < 40 && el.children.length < 5
    })
    if (triggers.length === 0) return

    triggers.forEach(function (trigger) {
      // Walk up to find the container that holds both the trigger AND a Menu
      let container = trigger
      let menu = null
      for (let i = 0; i < 12 && container.parentElement; i++) {
        container = container.parentElement
        menu = container.querySelector('[data-framer-name="Menu"]')
        if (menu) break
      }
      if (!menu) return

      menu.style.transition = 'opacity 0.22s ease, transform 0.22s ease, visibility 0.22s'

      let hideTimer = null
      function show() {
        clearTimeout(hideTimer)
        menu.style.setProperty('opacity', '1', 'important')
        menu.style.setProperty('visibility', 'visible', 'important')
        menu.style.setProperty('pointer-events', 'auto', 'important')
        menu.style.setProperty('transform', 'translateY(0)', 'important')
        menu.style.setProperty('display', 'flex', 'important')
      }
      function scheduleHide() {
        hideTimer = setTimeout(function () {
          menu.style.setProperty('opacity', '0', 'important')
          menu.style.setProperty('visibility', 'hidden', 'important')
          menu.style.setProperty('pointer-events', 'none', 'important')
          menu.style.setProperty('transform', 'translateY(-8px)', 'important')
        }, 200)
      }

      container.addEventListener('mouseenter', show)
      container.addEventListener('mouseleave', scheduleHide)
      // Also keep open when mouse is on the menu itself
      menu.addEventListener('mouseenter', show)
      menu.addEventListener('mouseleave', scheduleHide)
    })
  }

  function initEager() {
    // These must run ASAP so links don't navigate on early clicks,
    // and so reveal classes land on elements before the first paint
    // (no "preloaded" content flash on refresh).
    wireNavLinks()
    wireModalTriggers()
    hideWhyLearnMore()
    hideGetApiKeys()
    swapNavLogo()
    cleanupFooter()
    enforceBannerHeading()
    setupScrollReveals()
  }

  function initDeferred() {
    // These need layout/hydration to be done
    setupNavScrollVariant()
    setupAllPagesDropdown()
    setupCardHovers()
    setupButtonHovers()
    setupProgressLine()
    buildModal()
    buildMobileNav()
    // Re-run in case Framer re-hydrated and replaced nodes
    wireNavLinks()
    wireModalTriggers()
    swapNavLogo()
    hideGetApiKeys()
    cleanupFooter()
    enforceBannerHeading()
    window.addEventListener('resize', enforceBannerHeading)
  }

  /* ─────────────────────────────────────────
     MOBILE NAV — hamburger button + full-screen drawer.
     Builds from scratch rather than reusing Framer's nav markup.
  ───────────────────────────────────────── */
  function buildMobileNav() {
    if (document.getElementById('ll-mobile-drawer')) return
    const nav = document.querySelector('nav.framer-bkjSs')
    if (!nav) return
    const baseContainer = nav.querySelector('[data-framer-name="Base Container"]')
    if (!baseContainer) return

    // Hamburger button — insert at the right end of the Base Container
    const btn = document.createElement('button')
    btn.className = 'll-nav-hamburger'
    btn.setAttribute('aria-label', 'Open menu')
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<line x1="3" y1="6" x2="21" y2="6"/>' +
        '<line x1="3" y1="12" x2="21" y2="12"/>' +
        '<line x1="3" y1="18" x2="21" y2="18"/>' +
      '</svg>'
    baseContainer.appendChild(btn)

    // Drawer
    const drawer = document.createElement('div')
    drawer.id = 'll-mobile-drawer'
    drawer.innerHTML =
      '<div class="ll-drawer-header">' +
        '<a href="./"><img src="assets/img/leafloans-wordmark.png" alt="Leaf Loans" /></a>' +
        '<button class="ll-drawer-close" aria-label="Close menu">×</button>' +
      '</div>' +
      '<nav>' +
        '<a href="./">Home</a>' +
        '<a href="./about-us">About Us</a>' +
        '<a href="#technology" data-ll-smooth>Technology</a>' +
        '<a href="#how-it-works" data-ll-smooth>How It Works</a>' +
        '<a href="./services">Services</a>' +
        '<a href="./contact-us">Contact Us</a>' +
      '</nav>' +
      '<a href="./contact-us" class="ll-drawer-cta">Get Started →</a>'
    document.body.appendChild(drawer)

    function open() {
      drawer.classList.add('ll-open')
      document.documentElement.classList.add('ll-drawer-open')
    }
    function close() {
      drawer.classList.remove('ll-open')
      document.documentElement.classList.remove('ll-drawer-open')
    }

    btn.addEventListener('click', open)
    drawer.querySelector('.ll-drawer-close').addEventListener('click', close)
    // Close when any drawer link is clicked
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close)
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('ll-open')) close()
    })
  }

  function init() {
    try { initEager() } catch (e) {
      console.error('[LeafLoans] initEager failed', e)
    }
    // Failsafe: never let the pre-hide rule trap content. If the reveal
    // setup didn't run (or threw mid-way), flip the flag so pre-hidden
    // elements become visible. Reveal animations may still happen for
    // anything that has .ll-reveal; untouched elements just appear.
    if (!document.documentElement.classList.contains('ll-anims-ready')) {
      document.documentElement.classList.add('ll-anims-ready')
    }
    setTimeout(initDeferred, 600)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()

