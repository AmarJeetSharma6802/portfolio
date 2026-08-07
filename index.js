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

// wave text gsap
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

const clearForm = () => {
  document.getElementById("nameId").value = '';
  document.getElementById("email").value = '';
  document.getElementById("phone").value = '';
  document.getElementById("message").value = '';
};

const fetchData = async (name, email, phone, message) => {
  try {
    const response = await axios.post("https://portfolio-data-five.vercel.app/portfolio/register", {
      name,
      email,
      phone,
      message
    }, {
      withCredentials: true
    });

    alert(response.data.message);
    clearForm();
  } catch (error) {
    console.log("Error:", error);
    alert(error.response ? error.response.data.message : "An error occurred!");
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  const name = document.getElementById("nameId").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !phone || !message) {
    alert("Please fill in all fields.");
    return;
  }

  fetchData(name, email, phone, message);
};
