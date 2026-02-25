(function () {

  const toggleBtn = document.getElementById("langToggle");
  let currentLang = "ja";

  function updateLanguage(lang) {
    const elements = document.querySelectorAll("[data-ja]");

    elements.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (!text) return;

      if (el.tagName.toLowerCase() === "title") {
        document.title = text;
      } else {
        el.textContent = text;
      }
    });

    document.documentElement.lang = lang;

    toggleBtn.textContent = lang === "ja"
      ? "Change ENG"
      : "日本語に変更";
  }

  toggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "ja" ? "en" : "ja";
    updateLanguage(currentLang);
  });

})();