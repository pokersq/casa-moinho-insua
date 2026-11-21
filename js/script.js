document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('pageLoader');
  const pageLoaded = new Promise(resolve => window.addEventListener('load', resolve));

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navBurger');
  const nav = document.getElementById('mainNav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Content (content/*.json, editado no Pages CMS) ---------- */
  const contentFiles = ['fotos', 'textos', 'alojamento', 'contactos', 'aviso'];
  let content = null;

  const loadContent = () => Promise.all(contentFiles.map(name =>
    fetch(`content/${name}.json`, { cache: 'no-cache' }).then(r => {
      if (!r.ok) throw new Error(`content/${name}.json: ${r.status}`);
      return r.json();
    })
  )).then(results => {
    content = {};
    contentFiles.forEach((name, i) => { content[name] = results[i]; });
  });

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Pages CMS grava caminhos como "/fotos/x.jpg"; sem a barra inicial funcionam também em pokersq.github.io/casa-moinho-insua/
  const imgSrc = (path) => encodeURI(String(path || '').replace(/^\/+/, ''));
  // Texto bilingue { pt, en }: se o inglês estiver vazio, mostra o português
  const tr = (obj, lang) => (obj && (obj[lang] || obj.pt)) || '';
  const getPath = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), content);

  /* ---------- Icons ---------- */
  const amenityIcons = {
    house: '<path d="M3 20V10l9-6 9 6v10h-6v-6H9v6z"/>',
    kitchen: '<path d="M4 4h16v10H4zM2 20h20M6 14v6M18 14v6"/>',
    bathroom: '<path d="M7 3v18M17 3v6a3 3 0 0 1-3 3H7M17 15v6"/>',
    tv: '<rect x="2" y="4" width="20" height="14" rx="1"/><path d="M8 21h8"/>',
    wifi: '<path d="M12 19V6M6 11l6-7 6 7M4 19h16"/>',
    parking: '<path d="M5 17h14M6 17V9l6-4 6 4v8M9 17v-5h6v5"/>',
    climate: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',
    terrace: '<path d="M12 2v6M8 8l4-6 4 6M5 10h14l-2 10H7z"/>',
    bbq: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    river: '<path d="M3 18c3-9 6-13 9-13s6 4 9 13"/><path d="M3 18h18"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  };
  const contactIcons = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.3z"/>',
    whatsapp: '<path d="M20.5 3.5a10.6 10.6 0 0 0-17.9 11L2 21l6.7-1.5a10.6 10.6 0 0 0 15.5-9A10.5 10.5 0 0 0 20.5 3.5zM12 19a8 8 0 0 1-4.1-1.1l-.3-.2-3 .7.7-2.9-.2-.3A8 8 0 1 1 12 19z"/><path d="M16.5 13.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2 4.7 4.7 0 0 0 1 2.5 10.7 10.7 0 0 0 4.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 0 0 1.5.1 2.5 2.5 0 0 0 1.6-1.1 1.9 1.9 0 0 0 .1-1.1c-.1-.1-.2-.2-.4-.3z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
    facebook: '<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    address: '<path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/>',
  };

  /* ---------- Render: static parts (independent of language) ---------- */
  const grid = document.getElementById('galleryGrid');
  const layoutHints = ['wide', '', '', 'tall', '', '', 'wide', '', '', 'tall', '', '', '', ''];

  const renderStatic = () => {
    const { fotos, textos, contactos } = content;

    document.getElementById('hero').style.backgroundImage = `url('${imgSrc(fotos.hero)}')`;
    document.getElementById('aboutImgMain').src = imgSrc(fotos.aboutMain);
    document.getElementById('aboutImgSub').src = imgSrc(fotos.aboutSub);

    const hostName = textos.about.hostName || '';
    document.getElementById('hostName').textContent = hostName;
    document.getElementById('hostAvatar').textContent = hostName.split(/\s+/).filter(Boolean)
      .map(w => w[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join('').toUpperCase();

    const address = [contactos.addressLine1, contactos.addressLine2].filter(Boolean).join(', ');
    document.getElementById('locationAddress').textContent = `${address}, Portugal`;
    document.getElementById('mapFrame').src = `https://www.google.com/maps?q=${encodeURIComponent(address + ', Portugal')}&output=embed`;

    (fotos.gallery || []).filter(img => img.image).forEach((img, idx) => {
      const div = document.createElement('div');
      const hint = layoutHints[idx % layoutHints.length];
      div.className = `gallery-item${hint ? ' ' + hint : ''}`;
      div.dataset.cat = img.category;
      div.dataset.index = idx;
      div.innerHTML = `<img src="${imgSrc(img.image)}" alt="Casa do Moinho da Ínsua" loading="lazy">`;
      grid.appendChild(div);
    });
  };

  /* ---------- Render: language-dependent parts ---------- */
  const renderLang = (lang) => {
    const { textos, alojamento, contactos, aviso } = content;

    document.querySelectorAll('[data-c]').forEach(el => {
      el.textContent = tr(getPath(el.dataset.c), lang);
    });

    const notice = document.getElementById('siteNotice');
    const noticeText = aviso.active ? tr(aviso, lang) : '';
    notice.textContent = noticeText;
    notice.hidden = !noticeText;

    document.getElementById('aboutParagraphs').innerHTML = (textos.about.paragraphs || [])
      .map(p => `<p>${esc(tr(p, lang))}</p>`).join('');

    document.getElementById('amenitiesGrid').innerHTML = (alojamento.amenities || []).map(a =>
      `<div class="amenity"><svg viewBox="0 0 24 24">${amenityIcons[a.icon] || amenityIcons.check}</svg><span>${esc(tr(a, lang))}</span></div>`
    ).join('');

    document.getElementById('rulesPanel').innerHTML = (alojamento.rules || []).map(r =>
      `<div class="rule"><p class="rule-label">${esc(tr(r.label, lang))}</p><p class="rule-value">${esc(tr(r.value, lang))}</p></div>`
    ).join('');

    document.getElementById('nearbyList').innerHTML = (contactos.nearby || []).map(n =>
      `<li><span>${esc(tr(n.name, lang))}</span><em>${esc(n.distance)}</em></li>`
    ).join('');

    const ui = (key) => translations[key][lang];
    const digits = String(contactos.phone || '').replace(/\D/g, '');
    const intl = digits.length === 9 ? '351' + digits : digits;
    const instagram = String(contactos.instagram || '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/[@/]/g, '');
    const card = (icon, href, label, value) =>
      `<a class="contact-card" href="${esc(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>` +
      `<svg viewBox="0 0 24 24">${contactIcons[icon]}</svg><div><p>${esc(label)}</p><strong>${esc(value)}</strong></div></a>`;

    const cards = [];
    if (digits) cards.push(card('phone', `tel:+${intl}`, ui('contact.phoneLabel'), contactos.phone));
    if (digits && contactos.whatsapp) cards.push(card('whatsapp', `https://wa.me/${intl}`, 'WhatsApp', ui('contact.whatsappCta')));
    if (contactos.email) cards.push(card('email', `mailto:${contactos.email}`, 'Email', contactos.email));
    if (instagram) cards.push(card('instagram', `https://www.instagram.com/${instagram}/`, 'Instagram', `@${instagram}`));
    if (contactos.facebook) cards.push(card('facebook', contactos.facebook, 'Facebook', ui('contact.facebookCta')));
    cards.push(
      `<div class="contact-card contact-card-static"><svg viewBox="0 0 24 24">${contactIcons.address}</svg>` +
      `<div><p>${esc(ui('contact.addressLabel'))}</p><strong>${esc(contactos.addressLine1)}<br>${esc(contactos.addressLine2)}</strong></div></div>`
    );
    document.getElementById('contactCards').innerHTML = cards.join('');
  };

  /* ---------- Gallery filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      grid.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.toggle('is-hidden', f !== 'all' && item.dataset.cat !== f);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  let currentIndex = 0;

  const visibleItems = () => Array.from(grid.querySelectorAll('.gallery-item:not(.is-hidden)'));

  const openLightbox = (index) => {
    const items = visibleItems();
    currentIndex = items.findIndex(el => Number(el.dataset.index) === index);
    if (currentIndex === -1) currentIndex = 0;
    updateLightbox(items);
    lightbox.classList.add('is-open');
  };
  const updateLightbox = (items) => {
    const el = items[currentIndex];
    lightboxImg.src = el.querySelector('img').src;
  };
  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(Number(item.dataset.index));
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('is-open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('is-open'); });
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    const items = visibleItems();
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightbox(items);
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    const items = visibleItems();
    currentIndex = (currentIndex + 1) % items.length;
    updateLightbox(items);
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('is-open');
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });

  /* ---------- i18n (fixed interface labels; editable texts live in content/) ---------- */
  const translations = {
    'nav.home': { pt: 'Início', en: 'Home' },
    'nav.about': { pt: 'Sobre Nós', en: 'About Us' },
    'nav.stay': { pt: 'O Alojamento', en: 'The Stay' },
    'nav.gallery': { pt: 'Galeria', en: 'Gallery' },
    'nav.location': { pt: 'Localização', en: 'Location' },
    'nav.contact': { pt: 'Contactos', en: 'Contact' },

    'hero.cta1': { pt: 'Conhecer o Alojamento', en: 'Discover the Stay' },
    'hero.cta2': { pt: 'Contactar', en: 'Get in Touch' },

    'about.eyebrow': { pt: 'Sobre Nós', en: 'About Us' },
    'about.hostLabel': { pt: 'Anfitrião', en: 'Host' },

    'stay.eyebrow': { pt: 'O Alojamento', en: 'The Stay' },

    'gallery.eyebrow': { pt: 'Galeria', en: 'Gallery' },
    'gallery.all': { pt: 'Todas', en: 'All' },
    'gallery.exterior': { pt: 'Exterior', en: 'Outdoors' },
    'gallery.interior': { pt: 'Interior', en: 'Indoors' },

    'location.eyebrow': { pt: 'Localização', en: 'Location' },

    'contact.eyebrow': { pt: 'Contactos', en: 'Contact' },
    'contact.phoneLabel': { pt: 'Telefone', en: 'Phone' },
    'contact.whatsappCta': { pt: 'Enviar mensagem', en: 'Send a message' },
    'contact.facebookCta': { pt: 'Visitar página', en: 'Visit page' },
    'contact.addressLabel': { pt: 'Morada', en: 'Address' },
  };

  const langToggle = document.getElementById('langToggle');
  const langOpts = langToggle.querySelectorAll('.lang-opt');

  const applyLang = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const entry = translations[key];
      if (entry && entry[lang] !== undefined) {
        el.innerHTML = entry[lang];
      }
    });
    if (content) renderLang(lang);
    langOpts.forEach(opt => opt.classList.toggle('is-active', opt.dataset.lang === lang));
    localStorage.setItem('moinho-lang', lang);
  };

  langToggle.addEventListener('click', () => {
    const current = document.documentElement.lang === 'en' ? 'en' : 'pt';
    applyLang(current === 'pt' ? 'en' : 'pt');
  });

  const savedLang = localStorage.getItem('moinho-lang') || 'pt';
  const contentReady = loadContent()
    .then(renderStatic)
    .catch(err => console.error('Erro ao carregar o conteúdo do site:', err))
    .finally(() => applyLang(savedLang));

  Promise.all([contentReady, pageLoaded]).then(() => {
    setTimeout(() => loader.classList.add('is-hidden'), 300);
  });

});
