/* ===================== */
/* ACE EDITOR */
/* ===================== */
const aceEditor = ace.edit("editor");
aceEditor.setTheme("ace/theme/tomorrow_night");
aceEditor.session.setMode("ace/mode/yaml");
aceEditor.setOptions({
  fontSize: "13px",
  showPrintMargin: false,
  wrap: true
});

/* ===================== */
/* STATE */
/* ===================== */
let currentPage = "homepage";

const tabs = document.querySelectorAll(".tab");
const reviewsBox = document.getElementById("reviews");

/* ===================== */
/* TAB HANDLING */
/* ===================== */
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    currentPage = tab.dataset.page;
    loadPage();
    toggleSections();
  });
});

/* ===================== */
/* LOAD PAGE YAML */
/* ===================== */
function loadPage() {
  fetch(`/content/${currentPage}.yml`)
    .then(r => r.text())
    .then(t => aceEditor.setValue(t, -1));
}

/* ===================== */
/* SAVE */
/* ===================== */
function save() {
  fetch('/admin/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: currentPage,
      yaml: aceEditor.getValue()
    })
  })
  .then(r => r.text())
  .then(alert);
}

/* ===================== */
/* SECTION VISIBILITY */
/* ===================== */
function toggleSections() {
  document.getElementById("reviewsCard").style.display =
    currentPage === "homepage" ? "block" : "none";

  /* Upload Image: Homepage, Products, Services */
  document.getElementById("uploadCard").style.display =
    ["homepage", "products", "services"].includes(currentPage)
      ? "block"
      : "none";

  document.getElementById("galleryCard").style.display =
    currentPage === "gallery" ? "block" : "none";
}

/* ===================== */
/* REVIEWS */
/* ===================== */
function loadReviews() {
  fetch('/admin/pending-reviews')
    .then(r => r.json())
    .then(pending => {
      reviewsBox.innerHTML = '';

      if (!pending || pending.length === 0) {
        reviewsBox.innerText = 'No pending reviews';
        return;
      }

      pending.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'review-card';
        div.innerHTML = `
          <b>${r.name}</b><br>
          ${r.message}<br>
          <small>${r.date}</small><br>
          <button onclick="approve(${i})">Approve</button>
        `;
        reviewsBox.appendChild(div);
      });
    });
}

function approve(i) {
  fetch('/admin/approve-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: i })
  })
  .then(r => r.text())
  .then(() => loadReviews());
}

/* ===================== */
/* UPLOADS */
/* ===================== */
function uploadImage() {
  const f = document.getElementById('image').files[0];
  if (!f) return alert('Select image');

  const fd = new FormData();
  fd.append('image', f);

  fetch('/admin/upload-image', { method: 'POST', body: fd })
    .then(r => r.json())
    .then(r => {
      document.getElementById('result').innerText =
        'Uploaded. Use path: ' + r.path;
    });
}

function uploadGallery() {
  const f = document.getElementById('galleryImage').files[0];
  if (!f) return alert('Select image');

  const fd = new FormData();
  fd.append('image', f);

  fetch('/admin/upload-gallery', { method: 'POST', body: fd })
    .then(r => r.json())
    .then(r => {
      document.getElementById('galleryResult').innerText =
        'Added to gallery: ' + r.path;
    });
}

document.getElementById("fontSize").onchange = e => {
  aceEditor.setFontSize(e.target.value + "px");
};

document.getElementById("theme").onchange = e => {
  aceEditor.setTheme("ace/theme/" + e.target.value);
};

document.getElementById("fontFamily").onchange = e => {
  aceEditor.container.style.fontFamily = e.target.value;
};



function resizeEditor() {
  aceEditor.resize();
}


window.addEventListener("resize", resizeEditor);

/* ===================== */
/* INIT */
/* ===================== */
window.onload = () => {
  loadPage();
  loadReviews();
  toggleSections();
};
