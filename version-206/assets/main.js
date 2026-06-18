(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var previous = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var heroIndex = 0;
    var heroTimer = null;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === heroIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === heroIndex);
      });
    }

    function startHero() {
      if (heroTimer || slides.length < 2) {
        return;
      }
      heroTimer = window.setInterval(function () {
        showHero(heroIndex + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showHero(Number(dot.getAttribute("data-hero-dot") || 0));
      });
    });

    if (previous) {
      previous.addEventListener("click", function () {
        showHero(heroIndex - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showHero(heroIndex + 1);
      });
    }

    startHero();

    Array.prototype.slice.call(document.querySelectorAll("[data-scroll-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        var target = document.getElementById(button.getAttribute("data-scroll-target"));
        if (!target) {
          return;
        }
        var direction = button.getAttribute("data-scroll-button") === "left" ? -1 : 1;
        target.scrollBy({
          left: direction * 420,
          behavior: "smooth"
        });
      });
    });

    var filterInput = document.querySelector("[data-filter-input]");
    var filterYear = document.querySelector("[data-filter-year]");
    var filterType = document.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var emptyState = document.querySelector("[data-empty-state]");

    if (filterInput && cards.length) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query) {
        filterInput.value = query;
      }

      function applyFilters() {
        var text = (filterInput.value || "").trim().toLowerCase();
        var year = filterYear ? filterYear.value : "";
        var type = filterType ? filterType.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-type") || "",
            card.getAttribute("data-genre") || ""
          ].join(" ").toLowerCase();
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var matchesText = !text || haystack.indexOf(text) !== -1;
          var matchesYear = !year || cardYear.indexOf(year) === 0;
          var matchesType = !type || cardType.indexOf(type) !== -1 || haystack.indexOf(type.toLowerCase()) !== -1;
          var show = matchesText && matchesYear && matchesType;
          card.classList.toggle("is-hidden", !show);
          if (show) {
            visible += 1;
          }
        });

        if (emptyState) {
          emptyState.classList.toggle("is-visible", visible === 0);
        }
      }

      filterInput.addEventListener("input", applyFilters);
      if (filterYear) {
        filterYear.addEventListener("change", applyFilters);
      }
      if (filterType) {
        filterType.addEventListener("change", applyFilters);
      }
      applyFilters();
    }
  });
})();
