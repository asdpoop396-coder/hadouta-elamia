/* =========================================================
   حدوتة إعلامية | مع نسمة عودة
   ملف التفاعلات (JavaScript بدون أي مكتبات)
   ========================================================= */

/* ---------------------------------------------------------
   ① الإعدادات القابلة للتعديل
   ضع روابط حساباتك والبريد الإلكتروني هنا.
   اترك القيمة فارغة "" إذا لم يكن الحساب جاهزًا بعد،
   وسيظهر الزر بعلامة «قريبًا» بدلًا من رابط وهمي.
   --------------------------------------------------------- */
const SITE_CONFIG = {
  email: "",        // مثال: "name@gmail.com"
  social: {
    facebook: "",   // مثال: "https://www.facebook.com/اسم-الصفحة"
    instagram: "",  // مثال: "https://www.instagram.com/اسم-الحساب"
    tiktok: "",     // مثال: "https://www.tiktok.com/@اسم-الحساب"
    youtube: ""     // مثال: "https://www.youtube.com/@اسم-القناة"
  }
};

(function () {
  "use strict";

  document.documentElement.classList.add("js");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ② بديل أنيق للصور المفقودة ---------- */
  function markMissing(img) {
    const holder = img.closest(".media");
    if (holder) holder.classList.add("is-missing");
  }
  function watchImage(img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) markMissing(img);
    img.addEventListener("error", () => markMissing(img));
  }
  document.querySelectorAll(".media img").forEach(watchImage);

  /* ---------- ③ الهيدر والقائمة ---------- */
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    toTop.classList.toggle("is-visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  }
  navToggle.addEventListener("click", () => setMenu(navToggle.getAttribute("aria-expanded") !== "true"));
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); navToggle.focus(); }
  });

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));

  /* ---------- ④ تمييز القسم الحالي في القائمة ---------- */
  // الأقسام التي ليس لها رابط في القائمة تُنسب لأقرب رابط
  const sectionToLink = {
    home: "home", about: "about", timeline: "about", stories: "stories",
    icons: "icons", pioneers: "pioneers", gallery: "gallery",
    evolution: "gallery", goals: "gallery", follow: "contact", contact: "contact"
  };
  function setActive(id) {
    const target = sectionToLink[id] || id;
    navLinks.forEach((a) => {
      const on = a.getAttribute("href") === "#" + target;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  }

  /* ---------- ⑤ الظهور التدريجي عند التمرير ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- ⑥ الخط الزمني التفاعلي ---------- */
  const tabs = Array.from(document.querySelectorAll(".timeline-stop"));
  function activateTab(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) { panel.hidden = !on; panel.classList.toggle("is-active", on); }
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activateTab(tab, false));
    tab.addEventListener("keydown", (e) => {
      // في الاتجاه من اليمين لليسار: السهم الأيسر = التالي
      let next = null;
      if (e.key === "ArrowLeft") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowRight") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activateTab(next, true); }
    });
  });

  /* ---------- ⑦ نافذة قراءة الحكايات والسير ---------- */
  const reader = document.getElementById("reader");
  const readerMedia = document.getElementById("readerMedia");
  const readerCat = document.getElementById("readerCat");
  const readerTitle = document.getElementById("readerTitle");
  const readerContent = document.getElementById("readerContent");
  let lastTrigger = null;

  function openStory(id, trigger) {
    const tpl = document.getElementById(id);
    if (!tpl || !reader) return;
    lastTrigger = trigger || null;

    readerTitle.textContent = tpl.dataset.title || "";
    readerCat.textContent = tpl.dataset.cat || "";
    readerCat.hidden = !tpl.dataset.cat;

    readerMedia.classList.remove("is-missing");
    readerMedia.innerHTML = "";
    if (tpl.dataset.image) {
      const img = document.createElement("img");
      img.src = tpl.dataset.image;
      img.alt = tpl.dataset.title || "";
      readerMedia.appendChild(img);
      readerMedia.hidden = false;
      watchImage(img);
    } else {
      readerMedia.hidden = true;
    }

    readerContent.innerHTML = "";
    readerContent.appendChild(tpl.content.cloneNode(true));

    if (typeof reader.showModal === "function") reader.showModal();
    else reader.setAttribute("open", "");
    reader.scrollTop = 0;
    document.body.style.overflow = "hidden";
  }
  function closeStory() {
    if (typeof reader.close === "function") reader.close();
    else reader.removeAttribute("open");
  }
  if (reader) {
    reader.addEventListener("close", () => {
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    });
    reader.addEventListener("click", (e) => {
      if (e.target === reader || e.target.closest("[data-close]")) closeStory();
    });
  }
  document.querySelectorAll("[data-story]").forEach((btn) => {
    btn.addEventListener("click", () => openStory(btn.dataset.story, btn));
  });

  /* ---------- ⑧ معرض الصور وعارض الصور ---------- */
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbCaption = document.getElementById("lbCaption");
  const lbCount = document.getElementById("lbCount");
  let current = 0;
  let lbTrigger = null;

  function showImage(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const img = item.querySelector("img");
    const caption = item.querySelector("figcaption");
    const swap = () => {
      lbImage.src = img.currentSrc || img.src;
      lbImage.alt = img.alt;
      lbCaption.textContent = caption ? caption.textContent : "";
      lbCount.textContent = (current + 1) + " / " + items.length;
      lbImage.classList.remove("is-fading");
    };
    if (prefersReducedMotion || lightbox.hidden) { swap(); return; }
    lbImage.classList.add("is-fading");
    setTimeout(swap, 220);
  }
  function openLightbox(index, trigger) {
    lbTrigger = trigger;
    lightbox.hidden = false;
    showImage(index);
    document.body.style.overflow = "hidden";
    lightbox.querySelector("[data-lb-close]").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lbTrigger) lbTrigger.focus();
  }

  items.forEach((item, i) => {
    const btn = item.querySelector(".gallery-btn");
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-missing")) return;
      openLightbox(i, btn);
    });
  });
  if (lightbox) {
    lightbox.querySelector("[data-lb-close]").addEventListener("click", closeLightbox);
    lightbox.querySelector("[data-lb-prev]").addEventListener("click", () => showImage(current - 1));
    lightbox.querySelector("[data-lb-next]").addEventListener("click", () => showImage(current + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      // RTL: السهم الأيسر = التالي
      if (e.key === "ArrowLeft") showImage(current + 1);
      if (e.key === "ArrowRight") showImage(current - 1);
      if (e.key === "Tab") {
        const focusables = Array.from(lightbox.querySelectorAll("button"));
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- ⑨ روابط التواصل الاجتماعي والبريد ---------- */
  document.querySelectorAll("[data-social]").forEach((a) => {
    const url = (SITE_CONFIG.social[a.dataset.social] || "").trim();
    if (url) {
      a.href = url;
    } else {
      a.removeAttribute("href");
      a.removeAttribute("target");
      a.classList.add("is-soon");
      a.setAttribute("aria-disabled", "true");
      a.title = "الحساب يُضاف قريبًا";
      if (!a.classList.contains("social-btn--icon")) {
        const tag = document.createElement("span");
        tag.className = "soon-tag";
        tag.textContent = "(قريبًا)";
        a.appendChild(tag);
      }
    }
  });

  const email = (SITE_CONFIG.email || "").trim();
  document.querySelectorAll("[data-email-link]").forEach((a) => {
    if (email) { a.href = "mailto:" + email; a.textContent = email; a.dir = "ltr"; }
    else { a.removeAttribute("href"); a.textContent = "يُضاف قريبًا"; }
  });

  /* ---------- ⑩ نموذج التواصل (يفتح برنامج البريد) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.classList.remove("is-error");
      let valid = true;
      form.querySelectorAll("input, textarea").forEach((field) => {
        const ok = field.checkValidity() && field.value.trim() !== "";
        field.closest(".field").classList.toggle("has-error", !ok);
        field.setAttribute("aria-invalid", String(!ok));
        if (!ok) valid = false;
      });
      if (!valid) {
        status.textContent = "من فضلك أكمل جميع الحقول ببيانات صحيحة.";
        status.classList.add("is-error");
        return;
      }
      if (!email) {
        status.textContent = "البريد الإلكتروني للمنصة لم يُضَف بعد. سيتم تفعيل التواصل قريبًا.";
        status.classList.add("is-error");
        return;
      }
      const data = new FormData(form);
      const subject = "رسالة من موقع حدوتة إعلامية — " + data.get("name");
      const body = data.get("message") + "\n\n—\n" + data.get("name") + "\n" + data.get("email");
      window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "تم فتح برنامج البريد لديك، اضغط «إرسال» من هناك لإتمام الرسالة.";
    });
  }
})();
