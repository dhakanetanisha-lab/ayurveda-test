const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');

/* =====================================================
   HELPERS
===================================================== */

function loadYAML(file) {
  return yaml.load(fs.readFileSync(file, 'utf8'));
}

function loadReviews() {
  const file = './data/reviews.json';
  if (!fs.existsSync(file)) return { pending: [], approved: [] };

  const raw = fs.readFileSync(file, 'utf8').trim();
  return raw ? JSON.parse(raw) : { pending: [], approved: [] };
}

/* =====================================================
   BUILD PAGE (FINAL, CORRECT)
===================================================== */

function buildPage(data, pageTemplatePath, outputPath, title) {
  const layoutTemplatePath = './templates/layout.html';

  const layoutSource = fs.readFileSync(layoutTemplatePath, 'utf8');
  const pageSource = fs.readFileSync(pageTemplatePath, 'utf8');

  const layoutTemplate = Handlebars.compile(layoutSource);
  const pageTemplate = Handlebars.compile(pageSource);

  // render page body first
  const bodyHTML = pageTemplate(data);

  // inject body into layout
  const finalHTML = layoutTemplate({
    ...data,
    title,
    body: bodyHTML
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, finalHTML, 'utf8');

  console.log(`✔ Built: ${outputPath}`);
}

/* =====================================================
   LOAD GLOBAL DATA
===================================================== */

const layoutData = loadYAML('./content/layout.yml');
const reviews = loadReviews();

/* =====================================================
   HOMEPAGE
===================================================== */

const homepage = loadYAML('./content/homepage.yml');

homepage.testimonials ||= {};
homepage.testimonials.items = reviews.approved.map(r => ({
  message: r.message,
  name: r.name
}));

buildPage(
  {
    ...layoutData,
    ...homepage
  },
  './templates/homepage.html',
  './public/index.html',
  'Gangai Hospital'
);


/* =====================================================
   ABOUT US
===================================================== */

const aboutus = loadYAML('./content/aboutus.yml');

buildPage(
  {
    ...layoutData,
    ...aboutus
  },
  './templates/aboutus.html',
  './public/aboutus.html',
  'aboutus | Gangai Hospital'
);


/* =====================================================
   PRODUCTS
===================================================== */

const products = loadYAML('./content/products.yml');

buildPage(
  {
    ...layoutData,
    ...products
  },
  './templates/products.html',
  './public/products.html',
  'Products | Gangai Hospital'
);

/* =====================================================
   SERVICES
===================================================== */

const services = loadYAML('./content/services.yml');

buildPage(
  {
    ...layoutData,
    ...services
  },
  './templates/services.html',
  './public/services.html',
  'Services | Gangai Hospital'
);

/* =====================================================
   GALLERY
===================================================== */

const gallery = loadYAML('./content/gallery.yml');
gallery.images ||= [];

buildPage(
  {
    ...layoutData,
    ...gallery
  },
  './templates/gallery.html',
  './public/gallery.html',
  'Gallery | Gangai Hospital'
);


/* =====================================================
   VIDEOS
===================================================== */

const videos = loadYAML('./content/videos.yml');

buildPage(
  {
    ...layoutData,
    ...videos
  },
  './templates/videos.html',
  './public/videos.html',
  'videos | Gangai Hospital'
);

/* =====================================================
   panchakarma
===================================================== */

const panchakarma = loadYAML('./content/panchakarma.yml');

buildPage(
  {
    ...layoutData,
    ...panchakarma
  },
  './templates/panchakarma.html',
  './public/panchakarma.html',
  'panchakarma | Gangai Hospital'
);

console.log('✔ Build complete');
