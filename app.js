(function () {
  const data = Array.isArray(window.GALLERY_DATA) ? window.GALLERY_DATA : [];
  const root = document.getElementById("gallery");

  if (!root) return;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-content" role="document">
      <div class="modal-bar">
        <div class="modal-title" id="modalTitle"></div>
        <button class="modal-close" type="button" id="modalClose">閉じる</button>
      </div>
      <img class="modal-img" id="modalImg" alt="" />
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("#modalImg");
  const modalTitle = modal.querySelector("#modalTitle");
  const modalClose = modal.querySelector("#modalClose");

  function openModal(src, title) {
    modalImg.src = src;
    modalImg.alt = title || "";
    modalTitle.textContent = title || "";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  function makeGroup(group, idx) {
    const wrapper = document.createElement("article");
    wrapper.className = "group";
    wrapper.setAttribute("aria-expanded", "false");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "group-header";
    btn.setAttribute("aria-controls", `panel-${idx}`);
    btn.setAttribute("aria-expanded", "false");

    const metaText = `${group.items?.length ?? 0} 件`;

    btn.innerHTML = `
      <div class="group-title">
        <div class="name"></div>
        <div class="meta"></div>
      </div>
      <div class="chevron" aria-hidden="true"></div>
    `;
    btn.querySelector(".name").textContent = group.groupTitle ?? `Group ${idx + 1}`;
    btn.querySelector(".meta").textContent = metaText;

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.id = `panel-${idx}`;

    const inner = document.createElement("div");
    inner.className = "panel-inner";

    const grid = document.createElement("div");
    grid.className = "grid";

    const items = Array.isArray(group.items) ? group.items : [];
    for (const item of items) {
      const a = document.createElement("a");
      a.href = item.full || item.thumb || "#";
      a.className = "card";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(a.href, item.title || "");
      });

      const img = document.createElement("img");
      img.className = "thumb";
      img.loading = "lazy";
      img.src = item.thumb || item.full || "";
      img.alt = item.title || "";

      const cap = document.createElement("div");
      cap.className = "caption";

      const t = document.createElement("div");
      t.className = "title";
      t.textContent = item.title || "";

      const d = document.createElement("div");
      d.className = "desc";
      d.textContent = item.desc || "";

      cap.appendChild(t);
      cap.appendChild(d);

      a.appendChild(img);
      a.appendChild(cap);
      grid.appendChild(a);
    }

    inner.appendChild(grid);
    panel.appendChild(inner);

    function setExpanded(expanded) {
      wrapper.setAttribute("aria-expanded", String(expanded));
      btn.setAttribute("aria-expanded", String(expanded));
      if (expanded) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        panel.style.maxHeight = "0px";
      }
    }

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      setExpanded(!expanded);
    });

    window.addEventListener("resize", () => {
      if (btn.getAttribute("aria-expanded") === "true") {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(panel);
    return wrapper;
  }

  root.innerHTML = "";
  data.forEach((group, idx) => root.appendChild(makeGroup(group, idx)));
})();