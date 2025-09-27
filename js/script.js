document.addEventListener("DOMContentLoaded", function () {
  // --- FUNGSI UNTUK MEMUAT KONTEN SECTION ---
  const loadSections = async () => {
    const sections = [
      { id: "tentang-container", path: "sections/tentang.html" },
      { id: "fasilitas-container", path: "sections/fasilitas.html" },
      { id: "galeri-container", path: "sections/galeri.html" },
      { id: "footer-container", path: "sections/footer.html" },
    ];

    const initializeSwiper = () => {
      // Referensi ke elemen teks
      const titleElement = document.getElementById("fasilitas-title");
      const descElement = document.getElementById("fasilitas-desc");

      const swiper = new Swiper(".fasilitas-image-slider .swiper", {
        effect: "coverflow", // Mengaktifkan efek coverflow
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto", // Menentukan jumlah slide berdasarkan CSS
        loop: false, // Agar slide bisa berputar

        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: false, // Matikan bayangan jika tidak suka
        },

        navigation: {
          nextEl: ".fasilitas-image-slider .swiper-button-next",
          prevEl: ".fasilitas-image-slider .swiper-button-prev",
        },

        // EVENT LISTENER: Dijalankan setiap kali ada perubahan
        on: {
          // Dijalankan saat Swiper pertama kali dimuat
          init: function () {
            updateText(this);
          },
          // Dijalankan setiap kali slide berganti
          slideChange: function () {
            updateText(this);
          },
        },
      });

      // Fungsi untuk memperbarui teks
      function updateText(swiperInstance) {
        if (!titleElement || !descElement) return;

        // Ambil slide yang sedang aktif
        const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
        const activeImg = activeSlide.querySelector("img");

        // Ambil data dari atribut data-*
        const title = activeImg.getAttribute("data-title");
        const description = activeImg.getAttribute("data-description");

        // Perbarui konten teks di kolom kiri
        titleElement.textContent = title;
        descElement.textContent = description;
      }
    };

    for (const section of sections) {
      try {
        const response = await fetch(section.path);
        if (!response.ok) throw new Error(`Gagal memuat ${section.path}`);
        const html = await response.text();
        const container = document.getElementById(section.id);
        if (container) {
          container.innerHTML = html;
        }
      } catch (error) {
        console.error("Error loading section:", error);
        const container = document.getElementById(section.id);
        if (container) {
          container.innerHTML = `<p style="text-align:center; color:red;">Gagal memuat bagian ini.</p>`;
        }
      }
    }

    initializeSwiper();
  };

  // --- FUNGSI UNTUK SMOOTH SCROLL ---
  const setupSmoothScroll = () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  };

  // --- FUNGSI UNTUK NAVBAR TRANSPARENT/SOLID SAAT SCROLL ---
  const setupNavbarScroll = () => {
    const navbar = document.querySelector("nav");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  };

  const setupMobileMenu = () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li");

    hamburger.addEventListener("click", () => {
      // Buka/tutup menu
      navLinks.classList.toggle("nav-active");

      // Animasi untuk setiap item menu
      links.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
      });

      // Animasi ikon hamburger menjadi 'X'
      hamburger.classList.toggle("toggle");
    });
  };

  // --- JALANKAN SEMUA FUNGSI ---
  loadSections();
  setupSmoothScroll();
  setupNavbarScroll();
  setupMobileMenu();
});
