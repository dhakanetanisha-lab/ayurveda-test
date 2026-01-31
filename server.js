const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');
const exphbs = require('express-handlebars');

const app = express();
app.use(express.json());

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/content', express.static(path.join(__dirname, 'content')));
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));

/* =========================
   HANDLEBARS
========================= */
const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    times(n, block) {
      let out = '';
      for (let i = 0; i < n; i++) out += block.fn(i);
      return out;
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

/* =========================
   BUILD
========================= */
function runBuild(res, msg) {
  exec('node build.js', err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Build failed');
    }
    res.send(msg);
  });
}

/* =========================
   SAVE YAML
========================= */
app.post('/admin/save', (req, res) => {
  const { page, yaml } = req.body;
  if (!page || !yaml) return res.status(400).send('Missing data');

  fs.writeFileSync(
    path.join(__dirname, 'content', `${page}.yml`),
    yaml,
    'utf8'
  );

  runBuild(res, 'Content saved & site rebuilt');
});

/* =========================
   REVIEWS
========================= */
const reviewsFile = path.join(__dirname, 'data', 'reviews.json');

if (!fs.existsSync(reviewsFile)) {
  fs.writeFileSync(
    reviewsFile,
    JSON.stringify({ pending: [], approved: [] }, null, 2)
  );
}

// user submits review
app.post('/api/reviews', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).send('Missing fields');

  const data = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
  data.pending.push({
    name,
    message,
    date: new Date().toISOString()
  });

  fs.writeFileSync(reviewsFile, JSON.stringify(data, null, 2));
  res.send('Review submitted for approval');
});

// admin fetch pending
app.get('/admin/pending-reviews', (req, res) => {
  const data = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
  res.json(data.pending);
});

// admin approve
app.post('/admin/approve-review', (req, res) => {
  const { index } = req.body;
  const data = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));

  if (!data.pending[index]) {
    return res.status(400).send('Invalid review index');
  }

  data.approved.push(data.pending.splice(index, 1)[0]);
  fs.writeFileSync(reviewsFile, JSON.stringify(data, null, 2));

  runBuild(res, 'Review approved & site rebuilt');
});

/* =========================
   IMAGE UPLOAD (✔ FIXED)
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/icons'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/admin/upload-image', upload.single('image'), (req, res) => {
  res.json({
    path: `icons/${req.file.filename}`
  });
});


/* =========================
   GALLERY IMAGE UPLOAD
========================= */
const galleryDir = path.join(__dirname, 'public/gallery');
const galleryYml = path.join(__dirname, 'content/gallery.yml');

if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });
if (!fs.existsSync(galleryYml)) {
  fs.writeFileSync(
    galleryYml,
    'title: Our Healing Gallery\nimages: []\n'
  );
}

const galleryStorage = multer.diskStorage({
  destination: galleryDir,
  filename: (_, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const galleryUpload = multer({ storage: galleryStorage });

app.post('/admin/upload-gallery', galleryUpload.single('image'), (req, res) => {
  const gallery = yaml.load(fs.readFileSync(galleryYml, 'utf8'));

  gallery.images.push(`gallery/${req.file.filename}`);

  fs.writeFileSync(galleryYml, yaml.dump(gallery));

  exec('node build.js');

  res.json({ success: true, path: `gallery/${req.file.filename}` });
});


/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
/*
app.listen(PORT, () => {
  console.log(`🌿 Site:  http://localhost:${PORT}/index.html`);
  console.log(`🛠 Admin: http://localhost:${PORT}/admin/editor.html`);
});*/


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌿 Site running on port ${PORT}`);
});


