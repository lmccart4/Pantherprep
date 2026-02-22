(function () {
  'use strict';

  var TRANSLATE_API = 'https://us-central1-pantherprep-a5a73.cloudfunctions.net/translateText';

  var LANGUAGES = [
    { code: 'en', name: 'English', native: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
    { code: 'es', name: 'Spanish', native: 'Espa\u00f1ol', flag: '\u{1F1EA}\u{1F1F8}' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', native: '\u7b80\u4f53\u4e2d\u6587', flag: '\u{1F1E8}\u{1F1F3}' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', native: '\u7e41\u9ad4\u4e2d\u6587', flag: '\u{1F1F9}\u{1F1FC}' },
    { code: 'ar', name: 'Arabic', native: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', flag: '\u{1F1F8}\u{1F1E6}' },
    { code: 'hi', name: 'Hindi', native: '\u0939\u093f\u0928\u094d\u0926\u0940', flag: '\u{1F1EE}\u{1F1F3}' },
    { code: 'fr', name: 'French', native: 'Fran\u00e7ais', flag: '\u{1F1EB}\u{1F1F7}' },
    { code: 'pt', name: 'Portuguese', native: 'Portugu\u00eas', flag: '\u{1F1E7}\u{1F1F7}' },
    { code: 'ru', name: 'Russian', native: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}' },
    { code: 'ja', name: 'Japanese', native: '\u65e5\u672c\u8a9e', flag: '\u{1F1EF}\u{1F1F5}' },
    { code: 'ko', name: 'Korean', native: '\ud55c\uad6d\uc5b4', flag: '\u{1F1F0}\u{1F1F7}' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}' }
  ];

  var cache = {};
  try { var stored = sessionStorage.getItem('pp_cache'); if (stored) cache = JSON.parse(stored); } catch(e) {}
  function saveCache() { try { sessionStorage.setItem('pp_cache', JSON.stringify(cache)); } catch(e) {} }

  function collectTextNodes() {
    var texts = new Map();
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'CODE' || tag === 'PRE') return NodeFilter.FILTER_REJECT;
        if (p.closest('.pp-translate') || p.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT;
        if (p.hasAttribute('data-pp-original')) return NodeFilter.FILTER_REJECT;
        var t = node.textContent.trim();
        if (!t || t.length < 2) return NodeFilter.FILTER_REJECT;
        if (/^[\d\s\.\,\:\;\-\+\=\%\$\#\@\!\?\(\)\[\]\{\}\/\\]+$/.test(t)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      texts.set(n, n.textContent);
      if (n.parentElement) n.parentElement.setAttribute('data-pp-original', n.textContent);
    }
    return texts;
  }

  function collectAttrs() {
    var attrs = new Map();
    var els = document.querySelectorAll('[placeholder]:not([data-pp-attr-done]),[title]:not([data-pp-attr-done]),[aria-label]:not([data-pp-attr-done])');
    els.forEach(function(el) {
      if (el.closest('.pp-translate') || el.closest('[data-no-translate]')) return;
      var a = {};
      if (el.getAttribute('placeholder')) a.placeholder = el.getAttribute('placeholder');
      if (el.getAttribute('title')) a.title = el.getAttribute('title');
      if (el.getAttribute('aria-label')) a['aria-label'] = el.getAttribute('aria-label');
      if (Object.keys(a).length) {
        attrs.set(el, a);
        el.setAttribute('data-pp-attr-done', '1');
      }
    });
    return attrs;
  }

  var allTextNodes = new Map();
  var allAttrs = new Map();

  function refreshSnapshot() {
    var newTexts = collectTextNodes();
    var newAttrs = collectAttrs();
    newTexts.forEach(function(val, key) { allTextNodes.set(key, val); });
    newAttrs.forEach(function(val, key) { allAttrs.set(key, val); });
    return { newTexts: newTexts, newAttrs: newAttrs };
  }

  function translateBatch(texts, lang) {
    var uncached = [], uncachedIdx = [], results = new Array(texts.length);
    texts.forEach(function(t, i) {
      var k = lang + '::' + t;
      if (cache[k]) { results[i] = cache[k]; } else { uncached.push(t); uncachedIdx.push(i); }
    });
    if (uncached.length === 0) return Promise.resolve(results);

    var CHUNK = 100;
    var promises = [];
    for (var s = 0; s < uncached.length; s += CHUNK) {
      (function(start) {
        var chunk = uncached.slice(start, start + CHUNK);
        var chunkIdx = uncachedIdx.slice(start, start + CHUNK);
        promises.push(
          fetch(TRANSLATE_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: chunk, targetLanguage: lang, sourceLanguage: 'en' })
          })
          .then(function(r) { if (!r.ok) throw new Error('API ' + r.status); return r.json(); })
          .then(function(data) {
            (data.translations || []).forEach(function(translated, j) {
              var oi = chunkIdx[j];
              results[oi] = translated;
              cache[lang + '::' + texts[oi]] = translated;
            });
          })
          .catch(function(err) {
            console.error('Translation error:', err);
            chunkIdx.forEach(function(oi) { if (!results[oi]) results[oi] = texts[oi]; });
          })
        );
      })(s);
    }
    return Promise.all(promises).then(function() { saveCache(); return results; });
  }

  var currentLang = 'en';

  function translateAllNodes(langCode) {
    if (langCode === 'en') {
      allTextNodes.forEach(function(orig, node) {
        if (node.parentElement) node.textContent = orig;
      });
      allAttrs.forEach(function(attrs, el) {
        Object.keys(attrs).forEach(function(a) { el.setAttribute(a, attrs[a]); });
      });
      document.documentElement.dir = 'ltr';
      return Promise.resolve();
    }

    var textNodes = [], textsArr = [];
    allTextNodes.forEach(function(orig, node) {
      if (node.parentElement) { textNodes.push(node); textsArr.push(orig); }
    });
    var attrEntries = [];
    allAttrs.forEach(function(attrs, el) {
      Object.keys(attrs).forEach(function(a) {
        attrEntries.push({ el: el, attr: a, original: attrs[a] });
        textsArr.push(attrs[a]);
      });
    });

    if (textsArr.length === 0) return Promise.resolve();

    return translateBatch(textsArr, langCode).then(function(translated) {
      textNodes.forEach(function(node, i) {
        if (node.parentElement) node.textContent = translated[i];
      });
      var offset = textNodes.length;
      attrEntries.forEach(function(entry, i) {
        entry.el.setAttribute(entry.attr, translated[offset + i]);
      });
      document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    });
  }

  function translateNewNodes(newTexts, newAttrs, langCode) {
    if (langCode === 'en' || (newTexts.size === 0 && newAttrs.size === 0)) return;

    var textNodes = [], textsArr = [];
    newTexts.forEach(function(orig, node) {
      if (node.parentElement) { textNodes.push(node); textsArr.push(orig); }
    });
    var attrEntries = [];
    newAttrs.forEach(function(attrs, el) {
      Object.keys(attrs).forEach(function(a) {
        attrEntries.push({ el: el, attr: a, original: attrs[a] });
        textsArr.push(attrs[a]);
      });
    });

    if (textsArr.length === 0) return;

    translateBatch(textsArr, langCode).then(function(translated) {
      textNodes.forEach(function(node, i) {
        if (node.parentElement) node.textContent = translated[i];
      });
      var offset = textNodes.length;
      attrEntries.forEach(function(entry, i) {
        entry.el.setAttribute(entry.attr, translated[offset + i]);
      });
    });
  }

  function translatePage(langCode) {
    if (langCode === currentLang) return;
    currentLang = langCode;
    try { localStorage.setItem('pp_lang', langCode); } catch(e) {}
    updateDisplay(langCode);
    setLoading(true);
    refreshSnapshot();
    translateAllNodes(langCode).then(function() {
      setLoading(false);
    });
  }

  var mutationTimer = null;
  function startObserver() {
    var observer = new MutationObserver(function() {
      clearTimeout(mutationTimer);
      mutationTimer = setTimeout(function() {
        var result = refreshSnapshot();
        if (result.newTexts.size > 0 || result.newAttrs.size > 0) {
          translateNewNodes(result.newTexts, result.newAttrs, currentLang);
        }
      }, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function setLoading(on) {
    var label = document.querySelector('.pp-translate__label');
    if (!label) return;
    if (on) label.textContent = '\u23f3 Translating\u2026';
  }

  function updateDisplay(langCode) {
    var label = document.querySelector('.pp-translate__label');
    var lang = LANGUAGES.find(function(l) { return l.code === langCode; });
    if (label && lang) label.textContent = lang.flag + '  ' + lang.native;
  }

  function createDropdown() {
    var saved = 'en';
    try { saved = localStorage.getItem('pp_lang') || 'en'; } catch(e) {}
    var initial = LANGUAGES.find(function(l) { return l.code === saved; }) || LANGUAGES[0];

    var wrapper = document.createElement('div');
    wrapper.className = 'pp-translate';
    wrapper.setAttribute('data-no-translate', 'true');

    var btn = document.createElement('button');
    btn.className = 'pp-translate__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Select language');
    btn.innerHTML = '<svg class="pp-translate__globe" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span class="pp-translate__label">' + initial.flag + '  ' + initial.native + '</span><svg class="pp-translate__chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

    var menu = document.createElement('ul');
    menu.className = 'pp-translate__menu';
    menu.setAttribute('role', 'listbox');
    menu.style.display = 'none';

    LANGUAGES.forEach(function(lang) {
      var li = document.createElement('li');
      li.className = 'pp-translate__option' + (lang.code === saved ? ' pp-translate__option--active' : '');
      li.setAttribute('role', 'option');
      li.innerHTML = '<span class="pp-translate__flag">' + lang.flag + '</span><span class="pp-translate__name"><span class="pp-translate__native">' + lang.native + '</span>' + (lang.code !== 'en' ? '<span class="pp-translate__english">' + lang.name + '</span>' : '') + '</span>';
      li.addEventListener('click', function() {
        menu.querySelectorAll('.pp-translate__option--active').forEach(function(el) { el.classList.remove('pp-translate__option--active'); });
        li.classList.add('pp-translate__option--active');
        menu.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
        translatePage(lang.code);
      });
      menu.appendChild(li);
    });

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = menu.style.display === 'none';
      menu.style.display = open ? 'block' : 'none';
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function(e) {
      if (!wrapper.contains(e.target)) {
        menu.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        menu.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(menu);
    return wrapper;
  }

  function injectDropdown() {
    var dd = createDropdown();
    dd.style.position = 'fixed';
    dd.style.top = '60px';
    dd.style.right = '24px';
    dd.style.zIndex = '10000';
    document.body.appendChild(dd);
  }

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = '.pp-translate{position:relative;z-index:10000}.pp-translate__btn{display:inline-flex;align-items:center;gap:7px;background:rgba(20,20,20,.92);border:1px solid rgba(255,255,255,.13);border-radius:8px;padding:5px 11px;color:#f5f5f5;font-family:"DM Sans",sans-serif;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap;line-height:1.4;backdrop-filter:blur(8px)}.pp-translate__btn:hover{background:rgba(30,30,30,.95);border-color:rgba(255,255,255,.22)}.pp-translate__globe{opacity:.6;flex-shrink:0}.pp-translate__label{max-width:130px;overflow:hidden;text-overflow:ellipsis}.pp-translate__chevron{opacity:.4;flex-shrink:0;transition:transform .2s}[aria-expanded="true"] .pp-translate__chevron{transform:rotate(180deg)}.pp-translate__menu{position:absolute;top:calc(100% + 6px);right:0;min-width:230px;max-height:380px;overflow-y:auto;background:#1e1e1e;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:4px;list-style:none;box-shadow:0 8px 30px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.04);animation:ppMenuIn .14s ease-out}@keyframes ppMenuIn{from{opacity:0;transform:translateY(-5px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}.pp-translate__menu::-webkit-scrollbar{width:5px}.pp-translate__menu::-webkit-scrollbar-track{background:0 0}.pp-translate__menu::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}.pp-translate__option{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:7px;cursor:pointer;transition:background .12s}.pp-translate__option:hover{background:rgba(255,255,255,.07)}.pp-translate__option--active{background:rgba(214,40,40,.12)}.pp-translate__option--active:hover{background:rgba(214,40,40,.20)}.pp-translate__flag{font-size:1.15rem;line-height:1;flex-shrink:0}.pp-translate__name{display:flex;flex-direction:column;gap:1px;flex:1}.pp-translate__native{font-size:.88rem;font-weight:600;color:#f5f5f5}.pp-translate__english{font-size:.72rem;color:#737373;font-weight:400}[dir="rtl"] .pp-translate__menu{right:auto;left:0}';
    document.head.appendChild(s);
  }

  function init() {
    injectStyles();
    injectDropdown();
    setTimeout(function() {
      refreshSnapshot();
      startObserver();
      var saved;
      try { saved = localStorage.getItem('pp_lang'); } catch(e) {}
      if (saved && saved !== 'en') {
        currentLang = 'en';
        translatePage(saved);
      }
    }, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
