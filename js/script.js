document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 300);
  });

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

  /* ---------- Gallery data ---------- */
  const exteriorCount = 12;
  const interiorCount = 14;
  const layoutHints = ['wide', '', '', 'tall', '', '', 'wide', '', '', 'tall', '', '', '', ''];

  const images = [];
  for (let i = 1; i <= interiorCount; i++) {
    const n = String(i).padStart(3, '0');
    images.push({ src: `fotos/fotos_interior/interior_${n}.jpg`, cat: 'interior' });
  }
  for (let i = 1; i <= exteriorCount; i++) {
    const n = String(i).padStart(3, '0');
    images.push({ src: `fotos/fotos_exterior/exterior_${n}.jpg`, cat: 'exterior' });
  }

  const grid = document.getElementById('galleryGrid');
  images.forEach((img, idx) => {
    const div = document.createElement('div');
    const hint = layoutHints[idx % layoutHints.length];
    div.className = `gallery-item${hint ? ' ' + hint : ''}`;
    div.dataset.cat = img.cat;
    div.dataset.index = idx;
    div.innerHTML = `<img src="${img.src}" alt="Casa do Moinho da Ínsua" loading="lazy">`;
    grid.appendChild(div);
  });

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

  /* ---------- i18n ---------- */
  const translations = {
    'nav.home': { pt: 'Início', en: 'Home' },
    'nav.about': { pt: 'Sobre Nós', en: 'About Us' },
    'nav.stay': { pt: 'O Alojamento', en: 'The Stay' },
    'nav.gallery': { pt: 'Galeria', en: 'Gallery' },
    'nav.location': { pt: 'Localização', en: 'Location' },
    'nav.contact': { pt: 'Contactos', en: 'Contact' },

    'hero.eyebrow': { pt: 'Alojamento Local · Várzea Cova', en: 'Local Accommodation · Várzea Cova' },
    'hero.subtitle': { pt: 'Um antigo moinho junto ao rio, em plena floresta de carvalhos — natureza, silêncio e um céu cheio de estrelas.', en: 'An old mill by the river, deep in an oak forest — nature, silence and a sky full of stars.' },
    'hero.cta1': { pt: 'Conhecer o Alojamento', en: 'Discover the Stay' },
    'hero.cta2': { pt: 'Contactar', en: 'Get in Touch' },

    'strip.river': { pt: 'Junto ao rio', en: 'By the river' },
    'strip.stars': { pt: 'Céu de estrelas', en: 'Starry skies' },
    'strip.privacy': { pt: 'Privacidade total', en: 'Total privacy' },
    'strip.nature': { pt: 'Reserva natural', en: 'Nature reserve' },

    'about.eyebrow': { pt: 'Sobre Nós', en: 'About Us' },
    'about.title': { pt: 'Uma experiência única em plena natureza', en: 'A truly unique nature experience' },
    'about.p1': { pt: 'A propriedade situa-se em plena floresta de carvalhos — um dos maiores da Península Ibérica, classificada como reserva agrícola e natural — atravessada por um rio que serpenteia pelo terreno. Duas levadas e um antigo moinho completam a paisagem, num espaço de total privacidade em meio à mata.', en: 'The estate sits amid one of the largest oak forests on the Iberian Peninsula — an area designated as an agricultural and nature reserve — crossed by a river that winds through the grounds. Two weirs and an old mill complete the scenery, offering total privacy amidst lush woodlands.' },
    'about.p2': { pt: 'Longe das povoações vizinhas, o local distingue-se pela sua privacidade e tranquilidade excecionais. O microclima fresco do carvalhal contrasta agradavelmente com o calor do verão e, graças à reduzida poluição luminosa, o céu noturno revela um panorama raro e espetacular de estrelas.', en: 'Located away from nearby villages, the property is defined by exceptional privacy and tranquility. The cool climate within the oak forest offers a refreshing contrast to the summer heat, and thanks to minimal light pollution, the night sky reveals a rare and spectacular panorama of stars.' },
    'about.note': { pt: 'Nota: devido à existência de socalcos e à proximidade do rio, recomenda-se especial atenção com crianças pequenas. Para uma estadia tranquila, aconselhamos que os hóspedes tenham, no mínimo, 12 anos.', en: 'Please note: due to the terraces and the nearby river, extreme caution is advised with small children. For a peaceful stay, we recommend guests be at least 12 years of age.' },
    'about.hostLabel': { pt: 'Anfitrião', en: 'Host' },
    'about.langs': { pt: 'Fala Português, Inglês, Espanhol, Francês e Italiano', en: 'Speaks Portuguese, English, Spanish, French and Italian' },

    'stay.eyebrow': { pt: 'O Alojamento', en: 'The Stay' },
    'stay.title': { pt: 'Um chalé acolhedor, recentemente renovado', en: 'A cosy, recently renovated chalet' },
    'stay.lead': { pt: 'Com terraço e vista para a montanha, o chalé dispõe de 2 quartos, sala de estar, cozinha totalmente equipada e casa de banho privativa — tudo pensado para um retiro confortável em plena natureza.', en: 'With a terrace and mountain view, the chalet features 2 bedrooms, a living room, a fully equipped kitchen and a private bathroom — everything you need for a comfortable retreat in nature.' },

    'am.rooms': { pt: '2 quartos & sala de estar', en: '2 bedrooms & living room' },
    'am.kitchen': { pt: 'Cozinha totalmente equipada', en: 'Fully equipped kitchen' },
    'am.bathroom': { pt: 'Casa de banho privativa', en: 'Private bathroom' },
    'am.tv': { pt: 'TV & streaming', en: 'TV & streaming' },
    'am.wifi': { pt: 'WiFi gratuito', en: 'Free WiFi' },
    'am.parking': { pt: 'Estacionamento privado gratuito', en: 'Free private parking' },
    'am.ac': { pt: 'Ar condicionado & aquecimento', en: 'Air conditioning & heating' },
    'am.terrace': { pt: 'Terraço & vista montanha', en: 'Terrace & mountain view' },
    'am.bbq': { pt: 'Churrasqueira', en: 'BBQ Area' },
    'am.river': { pt: 'Vista rio & jardim', en: 'River view & garden' },

    'rules.checkinLabel': { pt: 'Check-in', en: 'Check-in' },
    'rules.checkoutLabel': { pt: 'Check-out', en: 'Check-out' },
    'rules.checkoutValue': { pt: 'até às 11:00', en: 'until 11:00 AM' },
    'rules.smokingLabel': { pt: 'Fumar / Festas', en: 'Smoking / Parties' },
    'rules.smokingValue': { pt: 'Não permitido', en: 'Not allowed' },

    'gallery.eyebrow': { pt: 'Galeria', en: 'Gallery' },
    'gallery.title': { pt: 'O espaço, por dentro e por fora', en: 'The space, inside and out' },
    'gallery.all': { pt: 'Todas', en: 'All' },
    'gallery.exterior': { pt: 'Exterior', en: 'Outdoors' },
    'gallery.interior': { pt: 'Interior', en: 'Indoors' },

    'location.eyebrow': { pt: 'Localização', en: 'Location' },
    'location.title': { pt: 'Várzea Cova, Portugal', en: 'Várzea Cova, Portugal' },
    'location.lead': { pt: 'Escondida na floresta, mas a uma curta distância de pontos de interesse na região do Minho.', en: 'Tucked away in the forest, yet within easy reach of local landmarks in the Minho region.' },
    'location.n1': { pt: 'Castelo de Guimarães', en: 'Guimarães Castle' },
    'location.n2': { pt: 'Paço dos Duques de Bragança', en: 'Palace of the Dukes of Bragança' },
    'location.n3': { pt: 'Aeroporto Francisco Sá Carneiro', en: 'Francisco Sá Carneiro Airport' },

    'contact.eyebrow': { pt: 'Contactos', en: 'Contact' },
    'contact.title': { pt: 'Vamos planear a sua estadia', en: "Let's plan your stay" },
    'contact.lead': { pt: 'Entre em contacto diretamente com o anfitrião para saber mais sobre o alojamento.', en: 'Reach out directly to the host to learn more about the accommodation.' },
    'contact.phoneLabel': { pt: 'Telefone', en: 'Phone' },
    'contact.whatsappCta': { pt: 'Enviar mensagem', en: 'Send a message' },
    'contact.addressLabel': { pt: 'Morada', en: 'Address' },

    'footer.tagline': { pt: 'Um refúgio junto ao rio, no coração do carvalhal.', en: 'A riverside refuge in the heart of the oak forest.' },
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
    langOpts.forEach(opt => opt.classList.toggle('is-active', opt.dataset.lang === lang));
    localStorage.setItem('moinho-lang', lang);
  };

  langToggle.addEventListener('click', () => {
    const current = document.documentElement.lang === 'en' ? 'en' : 'pt';
    applyLang(current === 'pt' ? 'en' : 'pt');
  });

  const savedLang = localStorage.getItem('moinho-lang') || 'pt';
  applyLang(savedLang);

});
