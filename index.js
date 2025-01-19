const menu = document.querySelector(".hamburger-menu");
const nav = document.querySelector(".nav");
const darkModeBtn = document.getElementById("dark-mode-btn");
const resumeBtn = document.querySelector(".resume-btn")
const resume = document.querySelector(".resume")
const closeBtn = document.querySelector(".close-btn")


// Toggle menu
menu.addEventListener("click", () => {
  menu.classList.toggle("active");
  nav.classList.toggle("show");
});

// Toggle dark mode
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// wave text  gsap

gsap.to(".wave-text span", {
  opacity: 1,
  y: 0,
  stagger: {
    amount: 2, // This controls how long it takes for the entire animation to complete
    from: "start",
    ease: "power1.inOut"
  },
  duration: function (index) {
   
    return 1 + (index * 0.1);  // Adjust the multiplier for different speeds
  },
  repeat: -1,   
  yoyo: true    
}); yo: true


resumeBtn.addEventListener("click", () => {
  resume.classList.add("active")
})
closeBtn.addEventListener("click", () => {
  resume.classList.remove("active")
})

   // Toggle About Me and Why Hire Me
   const aboutPara = document.querySelector(".about-para");
const aboutUl = document.querySelector(".about-ul");
const aboutMeBtn = document.querySelector(".me-btn");
const whyHireMeBtn = document.querySelector(".why");

function setActiveButton(button) {
const buttons = [aboutMeBtn, whyHireMeBtn];
buttons.forEach(btn => {
if (btn === button) {
  btn.classList.add('active');
} else {
  btn.classList.remove('active');
}
});
}

aboutMeBtn.addEventListener("click", () => {
  aboutPara.classList.add("active");
  aboutUl.classList.remove("active");
  setActiveButton(aboutMeBtn);
});

whyHireMeBtn.addEventListener("click", () => {
  aboutPara.classList.remove("active");
  aboutUl.classList.add("active");
  setActiveButton(whyHireMeBtn);
});
aboutMeBtn.addEventListener("click", () => {
aboutPara.classList.add("active"); 
aboutUl.classList.remove("active"); 
setActiveButton(aboutMeBtn); 
});

// nav-a underline controllers
document.addEventListener("DOMContentLoaded", () => {
const navLinks = document.querySelectorAll('.nav-a');

navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    // Remove 'active' class from all links
    navLinks.forEach(item => item.classList.remove('active'));

    // Add 'active' class to the clicked link
    this.classList.add('active');
    nav.classList.remove("show");
  menu.classList.remove("active");
  });
});
});



const clearForm = () => {
  document.getElementById("nameId").value = ''
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

// const response = await axios.post("http://localhost:9000/portfolio/register", 
