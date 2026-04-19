# Ochrana osobních údajů — M&T Servis (interní dokument)

> Tento dokument je **interní přehled** pro provozovatele. Veřejné zásady pro
> zákazníky jsou v souboru `zasady.html` (odkazované z patičky webu).
> 
> **Datum účinnosti:** 19. 4. 2026

---

## Správce údajů

- **Jméno:** Tomáš Skopalík
- **IČO:** 08134235
- **Sídlo / provozovna:** Šumvaldská 59, Dlouhá Loučka
- **Kontakt:** info@mat-servis.cz · 731 885 825

---

## Jaká data zpracovávám

### Rezervace (přezutí, výměna oleje)
- Jméno a příjmení
- Telefon
- E-mail
- VIN / SPZ (identifikace vozidla)
- Značka, model, rok, kód motoru
- Poznámka zákazníka (volitelně)
- Termín (datum, čas)
- Služba a cena

### Po provedení služby (archiv + tržby)
- Všechny údaje z rezervace
- Datum provedení
- Reálná tržba

### Marketingový kontakt (Brevo list)
- E-mail, jméno
- Značka vozidla, datum poslední návštěvy
- Typ služby

---

## Kde data leží

| Služba | Provozovatel | Umístění | Účel |
|---|---|---|---|
| Firestore | Google Ireland Ltd. | EU (europe-west10) | Hlavní databáze rezervací |
| Google Sheets | Google Ireland Ltd. | EU | Audit log, tržby, ceník |
| Google Apps Script | Google Ireland Ltd. | EU | Backend (zpracování rezervací, mailing) |
| Brevo | Sendinblue SAS, Francie | EU | Transakční + marketingové maily |
| GitHub Pages | GitHub Inc., USA | USA | Hosting webu (žádná osobní data neleží) |
| dataovozidlech.cz | ČR | ČR | Technické údaje vozidla z VIN |
| Castrol Oil Selector | BP p.l.c., UK | UK | Doporučení typu oleje |

**Mimo EU se posílá:**
- **VIN → Castrol** (UK) — pouze VIN, nic osobního
- **VIN → GitHub Pages** nikoliv — GitHub hostuje jen statický HTML/JS,
  osobní data přes GitHub vůbec neteče

---

## Právní základ zpracování

- **Plnění smlouvy** (čl. 6 odst. 1 písm. b GDPR) — rezervace, provedení služby,
  archivace pro případ reklamace
- **Oprávněný zájem** (čl. 6 odst. 1 písm. f GDPR) — marketingové e-maily
  o nadcházející sezóně přezutí (zákazník může odhlásit kdykoliv v mailu)

---

## Doba uchování

- **Aktivní rezervace:** po dobu obchodního vztahu
- **Archiv (po provedení služby):** anonymizace **5 let od poslední návštěvy**
  - Po 5 letech bez aktivity se u záznamu smaže: jméno, telefon, e-mail, VIN, SPZ,
    poznámka, `auto` string
  - Zůstává: datum služby, typ služby, cena, značka, model, kód motoru,
    `vin_hash` (SHA-256 z původního VINu — slouží k rozpoznání, že auto
    u nás už bylo, pokud přijde znovu)
- **Brevo marketingový list:** po odhlášení se e-mail smaže okamžitě
- **Anonymizace se spouští ručně 1× ročně v lednu** přes GAS funkci
  `anonymizace_rocni()` (⚠️ **zatím neimplementováno** — v plánu na Fázi 7)

---

## Práva zákazníků

Zákazník má právo:
- **Na přístup** — získat kopii svých údajů
- **Na opravu** — opravit nepřesné údaje
- **Na výmaz** — nechat svá data smazat (kromě toho, co musím podle zákona držet)
- **Na přenositelnost** — dostat data v strukturovaném formátu
- **Námitka proti marketingu** — odhlásit z e-mailingu (v každém mailu je odkaz)

**Způsob vyřízení:** e-mailem na info@mat-servis.cz, vyřízení do 30 dní.

**Reálný postup při žádosti o výmaz:**
1. Ověřit identitu žadatele (musí žádat ze stejného e-mailu, pod kterým je evidován)
2. V admin.html najít rezervaci (pokud existuje) a smazat (🗑️)
3. V Brevo dashboard smazat e-mail z kontaktů
4. V Firestore archivech smazat staré záznamy (ručně přes Firebase Console)
5. V Google Sheets odstranit řádky (sheety `rezervace_prezuti_log`,
   `rezervace_oleje`, `Trzby`, `poptavky_naceneni`)
6. Poslat zákazníkovi potvrzení

---

## Technická bezpečnost

- Hesla a API klíče v `PropertiesService` (Google Apps Script), **nikoli v kódu**
- Admin přístup chráněn heslem (20+ znaků) + session tokenem (6h TTL)
- Rate limiting na login (20 pokusů / 10 min → blok 15 min)
- Firebase Rules `if false` — klient nemá přímý přístup k datům,
  vše přes service account v GAS
- HTTPS na webu (GitHub Pages + Wedos DNS)

---

## Úřad pro ochranu osobních údajů

Dozorový orgán: **ÚOOÚ**, Pplk. Sochora 27, 170 00 Praha 7, www.uoou.cz

Zákazník má právo podat stížnost na ÚOOÚ, pokud má za to, že zpracování jeho
osobních údajů porušuje GDPR.
