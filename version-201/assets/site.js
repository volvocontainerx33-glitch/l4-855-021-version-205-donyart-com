(function() {
  const menuButton = document.querySelector(".menu-toggle");
  const mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function() {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    let current = 0;

    const showSlide = function(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    };

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function() {
        showSlide(current + 1);
      }, 5000);
    }
  }

  document.querySelectorAll(".row-next").forEach(function(button) {
    button.addEventListener("click", function() {
      const row = button.closest(".section").querySelector("[data-row]");
      if (row) {
        row.scrollBy({ left: 420, behavior: "smooth" });
      }
    });
  });

  document.querySelectorAll(".row-prev").forEach(function(button) {
    button.addEventListener("click", function() {
      const row = button.closest(".section").querySelector("[data-row]");
      if (row) {
        row.scrollBy({ left: -420, behavior: "smooth" });
      }
    });
  });

  const filterList = document.querySelector("[data-filter-list]");
  if (filterList) {
    const searchInput = document.querySelector(".local-search") || document.querySelector("#global-search-input");
    const buttons = Array.from(document.querySelectorAll(".filter-button"));
    const empty = document.querySelector(".empty-state");
    const cards = Array.from(filterList.querySelectorAll(".movie-card"));
    const params = new URLSearchParams(window.location.search);
    let activeFilter = "";

    const normalize = function(value) {
      return String(value || "").toLowerCase().trim();
    };

    const applyFilter = function() {
      const query = normalize(searchInput ? searchInput.value : "");
      const buttonFilter = normalize(activeFilter);
      let visible = 0;

      cards.forEach(function(card) {
        const text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-type"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-keywords"),
          card.textContent
        ].join(" "));
        const matchQuery = !query || text.includes(query);
        const matchButton = !buttonFilter || text.includes(buttonFilter);
        const show = matchQuery && matchButton;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    };

    if (searchInput) {
      const q = params.get("q");
      if (q) {
        searchInput.value = q;
      }
      searchInput.addEventListener("input", applyFilter);
    }

    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        buttons.forEach(function(item) {
          item.classList.remove("active");
        });
        button.classList.add("active");
        activeFilter = button.getAttribute("data-filter") || "";
        applyFilter();
      });
    });

    applyFilter();
  }
})();
