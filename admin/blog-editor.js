let currentPage = "blog";

/* ===================== */
/* TABS */
/* ===================== */
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentPage = tab.dataset.page;
    loadContent();
  };
});

/* ===================== */
/* INIT TINYMCE */
/* ===================== */
tinymce.init({
  selector: "#editor",
  height: "70vh",
  menubar: false,
  plugins: [
    "lists", "link", "image", "code", "table", "wordcount"
  ],
  toolbar:
    "undo redo | styles | bold italic underline | " +
    "forecolor backcolor | fontfamily fontsize | " +
    "alignleft aligncenter alignright | " +
    "bullist numlist | link image | code",
  font_family_formats:
    "Inter=Inter;Poppins=Poppins;Roboto=Roboto;Arial=Arial;",
  content_style:
    "body { font-family: Inter; font-size:16px; }",
  setup(editor) {
    editor.on("init", loadContent);
  }
});

/* ===================== */
/* LOAD */
/* ===================== */
function loadContent() {
  fetch(`/content/${currentPage}.json`)
    .then(r => r.json())
    .then(d => {
      document.getElementById("title").value = d.title || "";
      tinymce.get("editor").setContent(d.html || "");
    })
    .catch(() => {
      document.getElementById("title").value = "";
      tinymce.get("editor").setContent("");
    });
}

/* ===================== */
/* SAVE */
/* ===================== */
function save() {
  fetch("/admin/save-article", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page: currentPage,
      title: document.getElementById("title").value,
      html: tinymce.get("editor").getContent()
    })
  })
  .then(r => r.text())
  .then(alert);
}
