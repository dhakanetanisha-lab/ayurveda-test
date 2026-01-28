const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');

const app = express();
app.use(express.json());

// ---------- STATIC ----------
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/content', express.static(path.join(__dirname, 'content')));
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));

// ---------- BUILD ----------
function runBuild(res, msg) {
  exec('node build.js', err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Build failed');
    }
    res.send(msg);
  });
}

// ---------- SAVE YAML ----------
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

// ---------- REVIEWS ----------
const reviewsFile = path.join(__dirname, 'data', 'reviews.json');

// init if missing
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

// ✅ ADMIN: fetch pending reviews
app.get('/admin/pending-reviews', (req, res) => {
  const data = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
  res.json(data.pending);
});

// admin approves review
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

// ---------- IMAGE UPLOAD ----------
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/icons'),
  filename: (_, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.post('/admin/upload-image', upload.single('image'), (req, res) => {
  res.json({ path: `icons/${req.file.filename}` });
});

// ---------- START ----------
/*app.listen(3000, () => {
  console.log('🌿 Site:  http://localhost:3000/index.html');
  console.log('🛠 Admin: http://localhost:3000/admin/editor.html');
});*/

const PORT = process.env.PORT || 3000;
app.listen(PORT);
