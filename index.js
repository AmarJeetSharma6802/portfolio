const menu = document.querySelector(".hamburger-menu");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const darkModeBtn = document.getElementById("dark-mode-btn");

// Mobile menu
menu.addEventListener("click", () => {
  menu.classList.toggle("active");
  nav.classList.toggle("show");
});

// Theme: dark by default, click switches to light. Choice is remembered.
const themeIcon = darkModeBtn.querySelector("i");

const paintThemeButton = () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
  darkModeBtn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
};

paintThemeButton();

darkModeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
  paintThemeButton();
});

// Header gets a solid backdrop once the page scrolls
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

// wave text gsap — guarded, so a blocked CDN can't abort the rest of this file
if (window.gsap) {
  gsap.to(".wave-text span", {
    opacity: 1,
    y: 0,
    stagger: {
      amount: 2,
      from: "start",
      ease: "power1.inOut"
    },
    duration: function (index) {
      return 1 + (index * 0.1);
    },
    repeat: -1,
    yoyo: true
  });
} else {
  // Without GSAP the letters would stay at opacity 0
  document.querySelectorAll(".wave-text span").forEach(el => (el.style.opacity = "1"));
}

// Email links open Gmail's compose window (a plain mailto: does nothing without a
// desktop mail client), and the address is copied so it can be pasted anywhere.
const showToast = (message) => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
};

document.querySelectorAll(".email-link").forEach(link => {
  link.addEventListener("click", () => {
    const address = link.dataset.email;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address)
        .then(() => showToast("Email copied: " + address))
        .catch(() => showToast(address));
    } else {
      showToast(address);
    }
  });
});

// About tabs: Story / Stack / Experience / Proud work
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabButtons.forEach(b => b.classList.toggle("active", b === btn));
    tabPanels.forEach(p => p.classList.toggle("active", p.dataset.panel === target));
  });
});

// Nav underline: click plus scroll-spy
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-a");

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(item => item.classList.remove("active"));
      this.classList.add("active");
      nav.classList.remove("show");
      menu.classList.remove("active");
    });
  });

  const sections = [...document.querySelectorAll("section[id], div[id='home'], div[id='projects'], div[id='skills'], div[id='contact']")];

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(section => spy.observe(section));

  // Reveal cards as they scroll into view
  const revealTargets = document.querySelectorAll(".grid-box, .why-card, .stat-card, .img, .cta-item");
  revealTargets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
  });

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = "none";
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => reveal.observe(el));
});

// ============================== contact form ==============================

const FORM_ENDPOINT = "https://portfolio-data-five.vercel.app/portfolio/register";

const form = document.getElementById("form");

if (form) {
  const submitBtn = document.getElementById("submit");
  const statusEl = form.querySelector(".form-status");

  const rules = {
    nameId: value => value.trim().length >= 2 || "Please enter your name.",
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) || "Enter a valid email address.",
    phone: value => value.replace(/\D/g, "").length >= 7 || "Enter a valid phone number.",
    message: value => value.trim().length >= 10 || "Tell me a little more — at least 10 characters."
  };

  const setFieldState = (input) => {
    const field = input.closest(".field");
    const result = rules[input.id](input.value);
    const valid = result === true;
    field.classList.toggle("invalid", !valid);
    field.querySelector(".field-error").textContent = valid ? "" : result;
    return valid;
  };

  // Validate on blur, and live-correct once a field is already marked invalid
  Object.keys(rules).forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => setFieldState(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) setFieldState(input);
    });
  });

  const setStatus = (message, type) => {
    statusEl.textContent = message;
    statusEl.className = "form-status show " + type;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.className = "form-status";

    const inputs = Object.keys(rules).map(id => document.getElementById(id));
    const firstInvalid = inputs.filter(input => !setFieldState(input))[0];
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: document.getElementById("nameId").value.trim(),
          email: document.getElementById("email").value.trim(),
          phone: document.getElementById("phone").value.trim(),
          message: document.getElementById("message").value.trim()
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Request failed with status " + response.status);

      setStatus(data.message || "Thanks! Your message is on its way — I'll reply soon.", "success");
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("Couldn't send that right now. Please email me directly at amarsharma6802@gmail.com.", "error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
}
