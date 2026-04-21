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
  ]

  const ROLE_OPTIONS = [
    { v: '', l: 'Select one…' },
    { v: 'founder', l: 'Founder / CEO' },
    { v: 'product', l: 'Product / Business' },
    { v: 'developer', l: 'Developer / Engineering' },
    { v: 'partnership', l: 'Partnership / BD' },
    { v: 'investor', l: 'Investor' },
    { v: 'media', l: 'Media / Press' },
    { v: 'other', l: 'Other' },
  ]

  function buildModal() {
    if (document.getElementById('ll-modal-overlay')) return
    const overlay = document.createElement('div')
    overlay.id = 'll-modal-overlay'
    overlay.innerHTML =
      '<div id="ll-modal-card">' +
      '<button id="ll-modal-close" aria-label="Close">×</button>' +
      '<div id="ll-modal-form-wrap">' +
      '<h2 id="ll-modal-title">Let\'s talk</h2>' +
      '<p id="ll-modal-sub">Tell us a bit about you. We\'ll reach out within 24 hours.</p>' +
      '<form id="ll-modal-form">' +
      '<div class="ll-field"><label for="ll-name">Name</label><input id="ll-name" name="name" type="text" required autocomplete="name" /></div>' +
      '<div class="ll-field"><label for="ll-email">Email</label><input id="ll-email" name="email" type="email" required autocomplete="email" /></div>' +
      '<div class="ll-field"><label for="ll-role">Role / Use-case</label><select id="ll-role" name="role" required>' +
      ROLE_OPTIONS.map(function (o) {
        return '<option value="' + o.v + '"' + (o.v === '' ? ' disabled selected' : '') + '>' + o.l + '</option>'
      }).join('') +
      '</select></div>' +
      '<button id="ll-modal-submit" type="submit">Connect</button>' +
      '<div id="ll-modal-error"></div>' +
      '</form>' +
      '</div>' +
      '<div id="ll-modal-success">' +
      '<div class="check">✓</div>' +
      '<h3>Got it.</h3>' +
      '<p>Thanks! We\'ll reach out within 24 hours.</p>' +
      '<button id="ll-modal-close-2" class="ll-secondary">Close</button>' +
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
        const err = document.getElementById('ll-modal-error')
        if (err) err.textContent = ''
      }, 250)
    }
    overlay.querySelector('#ll-modal-close').addEventListener('click', close)
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close() })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('ll-open')) close()
    })

    const closeBtn2 = overlay.querySelector('#ll-modal-close-2')
    if (closeBtn2) {
      // Reuse modal close button styling
      closeBtn2.style.cssText =
        'padding: 11px 22px; background: #f4f4f2; color: #0c0c0c; border: none; border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s ease;'
      closeBtn2.addEventListener('mouseenter', function () { closeBtn2.style.background = '#e8e8e6' })
      closeBtn2.addEventListener('mouseleave', function () { closeBtn2.style.background = '#f4f4f2' })
      closeBtn2.addEventListener('click', close)
    }

    // Form submit
    const form = overlay.querySelector('#ll-modal-form')
    form.addEventListener('submit', async function (e) {
      e.preventDefault()
      const submit = document.getElementById('ll-modal-submit')
      const errEl = document.getElementById('ll-modal-error')
      errEl.textContent = ''
      submit.disabled = true
      submit.textContent = 'Sending…'

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        role: form.role.value,
        source: overlay.dataset.source || 'Contact',
        page: window.location.pathname,
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
        document.getElementById('ll-modal-form-wrap').style.display = 'none'
        document.getElementById('ll-modal-success').classList.add('show')
      } catch (err) {
        errEl.textContent = 'Something went wrong. Please try again.'
        console.error('[LeafLoans] submit failed', err)
      } finally {
        submit.disabled = false
        submit.textContent = 'Connect'
      }
    })

    return overlay
  }

  function openModal(source) {
    const overlay = document.getElementById('ll-modal-overlay') || buildModal()
    overlay.dataset.source = source || 'Contact'
    // Optionally customize title per source
    const title = document.getElementById('ll-modal-title')
    if (title) {
      if (/api/i.test(source)) title.textContent = 'Get API access'
      else if (/demo/i.test(source)) title.textContent = 'Book a demo'
      else if (/account/i.test(source)) title.textContent = 'Open an account'
      else title.textContent = "Let's talk"
    }
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
            /modern banking for modern companies/i,
            /modern companies/i,
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
     FIX 3: Scroll-reveal animations on major sections and Why Leaf Loans
     cards. Sections fade + slide up as they enter the viewport.
  ───────────────────────────────────────── */
  function setupScrollReveals() {
    const sectionTargets = Array.from(
      document.querySelectorAll('[data-framer-name$="Section"]')
    ).filter(function (el) {
      const r = el.getBoundingClientRect()
      return r.height > 120
    })

    const cardTargets = findWhyCards()
    const seen = new Set()
    const targets = [...sectionTargets, ...cardTargets].filter(function (el) {
      if (seen.has(el)) return false
      seen.add(el)
      return true
    })
    if (targets.length === 0) return

    const viewportH = window.innerHeight
    targets.forEach(function (el) {
      const r = el.getBoundingClientRect()
      if (r.width < 150 || r.height < 80) return
      // Already above the fold → show immediately (no flash)
      if (r.top < viewportH * 0.9) {
        el.classList.add('ll-reveal', 'll-in-view')
      } else {
        el.classList.add('ll-reveal')
      }
    })

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ll-in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '-40px 0px' }
    )
    targets.forEach(function (el) {
      if (el.classList.contains('ll-reveal') && !el.classList.contains('ll-in-view')) {
        observer.observe(el)
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
    // These must run ASAP so links don't navigate on early clicks
    wireNavLinks()
    wireModalTriggers()
    hideWhyLearnMore()
    hideGetApiKeys()
    swapNavLogo()
    cleanupFooter()
  }

  function initDeferred() {
    // These need layout/hydration to be done
    setupNavScrollVariant()
    setupAllPagesDropdown()
    setupCardHovers()
    setupButtonHovers()
    setupScrollReveals()
    setupProgressLine()
    buildModal()
    // Re-run in case Framer re-hydrated and replaced nodes
    wireNavLinks()
    wireModalTriggers()
    swapNavLogo()
    hideGetApiKeys()
    cleanupFooter()
  }

  function init() {
    initEager()
    setTimeout(initDeferred, 600)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()

