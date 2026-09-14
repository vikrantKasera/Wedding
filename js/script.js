document.addEventListener("DOMContentLoaded", () => {
  // Customize the date in one place. ISO format: YYYY-MM-DDTHH:MM:SS+05:30
  const WEDDING_DATE = "2027-02-23T18:00:00+05:30";

  const nav = document.getElementById("mainNav");
  const music = document.getElementById("weddingMusic");
  const musicBtn = document.getElementById("musicBtn");

  // Sticky navbar appearance.
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 35);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll reveal using IntersectionObserver.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Close Bootstrap mobile menu after navigation.
  document.querySelectorAll("#navMenu .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const menu = document.getElementById("navMenu");
      if (menu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Countdown timer.
  const updateCountdown = () => {
    const distance = new Date(WEDDING_DATE).getTime() - Date.now();
    if (distance <= 0) {
      ["days","hours","minutes","seconds"].forEach(id => document.getElementById(id).textContent = "0".padStart(id === "days" ? 3 : 2, "0"));
      document.getElementById("countdownMessage").textContent = "Today, our forever begins. ♥";
      return;
    }
    const d = Math.floor(distance / 86400000);
    const h = Math.floor((distance / 3600000) % 24);
    const m = Math.floor((distance / 60000) % 60);
    const s = Math.floor((distance / 1000) % 60);
    document.getElementById("days").textContent = String(d).padStart(3, "0");
    document.getElementById("hours").textContent = String(h).padStart(2, "0");
    document.getElementById("minutes").textContent = String(m).padStart(2, "0");
    document.getElementById("seconds").textContent = String(s).padStart(2, "0");
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Lightweight falling petals.
  const petals = document.getElementById("petals");
  const petalCount = window.matchMedia("(max-width: 600px)").matches ? 9 : 16;
  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    p.style.animationDuration = `${7 + Math.random() * 7}s`;
    p.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
    petals.appendChild(p);
  }

  // Gallery lightbox.
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.image;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  // RSVP demo.
  document.getElementById("rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("rsvpSuccess").classList.add("show");
    e.target.reset();
  });

  // Wishes demo with localStorage.
  const wishForm = document.getElementById("wishForm");
  const wishesList = document.getElementById("wishesList");
  const storageKey = "wedding-wishes";

  const renderWishes = () => {
    const wishes = JSON.parse(localStorage.getItem(storageKey) || "[]");
    wishesList.innerHTML = wishes.length
      ? wishes.slice().reverse().map(w => `<article class="wish-card"><h4>${escapeHtml(w.name)}</h4><p>${escapeHtml(w.message)}</p></article>`).join("")
      : `<div class="wish-empty">Your blessings will appear here. Be the first to leave one. ♥</div>`;
  };
  wishForm.addEventListener("submit", e => {
    e.preventDefault();
    const wishes = JSON.parse(localStorage.getItem(storageKey) || "[]");
    wishes.push({
      name: document.getElementById("wishName").value.trim(),
      message: document.getElementById("wishMessage").value.trim()
    });
    localStorage.setItem(storageKey, JSON.stringify(wishes));
    e.target.reset();
    renderWishes();
  });
  renderWishes();

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }


  
  // Optional music. Browsers generally require a user gesture.
  musicBtn.addEventListener("click", async () => {
    try {
      if (music.paused) {
        await music.play();
        musicBtn.classList.add("playing");
        musicBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        musicBtn.setAttribute("aria-label", "Pause wedding music");
      } else {
        music.pause();
        musicBtn.classList.remove("playing");
        musicBtn.innerHTML = '<i class="bi bi-music-note"></i>';
        musicBtn.setAttribute("aria-label", "Play wedding music");
      }
    } catch {
      musicBtn.title = "Add your wedding-song.mp3 file, then tap again.";
    }
  });

  document.onload = () => {
    console.log("document.onload");
    musicBtn.click();
  }
});
