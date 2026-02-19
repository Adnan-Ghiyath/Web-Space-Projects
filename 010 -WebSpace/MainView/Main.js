function openPage(path) {
  window.open(path, "_blank");
}
function moon() {
  window.open("../logic(Element)/The Moon/Moon.html", "_blank");
}
function Atmosphere() {
  window.open("../logic(Element)/Earth’s Atmosphere/Atmosphere.html", "_blank");
}
function Earth() {
  window.open("../logic(Element)/Earth/Earth.html", "_blank");
}
function Asteroids() {
  window.open("../logic(Element)/Asteroids/Asteroids.html", "_blank");
}
function Gas_Giants() {
  window.open("../logic(Element)/GasGiants/Gas_Giants.html", "_blank");
}
function Nebulae() {
  window.open("../logic(Element)/Nebulae/Nebulae.html", "_blank");
}
function Black_Holes() {
  window.open("../logic(Element)/Black Holes/BlackHoles.html", "_blank");
}
function Supernovae() {
  window.open("../logic(Element)/Supernovae/Supernovae.html", "_blank");
}
function Stars() {
  window.open(
    "../logic(Element)/Supergiant Stars/SupergiantStars.html",
    "_blank"
  );
}
function Galaxies() {
  window.open("../logic(Element)/Galaxies/Galaxies.html", "_blank");
}
function Galaxy_Clusters() {
  window.open("../logic(Element)/GalaxyClusters/GalaxyClusters.html", "_blank");
}
function Cosmic_Web() {
  window.open("../logic(Element)/CosmicWeb/CosmicWeb.html", "_blank");
}
function The_Universe() {
  window.open("../logic(Element)/The Universe/Universe.html", "_blank");
}

// بيانات الأقسام مع إضافة حقل function
const sectionsData = [
  {
    id: "section1",
    title: "الغلاف الجوي الأرضي",
    description: "الجو الذي يحيط بنا هو ما نتنفسه ونعيش فيه",
    thumb:
      "../logic(Element)/Earth’s Atmosphere/Earth’s Atmosphere TEX/Atmospher.jpeg",
    function: "Atmosphere",
  },
  {
    id: "section2",
    title: "كوكب الأرض",
    description: "الكوكب الوحيد الصالح للحياة في نظامنا الشمسي",
    thumb: "../logic(Element)/Earth/EarthTextures/images.jpeg",
    function: "Earth",
  },
  {
    id: "section3",
    title: "القمر",
    description: "القمر الخاص بنا، ليس الوحيد لكنه الأكثر تميزًا",
    thumb: "../logic(Element)/The Moon/Moon TEX/Moon.jpeg",
    function: "moon",
  },
  {
    id: "section4",
    title: "النيازك والشهب",
    description: "صخور كونية رائعة تزين سماءنا ليلاً",
    thumb: "../logic(Element)/Asteroids/Asteroids TEX/Asteroids.jpeg",
    function: "Asteroids",
  },
  {
    id: "section5",
    title: "الكواكب الغازية",
    description: "أضخم وأكبر أنواع الكواكب في الكون",
    thumb: "../logic(Element)/GasGiants/Gas_GiantsTEX/jupatr.jpeg",
    function: "Gas_Giants",
  },
  {
    id: "section6",
    title: "السدم",
    description: "غيوم ضخمة من الغاز والغبار الكوني، منها تتولد النجوم",
    thumb: "../logic(Element)/Nebulae/NebulaeTEX/ESOnebul.jpeg",
    function: "Nebulae",
  },
  {
    id: "section7",
    title: "النجوم العملاقة",
    description: "أكبر النجوم حجماً في الكون",
    thumb: "../logic(Element)/Supergiant Stars/SupergiantStarsTEX/Staaar.jpeg",
    function: "Stars",
  },
  {
    id: "section8",
    title: "الثقوب السوداء",
    description: "نجوم ميتة عظيمة تمتص كل شيء حولها",
    thumb: "../logic(Element)/Black Holes/BlackHolesTEX/Blackhole.jpeg",
    function: "Black_Holes",
  },
  {
    id: "section9",
    title: "المستعرات العظمى",
    description: "انفجارات نجمية جبارة تُطلق طاقة هائلة",
    thumb: "../logic(Element)/Supernovae/SupernovaeTEX/Supernovae.jpeg",
    function: "Supernovae",
  },
  {
    id: "section10",
    title: "المجرات",
    description: "مدن كونية ضخمة تحتوي على مليارات النجوم",
    thumb: "../logic(Element)/Galaxies/GalaxiesTEX/Galaxies.jpeg",
    function: "Galaxies",
  },
  {
    id: "section11",
    title: "العناقيد المجرية",
    description: "مجموعات ضخمة من المجرات مرتبطة بالجاذبية",
    thumb: "../logic(Element)/GalaxyClusters/GalaxyClustersTEX/images.jpeg",
    function: "Galaxy_Clusters",
  },
  {
    id: "section12",
    title: "البنية الكونية العظمى",
    description: "شبكة هائلة من الخيوط الكونية تمتد لملايين السنين الضوئية",
    thumb: "../logic(Element)/CosmicWeb/CosmicWebTEX/CosmicWeb.jpeg",
    function: "Cosmic_Web",
  },
  {
    id: "section13",
    title: "الكون",
    description: "أكبر كيان موجود، يحتوي على كل شيء في الوجود",
    thumb: "../logic(Element)/The Universe/UniverseTEX/Universe.jpeg",
    function: "The_Universe",
  },
];

// توليد قائمة التنقل ديناميكياً
const railTop = document.querySelector(".rail-top");

sectionsData.forEach((section, index) => {
  const card = document.createElement("a");
  card.className = "card-link";
  card.href = "#"; // جعلها # فقط
  card.setAttribute("data-section", section.id);
  card.setAttribute("data-function", section.function); // إضافة خاصية الدالة

  card.innerHTML = `
    <div class="card-badge">${index + 1}</div>
    <img class="card-thumb" src="${section.thumb}" alt="${section.title}" 
         onerror="this.src='https://via.placeholder.com/280x140/1a2238/8b5cf6?text=${encodeURIComponent(
           section.title
         )}'">
    <div class="card-content">
        <h3 class="card-title">${section.title}</h3>
        <p class="card-description">${section.description}</p>
    </div>
  `;

  railTop.appendChild(card);
});

// كود إضافة الأحداث للبطاقات
function addCardEvents() {
  const cards = document.querySelectorAll(".card-link");

  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault(); // منع الانتقال للرابط

      const functionName = this.getAttribute("data-function");

      if (functionName && window[functionName]) {
        window[functionName](); // استدعاء الدالة
      }
    });
  });
}

// تنفيذ بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  // انتظر قليلاً لضمان تحميل البطاقات
  setTimeout(addCardEvents, 100);
});

// باقي الكود كما هو (التحكم في الـHeader، التمرير، إلخ)
const headerToggle = document.getElementById("headerToggle");
const mainHeader = document.getElementById("mainHeader");
const mainContent = document.getElementById("mainContent");
let isHeaderHidden = localStorage.getItem("headerHidden") === "true";

function updateHeaderState() {
  if (isHeaderHidden) {
    mainHeader.classList.add("hidden");
    mainContent.classList.add("header-hidden");
    headerToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
  } else {
    mainHeader.classList.remove("hidden");
    mainContent.classList.remove("header-hidden");
    headerToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
  }
}

updateHeaderState();

headerToggle.addEventListener("click", () => {
  isHeaderHidden = !isHeaderHidden;
  localStorage.setItem("headerHidden", isHeaderHidden);
  updateHeaderState();
});

// ... باقي الكود كما هو
// إخفاء زر التبديل عند التمرير لأسفل وإظهاره عند التمرير لأعلى
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // التمرير لأسفل
    headerToggle.classList.add("hidden");
  } else {
    // التمرير لأعلى
    headerToggle.classList.remove("hidden");
  }

  lastScrollTop = scrollTop;
});

// إضافة تأثير التنقل النشط
const navLinks = document.querySelectorAll(".card-link");
const sections = document.querySelectorAll(".section-container");

function setActiveLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 300) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === current) {
      link.classList.add("active");

      // تمرير العنصر النشط إلى منتصف الشاشة
      const rail = document.querySelector(".rail-top");
      const linkRect = link.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();

      if (linkRect.right > railRect.right || linkRect.left < railRect.left) {
        link.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  });
}

// دالة ملء الشاشة
function toggleFullscreen() {
  const elem = document.querySelector(".fsWrapper");
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// أحداث
window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

// تحديث الصور المفقودة
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".card-thumb");
  images.forEach((img) => {
    img.onerror = function () {
      this.src = `https://via.placeholder.com/280x140/1a2238/8b5cf6?text=${encodeURIComponent(
        this.alt
      )}`;
    };
  });
});

// تأثير عند التمرير على الهيدر
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.style.background = "rgba(10, 15, 28, 0.98)";
    header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.4)";
  } else {
    header.style.background = "rgba(10, 15, 28, 0.95)";
    header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.3)";
  }
});
