const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');

/* ---------- HELPERS ---------- */

function loadYAML(file) {
  return yaml.load(fs.readFileSync(file, 'utf8'));
}

function loadReviews() {
  const file = './data/reviews.json';
  if (!fs.existsSync(file)) return { pending: [], approved: [] };

  const raw = fs.readFileSync(file, 'utf8').trim();
  return raw ? JSON.parse(raw) : { pending: [], approved: [] };
}

function buildPage(content, template, output, title) {
  const layout = fs.readFileSync('./templates/layout.html', 'utf8');
  const body = fs.readFileSync(template, 'utf8');

  const bodyHTML = Handlebars.compile(body)(content);
  const finalHTML = Handlebars.compile(layout)({
    title,
    body: bodyHTML,
    footer: content.footer
  });

  fs.writeFileSync(output, finalHTML, 'utf8');
}

/* ---------- REVIEWS ---------- */

const reviews = loadReviews();

/* ---------- HOMEPAGE ---------- */

const homepage = loadYAML('./content/homepage.yml');

homepage.testimonials ||= {};
homepage.testimonials.items = reviews.approved.map(r => ({
  message: r.message,
  name: r.name
}));

buildPage(
  homepage,
  './templates/homepage.html',
  './public/index.html',
  'Vishwaprakriti Ayurveda'
);

/* ---------- PRODUCTS ---------- */

const products = loadYAML('./content/products.yml');

buildPage(
  products,
  './templates/products.html',
  './public/products.html',
  'Products | Vishwaprakriti Ayurveda'
);

/* ---------- PRODUCTS ---------- */

const services = loadYAML('./content/services.yml');

buildPage(
  services,
  './templates/services.html',
  './public/services.html',
  'services | Vishwaprakriti Ayurveda'
);

/* ---------- GALLERY (FIXED) ---------- */
// -------- GALLERY --------
const gallery = loadYAML('./content/gallery.yml');

// normalize images if empty
gallery.images ||= [];

buildPage(
  gallery,
  './templates/gallery.html',
  './public/gallery.html',
  'Gallery | Vishwaprakriti Ayurveda'
);


console.log('✔ Build complete');
