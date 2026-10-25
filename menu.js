// ===== M&T menu — jediné místo, kde se menu upravuje =====
// Načítá ho každá veřejná stránka řádkem <script src="menu.js"></script> hned za <body>.
// Nová položka v menu = upravit jen tento soubor (seznam HTML níže).
// Vzhled lišty si některé stránky mění vlastním stylem (body .mtm-bar …) – to zůstává v nich.

(function () {
  var styl = document.createElement('style');
  styl.textContent = `
  .mtm-bar { position: relative; z-index: 900; display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 84px; padding: 0 12px 0 16px; background: #fff; border-bottom: 1px solid #e2e8f0; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; box-sizing: border-box; }
  .mtm-znacka { display: block; line-height: 0; }
  .mtm-znacka img { height: 68px; width: auto; display: block; }
  .mtm-btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px; border: 1px solid #dbe4f0; border-radius: 10px; background: #eff6ff; color: #1d4ed8; font: 700 14px 'Inter', system-ui, sans-serif; cursor: pointer; }
  .mtm-btn:active { background: #dbeafe; }
  .mtm-ikona { font-size: 18px; line-height: 1; }
  .mtm-zaves { position: fixed; inset: 0; z-index: 1000; background: rgba(15, 23, 42, 0.45); opacity: 0; visibility: hidden; transition: opacity 0.2s; }
  .mtm-panel { position: fixed; top: 0; right: 0; bottom: 0; z-index: 1001; width: min(320px, 86vw); background: #fff; box-shadow: -6px 0 24px rgba(0,0,0,0.15); transform: translateX(100%); transition: transform 0.22s ease; overflow-y: auto; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; color: #1e293b; box-sizing: border-box; padding: 0 0 24px; }
  .mtm-otevreno .mtm-zaves { opacity: 1; visibility: visible; }
  .mtm-otevreno .mtm-panel { transform: translateX(0); }
  .mtm-hlava { display: flex; align-items: center; justify-content: space-between; height: 48px; padding: 0 12px 0 20px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #17496e; }
  .mtm-zavrit { width: 36px; height: 36px; border: none; border-radius: 10px; background: #f1f5f9; color: #334155; font-size: 18px; cursor: pointer; }
  .mtm-sekce { padding: 14px 20px 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #64748b; }
  .mtm-odkaz { display: block; padding: 11px 20px; color: #1e293b; text-decoration: none; font-size: 15px; font-weight: 600; border-left: 3px solid transparent; }
  .mtm-odkaz:active { background: #f1f5f9; }
  .mtm-odkaz.mtm-aktivni { color: #1d4ed8; background: #eff6ff; border-left-color: #2563eb; }
  .mtm-kontakt { margin: 16px 20px 0; padding: 14px 16px; background: #f8fafc; border-radius: 12px; font-size: 14px; line-height: 1.9; }
  .mtm-kontakt a { color: #1d4ed8; text-decoration: none; font-weight: 600; }
  .mtm-radek { display: flex; align-items: center; gap: 10px; padding: 3px 0; }
  .mtm-ik { width: 17px; height: 17px; flex-shrink: 0; fill: none; stroke: #64748b; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .mtm-kontakt-nadpis { font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
  body.mtm-zamceno { overflow: hidden; }
`;
  document.head.appendChild(styl);

  var html = `
<nav class="mtm-bar" aria-label="Hlavní menu">
  <a class="mtm-znacka" href="index.html"><img src="logo.png" alt="M&amp;T Servis" width="141" height="68"></a>
  <button class="mtm-btn" type="button" aria-label="Otevřít menu" aria-expanded="false" aria-controls="mtm-panel" onclick="mtmOtevri()"><span class="mtm-ikona" aria-hidden="true">☰</span> Menu</button>
</nav>
<div id="mtm-obal">
  <div class="mtm-zaves" onclick="mtmZavri()"></div>
  <aside class="mtm-panel" id="mtm-panel" aria-hidden="true" aria-label="Menu">
    <div class="mtm-hlava">Menu <button class="mtm-zavrit" type="button" aria-label="Zavřít menu" onclick="mtmZavri()">✕</button></div>
    <a class="mtm-odkaz" href="index.html">Úvod</a>
    <div class="mtm-sekce">Služby</div>
    <a class="mtm-odkaz" href="prezuti.html">Přezutí pneumatik</a>
    <a class="mtm-odkaz" href="oleje.html">Výměna oleje</a>
    <div class="mtm-sekce">Pro dílnu</div>
    <a class="mtm-odkaz" href="dilenska-prirucka.html">Strojírenské tabulky</a>
    <a class="mtm-odkaz" href="zavitove-tabulky.html">Závitové tabulky</a>
    <div class="mtm-sekce">Informace</div>
    <a class="mtm-odkaz" href="zasady.html">Ochrana osobních údajů</a>
    <div class="mtm-kontakt">
      <div class="mtm-kontakt-nadpis">Kontakt</div>
      <div class="mtm-radek"><svg class="mtm-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg><a href="tel:+420731885825">731 885 825</a></div>
      <div class="mtm-radek"><svg class="mtm-ik" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><a href="mailto:info@mat-servis.cz">info@mat-servis.cz</a></div>
      <div class="mtm-radek"><svg class="mtm-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg><a href="https://www.google.com/maps/search/?api=1&amp;query=%C5%A0umvaldsk%C3%A1%2059%2C%20Dlouh%C3%A1%20Lou%C4%8Dka" target="_blank" rel="noopener">Šumvaldská 59, Dlouhá Loučka</a></div>
      <div class="mtm-radek"><svg class="mtm-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg><a href="https://www.facebook.com/people/MT-Servis/61566852234635/" target="_blank" rel="noopener">M&amp;T Servis na Facebooku</a></div>
    </div>
  </aside>
</div>
`;
  // Menu se vloží přesně na místo, kde je <script src="menu.js">
  document.currentScript.insertAdjacentHTML('afterend', html);
})();

(function () {
  // Zvýraznit stránku, na které zákazník je
  var stranka = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  var odkazy = document.querySelectorAll('#mtm-panel .mtm-odkaz');
  for (var i = 0; i < odkazy.length; i++) {
    if (odkazy[i].getAttribute('href').replace(/\.html$/, '') === stranka) odkazy[i].classList.add('mtm-aktivni');
  }
})();
function mtmOtevri() {
  document.getElementById('mtm-obal').classList.add('mtm-otevreno');
  document.getElementById('mtm-panel').setAttribute('aria-hidden', 'false');
  document.querySelector('.mtm-btn').setAttribute('aria-expanded', 'true');
  document.body.classList.add('mtm-zamceno');
}
function mtmZavri() {
  document.getElementById('mtm-obal').classList.remove('mtm-otevreno');
  document.getElementById('mtm-panel').setAttribute('aria-hidden', 'true');
  document.querySelector('.mtm-btn').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('mtm-zamceno');
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') mtmZavri(); });
