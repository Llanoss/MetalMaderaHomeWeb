/* ===============================================================================
                         GLOBAL JS
==================================================================================*/

/* ===== HEADER SE ADELGAZA AL BAJAR ===== */

document.addEventListener("DOMContentLoaded", () => {
    let lastScroll = 0;
    const header = document.getElementById('siteHeader');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 80) {
            // Bajando → se adelgaza
            header.classList.add('shrink');
        } else {
            // Subiendo → vuelve normal
            header.classList.remove('shrink');
        }

        lastScroll = currentScroll;
    });

    /* ===== MENÚ LATERAL ===== */
    const menuToggle = document.getElementById("menuToggle");
    const sideMenu = document.getElementById("sideMenu");
    const collectionsMenu = document.getElementById("collectionsMenu");
    const overlay = document.getElementById("overlay");

    menuToggle.addEventListener("click", () => {
        sideMenu.classList.add("show");
        overlay.classList.add("show");
    });

    document.getElementById("openCollections").addEventListener("click", () => {
        collectionsMenu.classList.add("show");
        overlay.classList.add("show"); 
    });

    document.getElementById("closeMainMenu").addEventListener("click", () => {
        sideMenu.classList.remove("show");
        collectionsMenu.classList.remove("show"); 
        overlay.classList.remove("show");
    });

    document.getElementById("closeCollections").addEventListener("click", () => {
        collectionsMenu.classList.remove("show");
        overlay.classList.remove("show"); // 
    });

    overlay.addEventListener("click", () => {
        sideMenu.classList.remove("show");
        collectionsMenu.classList.remove("show");
        overlay.classList.remove("show");
    });
});

 /* ===== CARRRUSEL FLUIDO ===== */

const sliders = document.querySelectorAll('.categories-carousel');

/* Solo en pantallas táctiles */
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {

  sliders.forEach(slider => {
    let isDown = false;
    let startX, scrollLeft;
    let velocity = 0;
    let lastX, lastTime;
    let raf;

    slider.addEventListener('touchstart', e => {
      isDown = true;
      startX = e.touches[0].pageX;
      scrollLeft = slider.scrollLeft;
      lastX = startX;
      lastTime = Date.now();
      cancelAnimationFrame(raf);
    });

    slider.addEventListener('touchmove', e => {
      if (!isDown) return;
      const x = e.touches[0].pageX;
      slider.scrollLeft = scrollLeft - (x - startX);

      const now = Date.now();
      velocity = (x - lastX) / (now - lastTime);
      lastX = x;
      lastTime = now;
    });

    slider.addEventListener('touchend', () => {
      if (!isDown) return;
      isDown = false;
      applyMomentum();
    });

    function applyMomentum() {
      let v = velocity * 40;
      function step() {
        if (Math.abs(v) < 0.1) return;
        slider.scrollLeft -= v;
        v *= 0.94;
        raf = requestAnimationFrame(step);
      }
      step();
    }
  });
}

window.addEventListener("load", () => {
    const footer = document.querySelector(".footer");
    if (footer) {
        footer.style.opacity = "1";
        footer.style.visibility = "visible";
    }
});

/* ===============================================================================
                         INICIO JS
==================================================================================*/

/* ===== CARRUSELES ARRASTRABLES CON DIFUMINADOS E INDICADOR ===== */
const DRAG_LIMIT = 5;

// Tomamos todos los carruseles de la página
document.querySelectorAll(".categories-carousel").forEach((carousel) => {
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let hasMoved = false;

    // Detectar difuminados e indicador dentro del mismo wrapper
    const wrapper = carousel.parentElement;
    const fadeLeft = wrapper.querySelector(".fade-left");
    const fadeRight = wrapper.querySelector(".fade-right");
    const indicator = wrapper.querySelector(".indicator-thumb");

    /* ----- Drag con mouse ----- */
    carousel.addEventListener("mousedown", (e) => {
        isDragging = true;
        hasMoved = false;
        startX = e.pageX;
        scrollStart = carousel.scrollLeft;
        carousel.classList.add("dragging");
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const distance = e.pageX - startX;
        if (Math.abs(distance) > DRAG_LIMIT) hasMoved = true;
        carousel.scrollLeft = scrollStart - distance;
        updateUI();
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            carousel.classList.remove("dragging");
        }
    });

    /* ----- Drag con touch (móvil/tablet) ----- */
    let touchStartX = 0;
    let touchScrollStart = 0;

    carousel.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollStart = carousel.scrollLeft;
    });

    carousel.addEventListener("touchmove", (e) => {
        const distance = e.touches[0].pageX - touchStartX;
        carousel.scrollLeft = touchScrollStart - distance;
        updateUI();
    });

    /* ----- Cancelar clicks si hubo drag ----- */
    carousel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });

    /* ----- Actualizar difuminados e indicador ----- */
    function updateUI() {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const scroll = carousel.scrollLeft;
        const progress = maxScroll > 0 ? scroll / maxScroll : 0;

        if (indicator) {
            const track = indicator.parentElement.clientWidth;
            const thumb = indicator.clientWidth;
            indicator.style.transform = `translateX(${progress * (track - thumb)}px)`;
        }

        if (fadeLeft) fadeLeft.style.opacity = scroll > 10 ? "1" : "0";
        if (fadeRight) fadeRight.style.opacity = scroll < maxScroll - 10 ? "1" : "0";
    }

    /* ----- Actualizar al hacer scroll y al cargar ----- */
    carousel.addEventListener("scroll", updateUI);
    window.addEventListener("load", updateUI);
});

/* ----- SECCION DE PREGUNTAS ----- */
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            // Toggle clase abierta
            item.classList.toggle("open");


        });
    });
});


/* ===============================================================================
                         NOSOTROS JS
==================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  if (!slides.length) return;

  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  nextBtn.addEventListener("click", () => {
    let next = currentIndex + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  });

  prevBtn.addEventListener("click", () => {
    let prev = currentIndex - 1;
    if (prev < 0) prev = slides.length - 1;
    showSlide(prev);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  showSlide(0);
});


/* ===============================================================================
                         PRODUCTO JS
==================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.querySelector(".main-image");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  let currentIndex = 0;

  // Cambiar imagen al dar click en miniatura
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      currentIndex = index;
      mainImage.src = thumb.src;
      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  // Abrir modal al dar click en imagen principal
  mainImage.addEventListener("click", () => {
    modal.style.display = "flex"; // se muestra solo al hacer click
    modalImg.src = mainImage.src;
  });

  // Cerrar modal al tocar fuera de la imagen
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Swipe para móvil (opcional)
  let startX = 0;
  mainImage.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  mainImage.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 40) {
      currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    } else if (startX - endX > 40) {
      currentIndex = (currentIndex + 1) % thumbnails.length;
    } else {
      return;
    }
    mainImage.src = thumbnails[currentIndex].src;
    thumbnails.forEach(t => t.classList.remove("active"));
    thumbnails[currentIndex].classList.add("active");
  });
});

/* ===============================================================================
                         SILLAS Y BANCAS JS (PRODUCTOS)
==================================================================================*/

const productos = {
  "silla-bruma": {
    nombre: "SILLA BRUMA",
    precio: "$229.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla01.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla01_.avif",
    desc1: "La silla Bruma mezcla metal resistente y madera natural en un diseño moderno y elegante. Ideal para comedores, barras o espacios que buscan estilo y durabilidad.",
    desc2: "Con 70 cm de alto y 30 cm de base, es compacta y funcional. Perfecta para aprovechar el espacio sin perder comodidad.",
  },

  "silla-alamo": {
    nombre: "SILLA ALAMO",
    precio: "$189.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla02.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla02_.avif",
    desc1: "Silla Alamo, elegante y funcional, diseñada para brindar comodidad y estilo en cualquier espacio.",
    desc2: "Con 70 cm de alto y 30 cm de base, sus proporciones la hacen ideal para uso diario y ambientes modernos.",
  },

  "silla-encanto": {
    nombre: "SILLA ENCANTO",
    precio: "$229.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla03.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla03_.avif",
    desc1: "Silla Encanto, moderna y cómoda, pensada para aportar estilo y funcionalidad.",
    desc2: "Con 45 cm de alto y 30 cm de base, ideal para espacios reducidos."
  },

"silla-faro": {
    nombre: "SILLA FARO",
    precio: "$249.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla04.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla04_.avif",
    desc1: "Silla Faro, práctica y con diseño atractivo, ideal para complementar cualquier espacio con estilo.",
    desc2: "Con 45 cm de alto y 30 cm de base, su tamaño compacto la hace cómoda y fácil de integrar."
  },

  "silla-forja": {
    nombre: "SILLA FORJA",
    precio: "$279.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla05.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla05_.avif",
    desc1: "Silla Forja, fuerte y elegante, pensada para dar carácter a cualquier espacio con un estilo moderno e industrial.",
    desc2: "Con 45 cm de alto y 30 cm de base, es compacta, cómoda y perfecta para uso diario."
  },

  "silla-ebano": {
    nombre: "SILLA EBANO",
    precio: "$249.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla06.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla06_.avif",
    desc1: "Silla Ébano, sobria y moderna, diseñada para aportar elegancia y resistencia a cualquier ambiente.",
    desc2: "Con 45 cm de alto y 30 cm de base, es práctica, compacta y fácil de ubicar en espacios pequeños."
  },

  "silla-encina": {
    nombre: "SILLA ENCINA",
    precio: "$259.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla07.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla07_.avif",
    desc1: "Silla Encina, de estilo cálido y natural, ideal para crear ambientes acogedores y modernos.",
    desc2: "Con 45 cm de alto y 30 cm de base, es compacta, funcional y perfecta para optimizar el espacio."
  },

  "silla-nido": {
    nombre: "SILLA NIDO",
    precio: "$209.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla08.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla08_.avif",
    desc1: "Silla Nido, con diseño moderno y resistente, perfecta para dar carácter y estilo a cualquier espacio.",
    desc2: "Con 70 cm de alto y 30 cm de base, ofrece una estructura firme y un tamaño ideal para uso diario."
  },

  "silla-alba": {
    nombre: "SILLA ALBA",
    precio: "$189.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla09.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla09_.avif",
    desc1: "Silla Alba, elegante y funcional, diseñada para aportar comodidad y estilo a cualquier ambiente.",
    desc2: "Con 70 cm de alto y 30 cm de base, combina robustez y proporciones ideales para uso diario."
  },

  "silla-vivo": {
    nombre: "SILLA VIVO",
    precio: "$249.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla10.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla10_.avif",
    desc1: "Silla Vivo, diseñada para ofrecer comodidad y estilo en cualquier espacio de tu hogar u oficina. Su línea moderna aporta elegancia sin perder funcionalidad.",
    desc2: "Mide 70 cm de alto y 30 cm de base, perfecta para espacios versátiles y prácticos."
  },

  "silla-rustica": {
    nombre: "SILLA RUSTICA",
    precio: "$99.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla11.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla11_.avif",
    desc1: "Silla Rústica, combina un diseño tradicional con comodidad, ideal para aportar calidez y estilo a cualquier espacio. Su estructura robusta garantiza durabilidad y elegancia.",
    desc2: "Mide 70 cm de alto y 30 cm de base, perfecta para integrarse en diferentes ambientes sin ocupar demasiado espacio."
  },

  "silla-ancla": {
    nombre: "SILLA ANCLA",
    precio: "$249.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla12.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla12_.avif",
    desc1: "Silla Rústica, combina un diseño tradicional con comodidad, ideal para aportar calidez y estilo a cualquier espacio. Su estructura robusta garantiza durabilidad y elegancia.",
    desc2: "Mide 70 cm de alto y 30 cm de base, perfecta para integrarse en diferentes ambientes sin ocupar demasiado espacio."
  },

  "silla-trebol": {
    nombre: "SILLA TREBOL",
    precio: "$149.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla13.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla13_.avif",
    desc1: "Silla Rústica, combina un diseño tradicional con comodidad, ideal para aportar calidez y estilo a cualquier espacio. Su estructura robusta garantiza durabilidad y elegancia.",
    desc2: "Mide 70 cm de alto y 30 cm de base, perfecta para integrarse en diferentes ambientes sin ocupar demasiado espacio."
  },

  "silla-sendero": {
    nombre: "SILLA SENDERO",
    precio: "$279.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla14.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla14_.avif",
    desc1: "Silla Sendero, combina un diseño sencillo con un estilo natural que se adapta fácil a cualquier ambiente.",
    desc2: "Sus medidas son 70 de alto x 30 de base, ideales para brindar comodidad sin ocupar mucho espacio."
  },

  "banca-aurora": {
    nombre: "BANCA AURORA",
    precio: "$379.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla15.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla15_.avif",
    desc1: "Banca Aurora, ofrece un diseño fuerte y elegante que realza cualquier espacio con estilo natural.",
    desc2: "Sus medidas son 45 de alto x 40 de fondo x 1 metro de ancho, perfectas para uso cómodo y funcional."
  },

  "banca-horizonte": {
    nombre: "BANCA HORIZONTE",
    precio: "$559.900 COP",
    img1: "/Images/Colecciones/SillasYBancos/silla16.avif",
    img2: "/Images/Colecciones/SillasYBancos/silla16_.avif",
    desc1: "Banca Horizonte, destaca por su diseño sólido y moderno, ideal para interiores o exteriores.",
    desc2: "Sus medidas son 45 de alto x 40 de fondo x 1.50 de ancho, pensadas para comodidad y buen espacio."
  },


/* ===============================================================================
                         MESAS JS (PRODUCTOS)
==================================================================================*/

"mesa-umbral": {
    nombre: "MESA UMBRAL",
    precio: "$469.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa01.avif",
    img2: "/Images/Colecciones/Mesas/mesa01_.avif",
    desc1: "Mesa Umbral, combina un diseño limpio con un estilo moderno que se adapta fácil a diferentes ambientes del hogar.",
    desc2: "Sus medidas son 40 de alto x 80 de ancho x 40 de fondo, ideales para brindar comodidad sin ocupar mucho espacio."
  },

  "mesa-icono": {
    nombre: "MESA ICONO",
    precio: "$459.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa02.avif",
    img2: "/Images/Colecciones/Mesas/mesa02_.avif",
    desc1: "Mesa Icono, resalta por su diseño equilibrado y moderno, ideal para espacios funcionales.",
    desc2: "Sus medidas son 50 de ancho x 50 de fondo x 50 de alto, pensadas para brindar comodidad y buena proporción."
  },

  "mesa-alto": {
    nombre: "MESA ALTO",
    precio: "$249.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa03.avif",
    img2: "/Images/Colecciones/Mesas/mesa03_.avif",
    desc1: "Mesa Alto, destaca por su diseño sencillo y elegante, ideal para espacios modernos y prácticos.",
    desc2: "Sus medidas son 60 de alto x 40 de diámetro, perfectas para uso funcional sin ocupar mucho espacio."
  },

  "mesa-ecco": {
    nombre: "MESA ECCO",
    precio: "$489.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa04.avif",
    img2: "/Images/Colecciones/Mesas/mesa04_.avif",
    desc1: "Mesa Ecco, combina un estilo moderno con líneas limpias que se adaptan fácilmente a distintos ambientes.",
    desc2: "Sus medidas son 50 de alto x 60 de ancho x 40 de fondo, ideales para uso práctico y decorativo."
  },

  "mesa-tandem": {
    nombre: "MESA TANDEM",
    precio: "$99.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa05.avif",
    img2: "/Images/Colecciones/Mesas/mesa05_.avif",
    desc1: "Mesa Tandem, presenta un diseño moderno y ligero que aporta estilo sin recargar el espacio.",
    desc2: "Sus medidas son 60 de alto x 25 de base, ideales para ambientes prácticos y funcionales."
  },

  "mesa-plaza": {
    nombre: "MESA PLAZA",
    precio: "$379.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa06.avif",
    img2: "/Images/Colecciones/Mesas/mesa06_.avif",
    desc1: "Mesa Plaza, destaca por su diseño sencillo y funcional, ideal para espacios pequeños y modernos.",
    desc2: "Sus medidas son 60 de alto x 50 de ancho x 30 de fondo, pensadas para brindar comodidad sin ocupar mucho espacio."
  },

  "mesa-trama": {
    nombre: "MESA TRAMA",
    precio: "$429.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa07.avif",
    img2: "/Images/Colecciones/Mesas/mesa07_.avif",
    desc1: "Mesa Trama, ofrece un diseño versátil y moderno que se adapta a distintos estilos de espacio.",
    desc2: "Sus medidas son 50 y 40 de alto x 40 y 30 de diámetro, ideales para usar juntas o por separado."
  },

  "mesa-orbe": {
    nombre: "MESA ORBE",
    precio: "$269.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa08.avif",
    img2: "/Images/Colecciones/Mesas/mesa08_.avif",
    desc1: "Mesa Orbe, resalta por su diseño minimalista y elegante, ideal para espacios modernos.",
    desc2: "Sus medidas son 50 de alto x 30 de base, pensadas para uso práctico y decorativo."
  },

  "mesa-vela": {
    nombre: "MESA VELA",
    precio: "$279.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa09.avif",
    img2: "/Images/Colecciones/Mesas/mesa09_.avif",
    desc1: "Mesa Vela, combina un diseño ligero con líneas suaves que aportan estilo sin recargar el espacio.",
    desc2: "Sus medidas son 50 de alto x 40 de largo x 30 de fondo, ideales para uso práctico y decorativo."
  },

  "mesa-geo": {
    nombre: "MESA GEO",
    precio: "$279.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa10.avif",
    img2: "/Images/Colecciones/Mesas/mesa10_.avif",
    desc1: "Mesa Geo, presenta un diseño moderno y funcional que se adapta fácilmente a distintos ambientes.",
    desc2: "Sus medidas son 50 de alto x ancho variable x 40 de fondo, pensadas para uso práctico y decorativo."
  },

  "mesa-lumo": {
    nombre: "MESA LUMO",
    precio: "$389.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa11.avif",
    img2: "/Images/Colecciones/Mesas/mesa11_.avif",
    desc1: "Mesa Lumo, destaca por su diseño versátil y moderno, ideal para combinar en distintos espacio",
    desc2: "Sus medidas son 50 y 40 de alto x 40 y 30 de diámetro, pensadas para usar juntas o por separado según tu necesidad."
  },

  "mesa-esencia": {
    nombre: "MESA ESENCIA",
    precio: "$249.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa12.avif",
    img2: "/Images/Colecciones/Mesas/mesa12_.avif",
    desc1: "Mesa Esencia, ofrece un diseño simple y elegante que se adapta fácilmente a cualquier espacio.",
    desc2: "Sus medidas son 40 de alto x 40 de diámetro, ideales para uso práctico y decorativo."
  },

  "mesa-prisma": {
    nombre: "MESA PRISMA",
    precio: "$369.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa13.avif",
    img2: "/Images/Colecciones/Mesas/mesa13_.avif",
    desc1: "Mesa Prisma, combina un diseño moderno con formas limpias que aportan estilo y funcionalidad.",
    desc2: "Sus medidas son 50 y 40 de alto x 40 y 30 de diámetro, ideales para usarlas juntas o por separado."
  },

  "mesa-zenia": {
    nombre: "MESA ZENIA",
    precio: "$449.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa14.avif",
    img2: "/Images/Colecciones/Mesas/mesa14_.avif",
    desc1: "Mesa Zenia, destaca por su diseño sobrio y funcional, ideal para espacios modernos y equilibrados.",
    desc2: "Sus medidas son 40 de alto x 1 metro de ancho x 40 de fondo, pensadas para brindar comodidad sin ocupar mucho espacio."
  },

  "mesa-divina": {
    nombre: "MESA DIVINA",
    precio: "$529.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa15.avif",
    img2: "/Images/Colecciones/Mesas/mesa15_.avif",
    desc1: "Mesa Divina, combina un diseño elegante con un estilo moderno que se adapta a diferentes ambientes.",
    desc2: "Sus medidas son 30, 35 y 50 de alto x 30, 50 y 30 de diámetro, ideales para usar en conjunto o por separado."
  },

  "mesa-aria": {
    nombre: "MESA ARIA",
    precio: "$389.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa16.avif",
    img2: "/Images/Colecciones/Mesas/mesa16_.avif",
    desc1: "Mesa Aria, presenta un diseño moderno y limpio que aporta estilo sin recargar el espacio.",
    desc2: "Sus medidas son 50 y 40 de alto x 50 de base, ideales para usar juntas o por separado según tu espacio."
  },

  "mesa-vertice": {
    nombre: "MESA VERTICE",
    precio: "$519.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa17.avif",
    img2: "/Images/Colecciones/Mesas/mesa17_.avif",
    desc1: "Mesa Vértice, destaca por su diseño firme y moderno, ideal para espacios funcionales.",
    desc2: "Sus medidas son 40 de alto x 1 metro de ancho x 40 de fondo, pensadas para brindar comodidad sin ocupar mucho espacio."
  },

  "mesa-montan": {
    nombre: "MESA MONTAN",
    precio: "$649.900 COP",
    img1: "/Images/Colecciones/Mesas/mesa18.avif",
    img2: "/Images/Colecciones/Mesas/mesa18_.avif",
    desc1: "Mesa Montan, ofrece un diseño sólido y moderno que se adapta fácilmente a distintos ambientes.",
    desc2: "Sus medidas son 40 de alto x 60 de diámetro, ideales para uso práctico y decorativo."
  },


/* ===============================================================================
                         COMEDORES JS (PRODUCTOS)
==================================================================================*/

"comedor-vecinal": {
    nombre: "COMEDOR VECINAL",
    precio: "$879.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor01.avif",
    img2: "/Images/Colecciones/Comedores/comedor01_.avif",
    desc1: "Comedor Vecinal, combina un diseño moderno con un estilo acogedor, ideal para compartir en familia o con amigos.",
    desc2: "Incluye mesa de 75 de alto x 1.20 de ancho x 70 de fondo, sillas Eames acolchadas y banco de 40 de alto x 30 de fondo, pensados para comodidad y buen espacio."
  },
  
  "comedor-eleganteplus": {
    nombre: "COMEDOR ELEGANTE PLUS",
    precio: "$979.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor02.avif",
    img2: "/Images/Colecciones/Comedores/comedor02_.avif",
    desc1: "Comedor Elegante Plus, destaca por su diseño moderno y refinado, ideal para espacios con estilo.",
    desc2: "Incluye mesa de 75 de alto x 1 metro de diámetro y sillas Eames, pensadas para brindar comodidad y elegancia."
  },

  "comedor-primaveral": {
    nombre: "COMEDOR PRIMAVERAL",
    precio: "$789.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor03.avif",
    img2: "/Images/Colecciones/Comedores/comedor03_.avif",
    desc1: "Comedor Primaveral, ofrece un diseño fresco y moderno, ideal para espacios acogedores.",
    desc2: "Incluye mesa de 75 de alto x 60 de diámetro y sillas Eames, pensadas para brindar comodidad y buen estilo."
  },

  "comedor-bella": {
    nombre: "COMEDOR BELLA",
    precio: "$779.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor04.avif",
    img2: "/Images/Colecciones/Comedores/comedor04_.avif",
    desc1: "Comedor Bella, combina un diseño moderno con un estilo elegante que realza cualquier espacio.",
    desc2: "Incluye mesa de 80 de ancho x 80 de fondo x 75 de alto y sillas Eames, pensadas para comodidad y buen estilo."
  },

  "comedor-ruby": {
    nombre: "COMEDOR RUBY",
    precio: "$1'009.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor05.avif",
    img2: "/Images/Colecciones/Comedores/comedor05_.avif",
    desc1: "Comedor Ruby, destaca por su diseño elegante y funcional, ideal para espacios modernos y confortables.",
    desc2: "Incluye mesa de 75 de alto x 1.20 de ancho x 90 de fondo y sillas Eames acolchadas, pensadas para brindar comodidad y estilo."
  },

  "comedor-fuerte": {
    nombre: "COMEDOR FUERTE",
    precio: "$1'009.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor06.avif",
    img2: "/Images/Colecciones/Comedores/comedor06_.avif",
    desc1: "Comedor Fuerte, ofrece un diseño sólido y moderno, ideal para espacios amplios y funcionales.",
    desc2: "Incluye mesa de 75 de alto x 1.30 de ancho x 80 de fondo y sillas Eames acolchadas, pensadas para comodidad y estilo."
  },

  "comedor-dulce": {
    nombre: "COMEDOR DULCE",
    precio: "$799.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor07.avif",
    img2: "/Images/Colecciones/Comedores/comedor07_.avif",
    desc1: "Comedor Dulce, combina un diseño moderno y acogedor, ideal para espacios elegantes y funcionales.",
    desc2: "Incluye mesa de 75 de alto x 1.20 de ancho x 70 de fondo y sillas Eames, pensadas para brindar comodidad y buen estilo."
  },

  "comedor-clasic": {
    nombre: "COMEDOR CLASIC",
    precio: "$879.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor08.avif",
    img2: "/Images/Colecciones/Comedores/comedor08_.avif",
    desc1: "Comedor Clasic, ofrece un diseño elegante y funcional, ideal para espacios modernos y confortables.",
    desc2: "Incluye mesa de 75 de alto x 1.20 de ancho x 70 de fondo, sillas Eames acolchadas y banco de 40 de alto x 30 de fondo, pensados para comodidad y estilo."
  },

  "comedor-fluthy": {
    nombre: "COMEDOR FLUTHY",
    precio: "$799.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor09.avif",
    img2: "/Images/Colecciones/Comedores/comedor09_.avif",
    desc1: "Comedor Fluthy, destaca por su diseño moderno y funcional, ideal para espacios acogedores y elegantes.",
    desc2: "Incluye mesa de 75 de alto x 1.20 de ancho x 70 de fondo, sillas Eames y banco de 40 de alto x 30 de fondo, pensados para comodidad y estilo."
  },

  "comedor-coquett": {
    nombre: "COMEDOR COQUETT",
    precio: "$799.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor10.avif",
    img2: "/Images/Colecciones/Comedores/comedor10_.avif",
    desc1: "Comedor Coquett, combina un diseño moderno y elegante, ideal para espacios acogedores y con estilo.",
    desc2: "Incluye mesa de 75 de alto x 1.20 de ancho x 70 de fondo y sillas Eames, pensadas para brindar comodidad y buen estilo."
  },

  "comedor-bocado": {
    nombre: "COMEDOR BOCADO",
    precio: "$449.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor11.avif",
    img2: "/Images/Colecciones/Comedores/comedor11_.avif",
    desc1: "Comedor Bocado, destaca por su diseño compacto y moderno, ideal para espacios acogedores.",
    desc2: "Incluye mesa de 75 de alto x 60 de ancho x 60 de fondo y sillas Eames, pensadas para comodidad y estilo."
  },

  "comedor-vainilla": {
    nombre: "COMEDOR VAINILLA",
    precio: "$869.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor12.avif",
    img2: "/Images/Colecciones/Comedores/comedor12_.avif",
    desc1: "Comedor Vainilla, combina un diseño moderno y elegante, ideal para espacios acogedores y funcionales.",
    desc2: "Incluye mesa de 75 de alto x 1.20 de ancho x 70 de fondo, sillas Eames y banca de 40 de alto x 30 de fondo, pensados para comodidad y estilo."
  },

  "comedor-real": {
    nombre: "COMEDOR REAL",
    precio: "$1'209.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor13.avif",
    img2: "/Images/Colecciones/Comedores/comedor13_.avif",
    desc1: "Comedor Real, ofrece un diseño amplio y elegante, ideal para espacios modernos y funcionales.",
    desc2: "Incluye mesa de 75 de alto x 1.60 de ancho x 80 de fondo, sillas Eames y banco de 45 de alto x 30 de fondo, pensados para comodidad y estilo."
  },

  "comedor-variedad": {
    nombre: "COMEDOR VARIEDAD",
    precio: "$1'179.900 COP",
    img1: "/Images/Colecciones/Comedores/comedor14.avif",
    img2: "/Images/Colecciones/Comedores/comedor14_.avif",
    desc1: "Comedor Variedad, combina un diseño moderno y elegante, perfecto para espacios amplios y funcionales.",
    desc2: "Incluye mesa de 75 de alto x 1.60 de ancho x 80 de fondo y sillas Eames, pensadas para brindar comodidad y estilo."
  },


/* ===============================================================================
                         ESTRUCTURAS JS (PRODUCTOS)
==================================================================================*/

  "estructura-01": {
    nombre: "ESTRUCTURA 01",
    precio: "Contactanos",
    img1: "/Images/Colecciones/Estructuras/estruc01.avif",
    img2: "/Images/Colecciones/Estructuras/estruc01_.avif",
    desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
    desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
  },

  "estructura-02": {
    nombre: "ESTRUCTURA 02",
    precio: "Contactanos",
    img1: "/Images/Colecciones/Estructuras/estruc02.avif",
    img2: "/Images/Colecciones/Estructuras/estruc02_.avif",
    desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
    desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
  },

  "estructura-03": {
  nombre: "ESTRUCTURA 03",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc03.avif",
  img2: "/Images/Colecciones/Estructuras/estruc03_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-04": {
  nombre: "ESTRUCTURA 04",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc04.avif",
  img2: "/Images/Colecciones/Estructuras/estruc04_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-05": {
  nombre: "ESTRUCTURA 05",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc05.avif",
  img2: "/Images/Colecciones/Estructuras/estruc05_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-06": {
  nombre: "ESTRUCTURA 06",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc06.avif",
  img2: "/Images/Colecciones/Estructuras/estruc06_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-07": {
  nombre: "ESTRUCTURA 07",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc07.avif",
  img2: "/Images/Colecciones/Estructuras/estruc07_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-08": {
  nombre: "ESTRUCTURA 08",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc08.avif",
  img2: "/Images/Colecciones/Estructuras/estruc08_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-09": {
  nombre: "ESTRUCTURA 09",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc09.avif",
  img2: "/Images/Colecciones/Estructuras/estruc09_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-10": {
  nombre: "ESTRUCTURA 10",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc10.avif",
  img2: "/Images/Colecciones/Estructuras/estruc10_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-11": {
  nombre: "ESTRUCTURA 11",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc11.avif",
  img2: "/Images/Colecciones/Estructuras/estruc11_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-12": {
  nombre: "ESTRUCTURA 12",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc12.avif",
  img2: "/Images/Colecciones/Estructuras/estruc12_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-13": {
  nombre: "ESTRUCTURA 13",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc13.avif",
  img2: "/Images/Colecciones/Estructuras/estruc13_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-14": {
  nombre: "ESTRUCTURA 14",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc14.avif",
  img2: "/Images/Colecciones/Estructuras/estruc14_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-15": {
  nombre: "ESTRUCTURA 15",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc15.avif",
  img2: "/Images/Colecciones/Estructuras/estruc15_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-16": {
  nombre: "ESTRUCTURA 16",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc16.avif",
  img2: "/Images/Colecciones/Estructuras/estruc16_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-17": {
  nombre: "ESTRUCTURA 17",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc17.avif",
  img2: "/Images/Colecciones/Estructuras/estruc17_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-18": {
  nombre: "ESTRUCTURA 18",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc18.avif",
  img2: "/Images/Colecciones/Estructuras/estruc18_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-19": {
  nombre: "ESTRUCTURA 19",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc19.avif",
  img2: "/Images/Colecciones/Estructuras/estruc19_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-20": {
  nombre: "ESTRUCTURA 20",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc20.avif",
  img2: "/Images/Colecciones/Estructuras/estruc20_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-21": {
  nombre: "ESTRUCTURA 21",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc21.avif",
  img2: "/Images/Colecciones/Estructuras/estruc21_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-22": {
  nombre: "ESTRUCTURA 22",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc22.avif",
  img2: "/Images/Colecciones/Estructuras/estruc22_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
},

"estructura-23": {
  nombre: "ESTRUCTURA 23",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Estructuras/estruc23.avif",
  img2: "/Images/Colecciones/Estructuras/estruc23_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
 },

/* ===============================================================================
                         ARTES JS (PRODUCTOS)
==================================================================================*/

"arte-01": {
  nombre: "ARTE 01",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Artes/arte01.avif",
  img2: "/Images/Colecciones/Artes/arte01_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
 },

 "arte-02": {
  nombre: "ARTE 02",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Artes/arte02.avif",
  img2: "/Images/Colecciones/Artes/arte02_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
 },

 "arte-03": {
  nombre: "ARTE 03",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Artes/arte03.avif",
  img2: "/Images/Colecciones/Artes/arte03_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
 },

 "arte-04": {
  nombre: "ARTE 04",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Artes/arte04.avif",
  img2: "/Images/Colecciones/Artes/arte04_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
 },

 "arte-05": {
  nombre: "ARTE 05",
  precio: "Contactanos",
  img1: "/Images/Colecciones/Artes/arte05.avif",
  img2: "/Images/Colecciones/Artes/arte05_.avif",
  desc1: "Estructuras de metal resistentes y versátiles para mesas, sillas, bancas y comedores, adaptables a cualquier diseño.",
  desc2: "Fabricadas con materiales de calidad, se pueden personalizar en medidas y acabados para crear muebles únicos y duraderos."
 },


/* ===============================================================================
                         SOPORTES DE MATERAS JS (PRODUCTOS)
==================================================================================*/

"matera-lua": {
  nombre: "SOPORTE DE MATERA LUA",
  precio: "$99.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera01.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera01_.avif",
  desc1: "Soporte de matera LUA, combina diseño moderno y funcionalidad, ideal para resaltar tus plantas favoritas. Su estructura resistente y elegante aporta un toque decorativo mientras mantiene la matera firme y segura.",
  desc2: "Su tamaño de 70 de alto x 20 de diámetro lo hace perfecto para materas pequeñas y medianas, ofreciendo estabilidad y estilo en un solo accesorio."
 },

 "matera-esencia": {
  nombre: "SOPORTE DE MATERA ESENCIA",
  precio: "$349.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera02.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera02_.avif",
  desc1: "Soporte de matera ESENCIA, combina diseño elegante y funcionalidad, ideal para exhibir tus plantas favoritas con estilo. Su estructura sólida aporta un toque decorativo y seguro.",
  desc2: "Disponible en 70, 60, 50 y 40 de alto x 25 de base, perfecto para materas de distintos tamaños."
},

"matera-ebano": {
  nombre: "SOPORTE DE MATERA EBANO",
  precio: "$149.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera03.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera03_.avif",
  desc1: "Soporte de matera EBANO, combina modernidad y practicidad, ideal para resaltar tus plantas favoritas. Su estructura resistente mantiene la matera segura y estable.",
  desc2: "Disponible en 70, 60 y 50 de alto x 20 de diámetro, adecuado para materas pequeñas y medianas."
},

"matera-gaia": {
  nombre: "SOPORTE DE MATERA GAIA",
  precio: "$69.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera04.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera04_.avif",
  desc1: "Soporte de matera GAIA, con diseño simple y funcional, ideal para mostrar tus plantas favoritas en cualquier espacio. Su estructura sólida garantiza estabilidad y elegancia.",
  desc2: "Mide 60 de alto x 20 de diámetro, perfecto para materas pequeñas y medianas."
},

"matera-zenit": {
  nombre: "SOPORTE DE MATERA ZENIT",
  precio: "$159.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera05.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera05_.avif",
  desc1: "Soporte de matera ZENIT, combina estilo moderno y practicidad, ideal para resaltar tus plantas favoritas con seguridad. Su diseño elegante aporta un toque decorativo.",
  desc2: "Disponible en 60 y 40 de alto x 20 de diámetro, adecuado para materas pequeñas y medianas."
},

"matera-onix": {
  nombre: "SOPORTE DE MATERA ONIX",
  precio: "$189.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera06.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera06_.avif",
  desc1: "Soporte de matera ONIX, moderno y resistente, ideal para exhibir tus plantas con estilo. Su diseño robusto asegura estabilidad y elegancia.",
  desc2: "Mide 80 de alto x 80 de ancho y 10 de diámetro, perfecto para materas grandes y destacadas."
},

"matera-origen": {
  nombre: "SOPORTE DE MATERA ORIGEN",
  precio: "$299.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera07.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera07_.avif",
  desc1: "Soporte de matera ORIGEN, elegante y funcional, ideal para resaltar tus plantas favoritas. Su estructura firme garantiza estabilidad y estilo.",
  desc2: "Disponible en 70, 60 y 50 de alto x 25 de base, adecuado para materas de distintos tamaños."
},

"matera-horizonte": {
  nombre: "SOPORTE DE MATERA HORIZONTE",
  precio: "$126.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera08.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera08_.avif",
  desc1: "Soporte de matera HORIZONTE, combina diseño moderno y practicidad, ideal para exhibir tus plantas favoritas. Su estructura resistente aporta estabilidad y estilo.",
  desc2: "Disponible en 60 y 55 de alto x 20 de diámetro, perfecto para materas pequeñas y medianas."
},

"matera-icono": {
  nombre: "SOPORTE DE MATERA ICONO",
  precio: "$259.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera09.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera09_.avif",
  desc1: "Soporte de matera ICONO, elegante y funcional, ideal para resaltar tus plantas con seguridad y estilo. Su estructura sólida garantiza estabilidad.",
  desc2: "Disponible en 60, 50, 40 y 30 de alto x 20 de diámetro, adecuado para materas de distintos tamaños."
},

"matera-legacy": {
  nombre: "SOPORTE DE MATERA LEGACY",
  precio: "$139.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera10.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera10_.avif",
  desc1: "Soporte de matera LEGACY, combina modernidad y funcionalidad, ideal para mostrar tus plantas favoritas. Su diseño elegante aporta estabilidad y estilo.",
  desc2: "Disponible en 60 y 50 de alto x 20 de diámetro, perfecto para materas pequeñas y medianas."
},

"matera-axis": {
  nombre: "SOPORTE DE MATERA AXIS",
  precio: "$45.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera11.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera11_.avif",
  desc1: "Soporte de matera AXIS, pequeño y práctico, ideal para resaltar plantas en espacios reducidos. Su diseño estable aporta seguridad y estilo.",
  desc2: "Mide 40 de alto x 20 de diámetro, perfecto para materas pequeñas."
},

"matera-imperium": {
  nombre: "SOPORTE DE MATERA IMPERIUM",
  precio: "$129.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera12.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera12_.avif",
  desc1: "Soporte de matera IMPERIUM, robusto y funcional, ideal para mostrar tus plantas favoritas con elegancia. Su estructura resistente garantiza estabilidad.",
  desc2: "Mide 80 de alto x 20 de diámetro, perfecto para materas medianas y grandes."
},

"matera-prisma": {
  nombre: "SOPORTE DE MATERA PRISMA",
  precio: "$59.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera13.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera13_.avif",
  desc1: "Soporte de matera PRISMA, moderno y compacto, ideal para resaltar plantas en cualquier espacio. Su diseño estable aporta seguridad y estilo.",
  desc2: "Mide 60 de alto x 20 de diámetro, adecuado para materas pequeñas y medianas."
},

"matera-atrio": {
  nombre: "SOPORTE DE MATERA ATRIO",
  precio: "$159.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera14.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera14_.avif",
  desc1: "Soporte de matera ATRIO, elegante y funcional, ideal para mostrar tus plantas favoritas con seguridad y estilo. Su estructura sólida garantiza estabilidad.",
  desc2: "Disponible en 70 y 60 de alto x 20 de diámetro, perfecto para materas medianas."
},

"matera-scala": {
  nombre: "SOPORTE DE MATERA SCALA",
  precio: "$139.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera15.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera15_.avif",
  desc1: "Soporte de matera SCALA, combina diseño moderno y practicidad, ideal para resaltar plantas en cualquier espacio. Su estructura resistente aporta estabilidad.",
  desc2: "Disponible en 60 y 40 de alto x 20 de diámetro, adecuado para materas pequeñas y medianas."
},

"matera-portico": {
  nombre: "SOPORTE DE MATERA PORTICO",
  precio: "$35.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera16.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera16_.avif",
  desc1: "Soporte de matera PORTICO, pequeño y funcional, ideal para resaltar tus plantas favoritas en espacios reducidos. Su estructura sólida aporta estabilidad.",
  desc2: "Mide 15 de alto x 10 de diámetro, perfecto para materas muy pequeñas."
},

"matera-aria": {
  nombre: "SOPORTE DE MATERA ARIA",
  precio: "$109.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera17.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera17_.avif",
  desc1: "Soporte de matera ARIA, elegante y compacto, ideal para resaltar plantas en espacios pequeños. Su diseño estable y decorativo aporta estilo.",
  desc2: "Mide 15 de alto x 25 de base, perfecto para materas pequeñas."
},

"matera-domus": {
  nombre: "SOPORTE DE MATERA DOMUS",
  precio: "$309.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera18.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera18_.avif",
  desc1: "Soporte de matera DOMUS, robusto y elegante, ideal para resaltar plantas grandes. Su diseño resistente aporta seguridad y estilo.",
  desc2: "Mide 90 de alto x 20 de diámetro, adecuado para materas grandes."
},

"matera-nova": {
  nombre: "SOPORTE DE MATERA NOVA",
  precio: "$309.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera19.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera19_.avif",
  desc1: "Soporte de matera NOVA, moderno y funcional, ideal para exhibir tus plantas con estilo. Su estructura firme garantiza estabilidad.",
  desc2: "Mide 50 de alto x 35 de fondo y 1 metro de ancho, perfecto para materas grandes."
},

"matera-brisa": {
  nombre: "SOPORTE DE MATERA BRISA",
  precio: "$49.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera20.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera20_.avif",
  desc1: "Soporte de matera BRISA, compacto y elegante, ideal para resaltar plantas en espacios pequeños. Su diseño estable aporta seguridad y estilo.",
  desc2: "Mide 40 de alto x 25 de ancho x 10 de diámetro, perfecto para materas pequeñas."
},

"matera-lirio": {
  nombre: "SOPORTE DE MATERA LIRIO",
  precio: "$88.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera21.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera21_.avif",
  desc1: "Soporte de matera LIRIO, elegante y práctico, ideal para resaltar tus plantas favoritas. Su estructura resistente aporta estabilidad y estilo.",
  desc2: "Mide 60 de alto x 20 de diámetro, perfecto para materas pequeñas y medianas."
},

"matera-boral": {
  nombre: "SOPORTE DE MATERA BORAL",
  precio: "$129.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera22.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera22_.avif",
  desc1: "Soporte de matera BORAL, elegante y funcional, ideal para resaltar plantas en cualquier espacio. Su diseño estable garantiza seguridad y estilo.",
  desc2: "Mide 70 de alto x 25 de ancho, adecuado para materas medianas."
},

"matera-magnolia": {
  nombre: "SOPORTE DE MATERA MAGNOLIA",
  precio: "$69.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera23.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera23_.avif",
  desc1: "Soporte de matera MAGNOLIA, moderno y compacto, ideal para resaltar plantas en espacios reducidos. Su estructura firme aporta estabilidad y estilo.",
  desc2: "Mide 70 de alto x 20 de diámetro, perfecto para materas pequeñas y medianas."
},

"matera-ambaris": {
  nombre: "SOPORTE DE MATERA AMBARIS",
  precio: "$55.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera24.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera24_.avif",
  desc1: "Soporte de matera AMBARIS, pequeño y práctico, ideal para resaltar plantas en espacios reducidos. Su diseño estable aporta seguridad y estilo.",
  desc2: "Mide 40 de alto x 15 de fondo x 35 de ancho, perfecto para materas pequeñas."
},

"matera-caliza": {
  nombre: "SOPORTE DE MATERA CALIZA",
  precio: "$89.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera25.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera25_.avif",
  desc1: "Soporte de matera CALIZA, elegante y funcional, ideal para resaltar plantas con estilo. Su estructura resistente aporta seguridad y estabilidad.",
  desc2: "Mide 60 de alto x 20 de diámetro, adecuado para materas pequeñas y medianas."
},

"matera-savia": {
  nombre: "SOPORTE DE MATERA SAVIA",
  precio: "$49.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera26.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera26_.avif",
  desc1: "Soporte de matera SAVIA, compacto y elegante, ideal para resaltar plantas en espacios pequeños. Su diseño estable aporta seguridad y estilo.",
  desc2: "Mide 40 de alto x 20 de diámetro, perfecto para materas pequeñas."
},

"matera-verona": {
  nombre: "SOPORTE DE MATERA VERONA",
  precio: "$69.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera27.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera27_.avif",
  desc1: "Soporte de matera VERONA, pequeño y funcional, ideal para resaltar tus plantas favoritas en espacios reducidos. Su estructura firme garantiza estabilidad.",
  desc2: "Mide 60 de alto x 8 cm de diámetro, adecuado para materas pequeñas."
},

"matera-panteon": {
  nombre: "SOPORTE DE MATERA PANTEON",
  precio: "$199.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera28.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera28_.avif",
  desc1: "Soporte de matera PANTEON, elegante y resistente, ideal para exhibir plantas medianas y grandes. Su diseño estable aporta seguridad y estilo.",
  desc2: "Mide 50 de alto x 25 de base, perfecto para materas medianas."
},

"matera-altiva": {
  nombre: "SOPORTE DE MATERA ALTIVA",
  precio: "$79.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera29.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera29_.avif",
  desc1: "Soporte de matera ALTIVA, moderno y funcional, ideal para resaltar plantas con seguridad y estilo. Su estructura firme garantiza estabilidad.",
  desc2: "Mide 60 de alto x 20 de diámetro, adecuado para materas pequeñas y medianas."
},

"matera-nympha": {
  nombre: "SOPORTE DE MATERA NYMPHA",
  precio: "$40.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera30.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera30_.avif",
  desc1: "Soporte de matera NYMPHA, pequeño y práctico, ideal para resaltar plantas en espacios reducidos. Su estructura estable aporta seguridad y estilo.",
  desc2: "Mide 10 de alto x 8 cm de diámetro, perfecto para materas muy pequeñas."
},

"matera-eliseo": {
  nombre: "SOPORTE DE MATERA ELISEO",
  precio: "$139.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera31.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera31_.avif",
  desc1: "Soporte de matera ELISEO, moderno y funcional, ideal para resaltar tus plantas favoritas con estilo. Su estructura resistente aporta estabilidad y elegancia.",
  desc2: "Disponible en 60 y 40 de alto x 20 de diámetro, perfecto para materas pequeñas y medianas."
},

"matera-olimpia": {
  nombre: "SOPORTE DE MATERA OLIMPIA",
  precio: "$349.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera32.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera32_.avif",
  desc1: "Soporte de matera OLIMPIA, elegante y sólido, ideal para exhibir plantas de distintos tamaños con estilo. Su diseño robusto garantiza seguridad y estabilidad.",
  desc2: "Disponible en 70, 60 y 50 de alto x 25 de base, adecuado para materas grandes y medianas."
},

"matera-coralina": {
  nombre: "SOPORTE DE MATERA CORALINA",
  precio: "$99.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera33.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera33_.avif",
  desc1: "Soporte de matera CORALINA, compacto y elegante, ideal para resaltar plantas pequeñas en cualquier espacio. Su estructura sólida aporta estabilidad y estilo.",
  desc2: "Mide 30 de alto x 25 de diámetro, perfecto para materas pequeñas."
},

"matera-versalles": {
  nombre: "SOPORTE DE MATERA VERSALLES",
  precio: "$109.900 COP",
  img1: "/Images/Colecciones/SoportesYMateras/matera34.avif",
  img2: "/Images/Colecciones/SoportesYMateras/matera34_.avif",
  desc1: "Soporte de matera VERSALLES, moderno y funcional, ideal para exhibir plantas con estilo. Su diseño resistente aporta estabilidad y elegancia.",
  desc2: "Mide 60 de alto x 20 de diámetro, perfecto para materas medianas y pequeñas."
 },


/* ===============================================================================
                         RECIBIDORES JS (PRODUCTOS)
==================================================================================*/

"recibidor-full": {
  nombre: "RECIBIDOR FULL",
  precio: "$479.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi01.avif",
  img2: "/Images/Colecciones/Recibidores/recibi01_.avif",
  desc1: "Recibidor Full, combina diseño moderno y funcionalidad, ideal para dar una excelente primera impresión y mantener todo en orden.",
  desc2: "Mide 80 de alto x 1 metro de ancho y 25 de fondo, perfecto para entradas o pasillos con estilo y practicidad."
 },

 "recibidor-perla": {
  nombre: "RECIBIDOR PERLA",
  precio: "$299.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi02.avif",
  img2: "/Images/Colecciones/Recibidores/recibi02_.avif",
  desc1: "Recibidor Perla, destaca por su estilo limpio y elegante, ideal para espacios que buscan luz y armonía.",
  desc2: "Mide 80 de alto x 90 de ancho y 20 de fondo, perfecto para entradas compactas y funcionales."
},

"recibidor-pleno": {
  nombre: "RECIBIDOR PLENO",
  precio: "$399.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi03.avif",
  img2: "/Images/Colecciones/Recibidores/recibi03_.avif",
  desc1: "Recibidor Pleno, combina simplicidad y estilo moderno, ideal para organizar y decorar al mismo tiempo.",
  desc2: "Mide 80 de alto x 80 de ancho y 20 de fondo, práctico para espacios medianos."
},

"recibidor-thin": {
  nombre: "RECIBIDOR THIN",
  precio: "$439.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi04.avif",
  img2: "/Images/Colecciones/Recibidores/recibi04_.avif",
  desc1: "Recibidor Thin, diseño delgado y moderno, ideal para espacios que buscan ligereza visual.",
  desc2: "Mide 80 de alto x 1 metro de ancho y 25 de fondo, perfecto para entradas amplias."
},

"recibidor-diamate": {
  nombre: "RECIBIDOR DIAMATE",
  precio: "$449.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi05.avif",
  img2: "/Images/Colecciones/Recibidores/recibi05_.avif",
  desc1: "Recibidor Diamate, combina firmeza y diseño elegante, ideal para dar carácter al espacio.",
  desc2: "Mide 80 de alto x 80 de ancho y 20 de fondo, funcional y decorativo."
},

"recibidor-bella": {
  nombre: "RECIBIDOR BELLA",
  precio: "$479.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi06.avif",
  img2: "/Images/Colecciones/Recibidores/recibi06_.avif",
  desc1: "Recibidor Bella, diseño atractivo y sofisticado, ideal para entradas con estilo.",
  desc2: "Mide 80 de alto x 1.20 de ancho y 30 de fondo, amplio y práctico."
},

"recibidor-ruby": {
  nombre: "RECIBIDOR RUBY",
  precio: "$399.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi07.avif",
  img2: "/Images/Colecciones/Recibidores/recibi07_.avif",
  desc1: "Recibidor Ruby, mezcla de modernidad y elegancia, ideal para ambientes cálidos.",
  desc2: "Mide 80 de alto x 1 metro de ancho y 20 de fondo, cómodo y funcional."
},

"recibidor-galan": {
  nombre: "RECIBIDOR GALAN",
  precio: "$469.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi08.avif",
  img2: "/Images/Colecciones/Recibidores/recibi08_.avif",
  desc1: "Recibidor Galan, diseño fuerte y elegante, ideal para entradas con presencia.",
  desc2: "Mide 80 de alto x 1.10 de ancho y 20 de fondo, amplio y organizado."
},

"recibidor-hunter": {
  nombre: "RECIBIDOR HUNTER",
  precio: "$379.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi09.avif",
  img2: "/Images/Colecciones/Recibidores/recibi09_.avif",
  desc1: "Recibidor Hunter, estilo robusto y moderno, ideal para espacios con carácter.",
  desc2: "Mide 90 de alto x 80 de ancho y 20 de fondo, alto y funcional."
},

"recibidor-spring": {
  nombre: "RECIBIDOR SPRING",
  precio: "$429.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi10.avif",
  img2: "/Images/Colecciones/Recibidores/recibi10_.avif",
  desc1: "Recibidor Spring, diseño fresco y moderno, ideal para espacios llenos de luz.",
  desc2: "Mide 80 de alto x 90 de ancho y 30 de fondo, cómodo y decorativo."
},

"recibidor-fluthy": {
  nombre: "RECIBIDOR FLUTHY",
  precio: "$499.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi11.avif",
  img2: "/Images/Colecciones/Recibidores/recibi11_.avif",
  desc1: "Recibidor Fluthy, diseño llamativo y moderno, ideal para entradas con estilo único.",
  desc2: "Mide 80 de alto x 90 de ancho y 30 de fondo, amplio y funcional."
},

"recibidor-cruzado": {
  nombre: "RECIBIDOR CRUZADO",
  precio: "$489.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi12.avif",
  img2: "/Images/Colecciones/Recibidores/recibi12_.avif",
  desc1: "Recibidor Cruzado, diseño estructural y moderno, ideal para destacar tu entrada.",
  desc2: "Mide 80 de alto x 1.20 metros de ancho y 20 de fondo, fuerte y elegante."
},

"recibidor-fantastico": {
  nombre: "RECIBIDOR FANTASTICO",
  precio: "$479.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi13.avif",
  img2: "/Images/Colecciones/Recibidores/recibi13_.avif",
  desc1: "Recibidor Fantástico, diseño creativo y moderno, ideal para espacios con personalidad.",
  desc2: "Mide 70 de alto x 1 metro de ancho y 30 de fondo, bajo y funcional."
},

"recibidor-variedad": {
  nombre: "RECIBIDOR VARIEDAD",
  precio: "$599.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi14.avif",
  img2: "/Images/Colecciones/Recibidores/recibi14_.avif",
  desc1: "Recibidor Variedad, combina espacio y estilo, ideal para hogares dinámicos.",
  desc2: "Mide 80 de alto x 1 metro de ancho y 30 de fondo, amplio y práctico."
},

"recibidor-sofisticado": {
  nombre: "RECIBIDOR SOFISTICADO",
  precio: "$499.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi15.avif",
  img2: "/Images/Colecciones/Recibidores/recibi15_.avif",
  desc1: "Recibidor Sofisticado, diseño elegante y moderno, ideal para entradas finas.",
  desc2: "Mide 70 de alto x 1 metro de ancho y 30 de fondo, estilizado y práctico."
},

"recibidor-primate": {
  nombre: "RECIBIDOR PRIMATE",
  precio: "$529.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi16.avif",
  img2: "/Images/Colecciones/Recibidores/recibi16_.avif",
  desc1: "Recibidor Primate, diseño fuerte y funcional, ideal para uso diario.",
  desc2: "Mide 80 de alto x 90 de ancho y 20 de fondo, compacto y útil."
},

"recibidor-plieges": {
  nombre: "RECIBIDOR PLIEGES",
  precio: "$429.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi17.avif",
  img2: "/Images/Colecciones/Recibidores/recibi17_.avif",
  desc1: "Recibidor Plieges, estilo moderno con detalles únicos, ideal para decorar.",
  desc2: "Mide 80 de alto x 1 metro de ancho y 30 de fondo, amplio y cómodo."
},

"recibidor-delicado": {
  nombre: "RECIBIDOR DELICADO",
  precio: "$609.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi18.avif",
  img2: "/Images/Colecciones/Recibidores/recibi18_.avif",
  desc1: "Recibidor Delicado, diseño fino y elegante, ideal para espacios sofisticados.",
  desc2: "Mide 80 de alto x 1 metro de ancho y 30 de fondo, grande y funcional."
},

"recibidor-brillante": {
  nombre: "RECIBIDOR BRILLANTE",
  precio: "$409.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi19.avif",
  img2: "/Images/Colecciones/Recibidores/recibi19_.avif",
  desc1: "Recibidor Brillante, diseño moderno que destaca por su presencia.",
  desc2: "Mide 80 de alto x 1 metro de ancho y 30 de fondo, práctico y decorativo."
},

"recibidor-estetico": {
  nombre: "RECIBIDOR ESTETICO",
  precio: "$449.900 COP",
  img1: "/Images/Colecciones/Recibidores/recibi20.avif",
  img2: "/Images/Colecciones/Recibidores/recibi20_.avif",
  desc1: "Recibidor Estético, diseño armónico y moderno, ideal para entradas con estilo.",
  desc2: "Mide 80 de alto x 80 de ancho y 30 de fondo, compacto y elegante."
 },


/* ===============================================================================
                         ESTANTERIAS JS (PRODUCTOS)
==================================================================================*/

"estante-urbanline": {
  nombre: "ESTANTE URBAN LINE",
  precio: "$199.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante01.avif",
  img2: "/Images/Colecciones/Estanterias/estante01_.avif",
  desc1: "Estante Urban Line, combina diseño moderno y funcionalidad, ideal para organizar y exhibir objetos decorativos con estilo. Su estructura práctica aporta orden sin recargar el espacio.",
  desc2: "Mide 40 de alto x 40 de ancho y 20 de fondo, perfecto para salas, habitaciones u oficinas, brindando utilidad y decoración en un solo mueble."
 },

 "estante-neoloft": {
  nombre: "ESTANTE NEO LOFT",
  precio: "$579.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante02.avif",
  img2: "/Images/Colecciones/Estanterias/estante02_.avif",
  desc1: "Estante Neo Loft, combina estilo industrial y funcionalidad, ideal para espacios modernos y amplios.",
  desc2: "Mide 80 de alto x 60 de ancho y 40 de fondo, perfecto para salas u oficinas."
},

"estante-axis": {
  nombre: "ESTANTE AXIS",
  precio: "$478.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante03.avif",
  img2: "/Images/Colecciones/Estanterias/estante03_.avif",
  desc1: "Estante Axis, diseño fuerte y moderno, ideal para organizar libros y decoración.",
  desc2: "Mide 70 de alto x 60 de ancho y 40 de fondo."
},

"estante-elemental": {
  nombre: "ESTANTE ELEMENTAL",
  precio: "$419.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante04.avif",
  img2: "/Images/Colecciones/Estanterias/estante04_.avif",
  desc1: "Estante Elemental, diseño limpio y práctico, ideal para cualquier ambiente.",
  desc2: "Mide 1.20 de alto x 40 de base."
},

"estante-grid": {
  nombre: "ESTANTE GRID",
  precio: "$749.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante05.avif",
  img2: "/Images/Colecciones/Estanterias/estante05_.avif",
  desc1: "Estante Grid, diseño geométrico moderno, ideal para destacar decoración.",
  desc2: "Mide 1.40 de alto x 50 x 50."
},

"estante-prisma": {
  nombre: "ESTANTE PRISMA",
  precio: "$829.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante06.avif",
  img2: "/Images/Colecciones/Estanterias/estante06_.avif",
  desc1: "Estante Prisma, elegante y moderno, ideal para espacios amplios.",
  desc2: "Mide 1.60 de alto x 1 metro de ancho y 30 de fondo."
},

"estante-armonia": {
  nombre: "ESTANTE ARMONÍA",
  precio: "$479.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante07.avif",
  img2: "/Images/Colecciones/Estanterias/estante07_.avif",
  desc1: "Estante Armonía, diseño delicado y funcional, ideal para ambientes tranquilos.",
  desc2: "Mide 1.80 de alto x 25 de fondo."
},

"estante-nexus": {
  nombre: "ESTANTE NEXUS",
  precio: "$599.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante08.avif",
  img2: "/Images/Colecciones/Estanterias/estante08_.avif",
  desc1: "Estante Nexus, diseño innovador y moderno, ideal para destacar espacios.",
  desc2: "Mide 1.90 de alto x 60 de ancho, 15 arriba y 50 abajo de fondo."
},

"estante-skyline": {
  nombre: "ESTANTE SKYLINE",
  precio: "$749.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante09.avif",
  img2: "/Images/Colecciones/Estanterias/estante09_.avif",
  desc1: "Estante Skyline, diseño llamativo y moderno, ideal para salas amplias.",
  desc2: "Mide 1.80 de alto x 40 de ancho, 40 arriba y 90 abajo de fondo."
},

"estante-vector": {
  nombre: "ESTANTE VECTOR",
  precio: "$529.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante10.avif",
  img2: "/Images/Colecciones/Estanterias/estante10_.avif",
  desc1: "Estante Vector, diseño modular y práctico, ideal para organizar en niveles.",
  desc2: "Disponible en 90, 60 y 30 de alto x 90 de ancho y 30 de fondo."
},

"estante-quantum": {
  nombre: "ESTANTE QUANTUM",
  precio: "$389.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante11.avif",
  img2: "/Images/Colecciones/Estanterias/estante11_.avif",
  desc1: "Estante Quantum, diseño simple y funcional, ideal para cualquier espacio.",
  desc2: "Mide 1.80 de alto x 40 de base."
},

"estante-orion": {
  nombre: "ESTANTE ORION",
  precio: "$549.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante12.avif",
  img2: "/Images/Colecciones/Estanterias/estante12_.avif",
  desc1: "Estante Orion, diseño elegante y fuerte, ideal para decoración moderna.",
  desc2: "Mide 1.80 de alto x 40 de base."
},

"estante-atlas": {
  nombre: "ESTANTE ATLAS",
  precio: "$699.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante13.avif",
  img2: "/Images/Colecciones/Estanterias/estante13_.avif",
  desc1: "Estante Atlas, diseño robusto y moderno, ideal para espacios grandes.",
  desc2: "Mide 1.80 de alto x 80 de ancho y 30 de fondo."
},

"estante-eclipse": {
  nombre: "ESTANTE ECLIPSE",
  precio: "$549.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante14.avif",
  img2: "/Images/Colecciones/Estanterias/estante14_.avif",
  desc1: "Estante Eclipse, diseño sobrio y moderno, ideal para salas y oficinas.",
  desc2: "Mide 1.80 de alto x 60 de ancho y 30 de fondo."
},

"estante-aurora": {
  nombre: "ESTANTE AURORA",
  precio: "$639.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante15.avif",
  img2: "/Images/Colecciones/Estanterias/estante15_.avif",
  desc1: "Estante Aurora, diseño elegante y amplio, ideal para destacar decoración.",
  desc2: "Mide 1.80 de alto x 80 de ancho y 30 de fondo."
},

"estante-lineazero": {
  nombre: "ESTANTE LINEA ZERO",
  precio: "$299.900 COP",
  img1: "/Images/Colecciones/Estanterias/estante16.avif",
  img2: "/Images/Colecciones/Estanterias/estante16_.avif",
  desc1: "Estante Línea Zero, diseño compacto y funcional, ideal para espacios pequeños.",
  desc2: "Mide 60 de alto x 50 de ancho y 15 de fondo."
},

/* ===============================================================================
                         ESTANTERIAS JS (PRODUCTOS)
==================================================================================*/

"mesabarra-lua": {
  nombre: "MESA BARRA LUA",
  precio: "$549.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra01.avif",
  img2: "/Images/Colecciones/MesasBarra/barra01_.avif",
  desc1: "Mesa Barra Lua, diseño moderno y funcional, ideal para espacios sociales.",
  desc2: "Mide 1 metro de alto x 80 de ancho y 25 de fondo; incluye sillas de 70 de alto x 30 de base."
},

"mesabarra-esencia": {
  nombre: "MESA BARRA ESENCIA",
  precio: "$899.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra02.avif",
  img2: "/Images/Colecciones/MesasBarra/barra02_.avif",
  desc1: "Mesa Barra Esencia, estilo amplio y cómodo, perfecta para reuniones y espacios familiares.",
  desc2: "Mide 1.20 de ancho x 1 metro de alto y 30 de fondo; incluye sillas de 70 de alto x 30 de base."
},

"mesabarra-ebano": {
  nombre: "MESA BARRA EBANO",
  precio: "$879.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra03.avif",
  img2: "/Images/Colecciones/MesasBarra/barra03_.avif",
  desc1: "Mesa Barra Ebano, fuerte y elegante, ideal para ambientes modernos.",
  desc2: "Mide 1 metro de alto x 1 metro de ancho y 60 de fondo; incluye sillas de 70 de alto x 30 de base."
},

"mesabarra-gaia": {
  nombre: "MESA BARRA GAIA",
  precio: "$1'229.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra04.avif",
  img2: "/Images/Colecciones/MesasBarra/barra04_.avif",
  desc1: "Mesa Barra Gaia, diseño amplio y cómodo para compartir.",
  desc2: "Mide 90 de alto x 1.60 de ancho y 60 de fondo; incluye sillas de 70 de alto x 30 de base."
},

"mesabarra-zenit": {
  nombre: "MESA BARRA ZENIT",
  precio: "$1'029.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra05.avif",
  img2: "/Images/Colecciones/MesasBarra/barra05_.avif",
  desc1: "Mesa Barra Zenit, práctica y moderna para espacios sociales.",
  desc2: "Mide 90 de alto x 1 metro de ancho y 40 de fondo; incluye sillas de 70 de alto x 30 de base."
},

"mesabarra-onix": {
  nombre: "MESA BARRA ONIX",
  precio: "$889.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra06.avif",
  img2: "/Images/Colecciones/MesasBarra/barra06_.avif",
  desc1: "Mesa Barra Onix, robusta y elegante para cualquier ambiente.",
  desc2: "Mide 90 de alto x 1 metro de ancho y 60 de fondo; incluye sillas de 70 de alto x 30 de base."
},

"mesabarra-origen": {
  nombre: "MESA BARRA ORIGEN",
  precio: "$839.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra07.avif",
  img2: "/Images/Colecciones/MesasBarra/barra07_.avif",
  desc1: "Mesa Barra Origen, cómoda y amplia para compartir.",
  desc2: "Mide 75 de alto x 1 metro de ancho y 70 de fondo; incluye sillas de 45 x 30 de base."
},

"mesabarra-horizonte": {
  nombre: "MESA BARRA HORIZONTE",
  precio: "$599.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra08.avif",
  img2: "/Images/Colecciones/MesasBarra/barra08_.avif",
  desc1: "Mesa Barra Horizonte, diseño vertical y moderno.",
  desc2: "Mide 90 de alto x 40 de diámetro; incluye sillas de 70 de alto x 30 de base."
},

"mesabarra-icono": {
  nombre: "MESA BARRA ICONO",
  precio: "$649.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra09.avif",
  img2: "/Images/Colecciones/MesasBarra/barra09_.avif",
  desc1: "Mesa Barra Icono, compacta y funcional.",
  desc2: "Mide 75 de alto x 60 de diámetro; incluye sillas de 45 de alto."
},

"mesabarra-legacy": {
  nombre: "MESA BARRA LEGACY",
  precio: "$749.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra10.avif",
  img2: "/Images/Colecciones/MesasBarra/barra10_.avif",
  desc1: "Mesa Barra Legacy, amplia y cómoda para compartir.",
  desc2: "Mide 90 de alto x 1 metro de largo y 60 de fondo; incluye sillas de 70 x 30 de base."
},

"mesabarra-axis": {
  nombre: "MESA BARRA AXIS",
  precio: "$649.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra11.avif",
  img2: "/Images/Colecciones/MesasBarra/barra11_.avif",
  desc1: "Mesa Barra Axis, compacta y moderna.",
  desc2: "Mide 90 de alto x 50 de diámetro; incluye sillas de 70 x 30 de base."
},

"mesabarra-imperium": {
  nombre: "MESA BARRA IMPERIUM",
  precio: "$729.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra12.avif",
  img2: "/Images/Colecciones/MesasBarra/barra12_.avif",
  desc1: "Mesa Barra Imperium, firme y elegante.",
  desc2: "Mide 75 de alto x 1 metro de largo y 60 de fondo; incluye sillas de 45 x 30 de base."
},

"mesabarra-prime": {
  nombre: "MESA BARRA PRIME",
  precio: "$849.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra13.avif",
  img2: "/Images/Colecciones/MesasBarra/barra13_.avif",
  desc1: "Mesa Barra Prime, moderna y funcional.",
  desc2: "Mide 90 de alto x 1 metro de largo y 40 de fondo; incluye sillas de 70 x 30 de base."
},

"mesabarra-atrio": {
  nombre: "MESA BARRA ATRIO",
  precio: "$949.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra14.avif",
  img2: "/Images/Colecciones/MesasBarra/barra14_.avif",
  desc1: "Mesa Barra Atrio, amplia y cómoda.",
  desc2: "Mide 75 de alto x 1.20 de largo y 60 de fondo; incluye banca de 1 metro x 45 de alto."
},

"mesabarra-scala": {
  nombre: "MESA BARRA SCALA",
  precio: "$789.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra15.avif",
  img2: "/Images/Colecciones/MesasBarra/barra15_.avif",
  desc1: "Mesa Barra Scala, ideal para espacios modernos.",
  desc2: "Mide 90 de alto x 1 metro de largo y 40 de fondo; incluye sillas de 70 x 30 de base."
},

"mesabarra-portico": {
  nombre: "MESA BARRA PORTICO",
  precio: "$799.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra16.avif",
  img2: "/Images/Colecciones/MesasBarra/barra16_.avif",
  desc1: "Mesa Barra Portico, amplia y funcional.",
  desc2: "Mide 75 de alto x 1.20 de largo y 70 de fondo; incluye banca de 1 metro x 45 de alto."
},

"mesabarra-aria": {
  nombre: "MESA BARRA ARIA",
  precio: "$489.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra17.avif",
  img2: "/Images/Colecciones/MesasBarra/barra17_.avif",
  desc1: "Mesa Barra Aria, compacta y práctica.",
  desc2: "Mide 90 de alto x 90 de largo y 30 de fondo; incluye sillas de 70 x 30 de base."
},

"mesabarra-domus": {
  nombre: "MESA BARRA DOMUS",
  precio: "$449.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra18.avif",
  img2: "/Images/Colecciones/MesasBarra/barra18_.avif",
  desc1: "Mesa Barra Domus, cómoda y funcional.",
  desc2: "Mide 75 de alto x 90 de largo y 40 de fondo; incluye sillas de 45 x 30 de base."
},

"mesabarra-nova": {
  nombre: "MESA BARRA NOVA",
  precio: "$999.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra19.avif",
  img2: "/Images/Colecciones/MesasBarra/barra19_.avif",
  desc1: "Mesa Barra Nova, amplia y moderna.",
  desc2: "Mide 90 de alto x 1.20 de largo y 60 de fondo; incluye sillas de 70 x 30 de base."
},

"mesabarra-brisa": {
  nombre: "MESA BARRA BRISA",
  precio: "$849.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra20.avif",
  img2: "/Images/Colecciones/MesasBarra/barra20_.avif",
  desc1: "Mesa Barra Brisa, ideal para espacios sociales.",
  desc2: "Mide 90 de alto x 1 metro de largo y 60 de fondo; incluye sillas de 70 x 30 de base."
},

"mesabarra-nova2": {
  nombre: "MESA BARRA NOVA 2",
  precio: "$699.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra21.avif",
  img2: "/Images/Colecciones/MesasBarra/barra21_.avif",
  desc1: "Mesa Barra Nova 2, compacta y funcional.",
  desc2: "Mide 75 de alto x 60 de largo y 60 de fondo; incluye sillas de 45 x 30 de base."
},

"mesabarra-brisa2": {
  nombre: "MESA BARRA BRISA 2",
  precio: "$759.900 COP",
  img1: "/Images/Colecciones/MesasBarra/barra22.avif",
  img2: "/Images/Colecciones/MesasBarra/barra22_.avif",
  desc1: "Mesa Barra Brisa 2, práctica y moderna.",
  desc2: "Mide 75 de alto x 60 de largo y 60 de fondo; incluye sillas de 45 x 30 de base."
}
};
/* ===============================================================================
                         DETECTOR DE PRODUCTOS JS
==================================================================================*/

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (productos[id]) {
  const p = productos[id];

  // Imagen principal
  const mainImg = document.querySelector(".main-image");
  if (mainImg) mainImg.src = p.img1;

  // Miniaturas
  const thumbs = document.querySelectorAll(".thumbnail");
  if (thumbs[0]) thumbs[0].src = p.img1;
  if (thumbs[1]) thumbs[1].src = p.img2;

  // Texto
  const nombre = document.querySelector(".producto");
  if (nombre) nombre.textContent = p.nombre;

  const precio = document.querySelector(".precio");
  if (precio) precio.textContent = p.precio;

  const descs = document.querySelectorAll(".descripcion");
  if (descs[0]) descs[0].textContent = p.desc1;
  if (descs[1]) descs[1].textContent = p.desc2;
}

