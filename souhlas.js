// M&T Servis – lišta souhlasu s cookies a Google Analytics
// Volba návštěvníka: localStorage 'mt_souhlas' ('ano' / 'ne'). ?matdev=1 vypne GA i lištu na tomto zařízení.

(function () {
  var GA_ID = 'G-Z3Z3QHH5T7';
  var GAS_URL = 'https://script.google.com/macros/s/AKfycbzytqpchcUuufLG6G56OhK6NtBMWwudBH4aZMDVFK8PRXt7x4dOeWFxqwP1Ab4E67c0rw/exec';
  var p = new URLSearchParams(location.search);
  if (p.get('matdev') === '1') { try { localStorage.setItem('matdev', '1'); } catch (e) {} }
  if (p.get('matdev') === '0') { try { localStorage.removeItem('matdev'); } catch (e) {} }

  function cti(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function zapis(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var vyvojar = cti('matdev') === '1';

  function spustGA() {
    if (vyvojar || window.gtag) return;
    window['ga-disable-' + GA_ID] = false;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  // Po odmítnutí: GA přestane posílat data a smažou se jeho cookies (_ga, _ga_…)
  function zastavGA() {
    window['ga-disable-' + GA_ID] = true;
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n.indexOf('_ga') !== 0) return;
      var d = location.hostname.replace(/^www\./, '');
      ['', '; domain=' + d, '; domain=.' + d].forEach(function (dom) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + dom;
      });
    });
  }

  function zavriListu() {
    var l = document.getElementById('mt-souhlas');
    if (l) l.parentNode.removeChild(l);
    document.body.style.paddingBottom = puvodniOdsazeni;
  }
  var puvodniOdsazeni = '';

  function ukazListu() {
    if (vyvojar || document.getElementById('mt-souhlas')) return;
    if (!document.getElementById('mt-souhlas-styl')) {
      var styl = document.createElement('style');
      styl.id = 'mt-souhlas-styl';
      styl.textContent =
        '#mt-souhlas{position:fixed;left:12px;right:12px;bottom:12px;z-index:950;max-width:460px;margin:0 auto;' +
        'background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 6px 24px rgba(15,23,42,.14);' +
        'padding:12px 14px;font:13px/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#475569;' +
        'display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;}' +
        '#mt-souhlas p{margin:0;flex:1 1 220px;}' +
        '#mt-souhlas a{color:#1d4ed8;text-decoration:none;font-weight:600;}' +
        '#mt-souhlas .mts-tl{display:flex;gap:8px;margin-left:auto;}' +
        '#mt-souhlas button{font:600 13px Inter,system-ui,sans-serif;border-radius:10px;padding:8px 14px;cursor:pointer;' +
        'background:#fff;color:#334155;border:1px solid #cbd5e1;}' +
        '#mt-souhlas .mts-ano{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe;}';
      document.head.appendChild(styl);
    }
    var l = document.createElement('div');
    l.id = 'mt-souhlas';
    l.setAttribute('role', 'region');
    l.setAttribute('aria-label', 'Souhlas s cookies');
    l.innerHTML =
      '<p>Tento web používá cookies ke statistice návštěvnosti. ' +
      '<a href="zasady.html#cookies">Více</a></p>' +
      '<div class="mts-tl"><button type="button" class="mts-ne">Nesouhlasím</button>' +
      '<button type="button" class="mts-ano">Souhlasím</button></div>';
    l.querySelector('.mts-ano').onclick = function () { zapis('mt_souhlas', 'ano'); zavriListu(); spustGA(); };
    l.querySelector('.mts-ne').onclick = function () { zapis('mt_souhlas', 'ne'); zastavGA(); zavriListu(); };
    document.body.appendChild(l);
    // Místo pod stránkou, aby lišta nezakryla poslední tlačítko (dá se doscrollovat nad ni)
    puvodniOdsazeni = document.body.style.paddingBottom;
    var dole = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    document.body.style.paddingBottom = (dole + l.offsetHeight + 24) + 'px';
  }

  // Znovu ukáže lištu (odkaz „Změnit nastavení cookies“ v zásadách)
  window.mtSouhlasZmenit = function () {
    try { localStorage.removeItem('mt_souhlas'); } catch (e) {}
    ukazListu();
  };

  // Nastavení webu z GAS; během jedné návštěvy se zjišťuje jen jednou
  function zjistiRezim(hotovo) {
    var r = null;
    try { r = sessionStorage.getItem('mt_nast'); } catch (e) {}
    if (r === '0' || r === '1') return hotovo(r === '1');
    var ctrl = (typeof AbortController === 'function') ? new AbortController() : null;
    var limit = ctrl ? setTimeout(function () { ctrl.abort(); }, 6000) : null;
    fetch(GAS_URL + '?action=nastaveni_webu', { redirect: 'follow', signal: ctrl ? ctrl.signal : undefined })
      .then(function (x) { return x.json(); })
      .then(function (d) {
        clearTimeout(limit);
        if (!d || !d.ok) return;
        try { sessionStorage.setItem('mt_nast', d.ga === 'po_souhlasu' ? '1' : '0'); } catch (e) {}
        hotovo(d.ga === 'po_souhlasu');
      })
      .catch(function () { clearTimeout(limit); });
  }

  var volba = cti('mt_souhlas');
  if (vyvojar) return;
  if (volba === 'ano') { spustGA(); return; }
  if (volba === 'ne') { zastavGA(); return; }
  if (document.body) ukazListu();
  else document.addEventListener('DOMContentLoaded', ukazListu);
  zjistiRezim(function (vyzadovat) {
    if (!vyzadovat && cti('mt_souhlas') !== 'ne') spustGA();
  });
})();
