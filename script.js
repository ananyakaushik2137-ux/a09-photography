/* ============================================================
   A09 Photography — script.js
   Vanilla JavaScript: form validation, DOM updates, Local Storage
   Author: Ananya Kaushik | Roll: 2K26CSU01NN009
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Mobile nav toggle (shared on both pages)
     --------------------------------------------------------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    });
    // close menu when a link is clicked (mobile UX)
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "☰";
        }
      });
    });
  }

  /* ---------------------------------------------------------
     2. Gallery data (with descriptive alt text — Task 3 + Task 6)
     --------------------------------------------------------- */
  const galleryData = [
    { id: "w1", cat: "wedding",  img: "images/wedding-1.jpg",  title: "Varmala moment",
      desc: "Bride and groom exchange garlands during a daytime Hindu wedding ceremony in Delhi NCR." },
    { id: "w2", cat: "wedding",  img: "images/wedding-2.jpg",  title: "Bridal portrait",
      desc: "Close-up of a bride in red and gold, soft window light during the getting-ready session." },
    { id: "p1", cat: "portrait", img: "images/portrait-1.jpg", title: "Studio portrait",
      desc: "A young woman photographed under soft studio lighting against a charcoal backdrop." },
    { id: "p2", cat: "portrait", img: "images/portrait-2.jpg", title: "Golden-hour portrait",
      desc: "Outdoor portrait of a subject standing in warm late-afternoon sunlight." },
    { id: "e1", cat: "event",   img: "images/event-1.jpg",   title: "On stage",
      desc: "Performer silhouetted against stage lights at a live college-fest concert." },
    { id: "e2", cat: "event",   img: "images/event-2.jpg",   title: "Crowd energy",
      desc: "Audience with hands raised, swept in concert lighting during a music festival." },
    { id: "n1", cat: "nature",  img: "images/nature-1.jpg",  title: "Mountain valley",
      desc: "Layered mountain ridges glowing in golden-hour light, shot on a Himachal trek." },
    { id: "n2", cat: "nature",  img: "images/nature-2.jpg",  title: "River bend",
      desc: "A calm river meandering through a forested valley at sunrise." },
    { id: "s1", cat: "street",  img: "images/street-1.jpg",  title: "Old Delhi lane",
      desc: "Black-and-white street scene of vendors and pedestrians in an Old Delhi bazaar." },
    { id: "s2", cat: "street",  img: "images/street-2.jpg",  title: "Crossing",
      desc: "Monochrome street capture of commuters crossing a busy intersection at dusk." },
    { id: "h1", cat: "portrait", img: "images/hero-2.jpg",  title: "Behind the lens",
      desc: "The photographer holding her camera, captured during an outdoor portrait session." },
    { id: "h2", cat: "event",   img: "images/hero-1.jpg",   title: "At work",
      desc: "Silhouette of a photographer shooting against a warm golden-hour sky." }
  ];

  /* ---------------------------------------------------------
     3. Gallery rendering + filter + favourites (gallery.html)
     --------------------------------------------------------- */
  const grid = document.getElementById("galleryGrid");
  if (grid) {
    const STORAGE_KEY = "a09_favourites";
    let favourites = loadJSON(STORAGE_KEY, []);
    let currentFilter = "all";
    let showOnlyFav = false;

    function loadJSON(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    }
    function saveFavourites() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites)); } catch (e) {}
    }

    function render() {
      const list = galleryData.filter(function (item) {
        const matchCat = currentFilter === "all" || item.cat === currentFilter;
        const matchFav = !showOnlyFav || favourites.indexOf(item.id) > -1;
        return matchCat && matchFav;
      });

      grid.innerHTML = "";
      if (list.length === 0) {
        document.getElementById("emptyState").style.display = "block";
      } else {
        document.getElementById("emptyState").style.display = "none";
      }

      const heartSVG =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 21s-7-4.5-9.5-8.5C.5 9 2 5.5 5.5 5.5c2 0 3.5 1.5 4.5 3 1-1.5 2.5-3 4.5-3 3.5 0 5 3.5 3 7C19 16.5 12 21 12 21z"/></svg>';

      list.forEach(function (item) {
        const card = document.createElement("article");
        card.className = "gallery-card";
        card.setAttribute("data-id", item.id);

        const isFav = favourites.indexOf(item.id) > -1;
        card.innerHTML =
          '<div class="img-wrap">' +
            '<img src="' + item.img + '" alt="' + escapeHTML(item.desc) + '" loading="lazy" />' +
          '</div>' +
          '<span class="tag">' + item.cat + '</span>' +
          '<button type="button" class="fav-btn' + (isFav ? ' fav' : '') + '" ' +
            'aria-pressed="' + isFav + '" aria-label="Save ' + escapeHTML(item.title) + ' to favourites" data-id="' + item.id + '">' +
            heartSVG +
          '</button>' +
          '<div class="caption">' +
            '<h3>' + escapeHTML(item.title) + '</h3>' +
            '<p>' + escapeHTML(item.desc) + '</p>' +
          '</div>';
        grid.appendChild(card);
      });

      updateFavCount();
    }

    function escapeHTML(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function updateFavCount() {
      const el = document.getElementById("favNum");
      if (el) el.textContent = String(favourites.length);
    }

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        currentFilter = btn.getAttribute("data-filter");
        showOnlyFav = false;
        const showBtn = document.getElementById("showFav");
        if (showBtn) showBtn.textContent = "Show only favourites";
        render();
      });
    });

    // Favourite toggle via event delegation
    grid.addEventListener("click", function (e) {
      const btn = e.target.closest(".fav-btn");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const idx = favourites.indexOf(id);
      if (idx > -1) {
        favourites.splice(idx, 1);
      } else {
        favourites.push(id);
      }
      saveFavourites();
      render();
    });

    // Show only favourites
    const showFavBtn = document.getElementById("showFav");
    if (showFavBtn) {
      showFavBtn.addEventListener("click", function () {
        showOnlyFav = !showOnlyFav;
        showFavBtn.textContent = showOnlyFav ? "Show all photos" : "Show only favourites";
        render();
      });
    }

    // Clear favourites
    const clearFavBtn = document.getElementById("clearFav");
    if (clearFavBtn) {
      clearFavBtn.addEventListener("click", function () {
        if (favourites.length === 0) return;
        if (confirm("Remove all " + favourites.length + " favourite(s) saved on this device?")) {
          favourites = [];
          saveFavourites();
          showOnlyFav = false;
          if (showFavBtn) showFavBtn.textContent = "Show only favourites";
          render();
        }
      });
    }

    render();
  }

  /* ---------------------------------------------------------
     4. Booking form validation + Local Storage (index.html)
     --------------------------------------------------------- */
  const form = document.getElementById("bookingForm");
  if (form) {
    const statusEl = document.getElementById("formStatus");
    const budgetSlider = document.getElementById("budget");
    const budgetOut = document.getElementById("budgetOut");
    const dateField = document.getElementById("shootDate");

    // restrict date to today or later
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateField.setAttribute("min", yyyy + "-" + mm + "-" + dd);

    // live-update the budget output
    if (budgetSlider && budgetOut) {
      const fmt = new Intl.NumberFormat("en-IN");
      const updateBudget = function () {
        budgetOut.textContent = fmt.format(Number(budgetSlider.value));
      };
      budgetSlider.addEventListener("input", updateBudget);
      updateBudget();
    }

    // validators
    function setError(id, msg) {
      const field = document.getElementById(id);
      const errEl = document.getElementById("err-" + id);
      if (field) field.classList.toggle("invalid", !!msg);
      if (errEl) errEl.textContent = msg || "";
      return !msg;
    }

    function isEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    function isPhone(v) {
      // strip spaces/dashes/parens, allow + and 10-15 digits
      const digits = v.replace(/[^\d]/g, "");
      return digits.length >= 10 && digits.length <= 13;
    }

    function validate() {
      let ok = true;
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");
      const shootDate = document.getElementById("shootDate");
      const eventType = document.getElementById("eventType");
      const hours = document.getElementById("hours");
      const message = document.getElementById("message");
      const consent = document.getElementById("consent");
      const ref = document.getElementById("ref");

      ok &= setError("name", name.value.trim().length < 2 ? "Please enter your full name." : "");
      ok &= setError("email", !isEmail(email.value.trim()) ? "Please enter a valid email address." : "");
      ok &= setError("phone", !isPhone(phone.value.trim()) ? "Please enter a valid phone number (10–13 digits)." : "");

      const chosen = new Date(shootDate.value);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      ok &= setError("shootDate",
        !shootDate.value ? "Please pick a preferred date." :
        chosen < todayDate ? "Date can't be in the past." : "");

      ok &= setError("eventType", !eventType.value ? "Please choose a shoot type." : "");

      const h = parseInt(hours.value, 10);
      ok &= setError("hours", isNaN(h) || h < 1 || h > 16 ? "Hours must be between 1 and 16." : "");

      ok &= setError("message", message.value.trim().length < 15 ? "Please add a few more details (min 15 chars)." : "");

      if (ref.value.trim() && !/^https?:\/\/.+/i.test(ref.value.trim())) {
        ok &= setError("ref", "Reference link must start with http:// or https://");
      } else {
        setError("ref", "");
      }

      ok &= setError("consent", !consent.checked ? "Please accept the privacy notice to continue." : "");

      return !!ok;
    }

    // live validation on blur
    ["name", "email", "phone", "shootDate", "eventType", "hours", "message", "consent", "ref"].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      const evt = (el.type === "checkbox" || el.type === "select-one") ? "change" : "blur";
      el.addEventListener(evt, function () {
        // only clear errors on edit; full re-validate happens on submit
        if (el.value.trim() !== "" || el.checked) {
          const errEl = document.getElementById("err-" + id);
          if (errEl && errEl.textContent) errEl.textContent = "";
          el.classList.remove("invalid");
        }
      });
    });

    // ---- Local Storage: save + list past enquiries ----
    const INQ_KEY = "a09_inquiries";

    function loadInquiries() {
      try { return JSON.parse(localStorage.getItem(INQ_KEY)) || []; }
      catch (e) { return []; }
    }
    function saveInquiries(list) {
      try { localStorage.setItem(INQ_KEY, JSON.stringify(list)); } catch (e) {}
    }

    function fmtDate(iso) {
      if (!iso) return "";
      try {
        const d = new Date(iso + "T00:00:00");
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      } catch (e) { return iso; }
    }

    function renderInquiries() {
      const ul = document.getElementById("inquiriesList");
      if (!ul) return;
      const list = loadInquiries();
      if (list.length === 0) {
        ul.innerHTML = '<li class="empty">No enquiries yet — your submitted bookings will appear here.</li>';
        return;
      }
      const fmt = new Intl.NumberFormat("en-IN");
      ul.innerHTML = list.map(function (it, i) {
        return '<li>' +
          '<div>' +
            '<strong>' + escapeAttr(it.name) + '</strong> — ' + escapeAttr(it.eventType) +
            ' · ' + escapeAttr(fmtDate(it.shootDate)) +
            ' · ' + it.hours + 'h · ₹' + fmt.format(Number(it.budget)) +
          '</div>' +
          '<div class="meta">Saved ' + escapeAttr(it.savedAt) + '</div>' +
        '</li>';
      }).join("");
    }

    function escapeAttr(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    // ---- Submit ----
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const valid = validate();

      if (!valid) {
        statusEl.className = "form-status err show";
        statusEl.textContent = "Please fix the highlighted fields and try again.";
        // focus first invalid field
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // collect values
      const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        shootDate: document.getElementById("shootDate").value,
        eventType: document.getElementById("eventType").value,
        hours: parseInt(document.getElementById("hours").value, 10),
        budget: document.getElementById("budget").value,
        message: document.getElementById("message").value.trim(),
        savedAt: new Date().toLocaleString("en-IN")
      };

      const list = loadInquiries();
      list.unshift(data);
      // keep most recent 10
      if (list.length > 10) list.length = 10;
      saveInquiries(list);
      renderInquiries();

      statusEl.className = "form-status ok show";
      statusEl.textContent =
        "Thanks, " + data.name + "! Your enquiry for " + fmtDate(data.shootDate) +
        " has been saved on this device. I'll reply within 24 hours.";
      form.reset();
      if (budgetSlider && budgetOut) budgetOut.textContent = new Intl.NumberFormat("en-IN").format(35000);
      setTimeout(function () {
        statusEl.className = "form-status";
        statusEl.textContent = "";
      }, 8000);
    });

    // Clear saved enquiries
    const clearBtn = document.getElementById("clearInquiries");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        const list = loadInquiries();
        if (list.length === 0) return;
        if (confirm("Clear all " + list.length + " saved enquiry/enquiries on this device?")) {
          localStorage.removeItem(INQ_KEY);
          renderInquiries();
        }
      });
    }

    renderInquiries();
  }

  /* ---------------------------------------------------------
     5. Footer year (small DOM update nicety)
     --------------------------------------------------------- */
  document.querySelectorAll(".footer-bottom").forEach(function (el) {
    el.innerHTML = el.innerHTML.replace("© 2026", "© " + new Date().getFullYear());
  });

})();
