document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (navToggle && mobileMenu) {
        navToggle.addEventListener("click", function () {
            const open = mobileMenu.classList.toggle("open");
            document.body.classList.toggle("menu-open", open);
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    let heroIndex = 0;
    let heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === heroIndex);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === heroIndex);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        stopHero();
        heroTimer = window.setInterval(function () {
            showSlide(heroIndex + 1);
        }, 5600);
    }

    function stopHero() {
        if (heroTimer) {
            window.clearInterval(heroTimer);
            heroTimer = null;
        }
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
            startHero();
        });
    });

    showSlide(0);
    startHero();

    const filterForms = Array.from(document.querySelectorAll(".filter-panel"));

    filterForms.forEach(function (panel) {
        const scope = panel.closest(".filter-scope") || document;
        const cards = Array.from(scope.querySelectorAll(".movie-card"));
        const searchInput = panel.querySelector("[data-filter-search]");
        const regionSelect = panel.querySelector("[data-filter-region]");
        const typeSelect = panel.querySelector("[data-filter-type]");
        const yearSelect = panel.querySelector("[data-filter-year]");

        function matchesYear(cardYear, rule) {
            const year = parseInt(cardYear, 10);
            if (!rule || rule === "all") {
                return true;
            }
            if (rule === "2020s") {
                return year >= 2020;
            }
            if (rule === "2010s") {
                return year >= 2010 && year < 2020;
            }
            if (rule === "2000s") {
                return year >= 2000 && year < 2010;
            }
            if (rule === "old") {
                return year > 0 && year < 2000;
            }
            return String(cardYear).indexOf(rule) !== -1;
        }

        function applyFilter() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            const region = regionSelect ? regionSelect.value : "all";
            const type = typeSelect ? typeSelect.value : "all";
            const year = yearSelect ? yearSelect.value : "all";

            cards.forEach(function (card) {
                const text = (card.getAttribute("data-keywords") || card.textContent || "").toLowerCase();
                const cardRegion = card.getAttribute("data-region") || "";
                const cardType = card.getAttribute("data-type") || "";
                const cardYear = card.getAttribute("data-year") || "";
                const ok = (!query || text.indexOf(query) !== -1)
                    && (region === "all" || cardRegion.indexOf(region) !== -1)
                    && (type === "all" || cardType.indexOf(type) !== -1)
                    && matchesYear(cardYear, year);
                card.classList.toggle("hide-card", !ok);
            });
        }

        [searchInput, regionSelect, typeSelect, yearSelect].forEach(function (el) {
            if (el) {
                el.addEventListener("input", applyFilter);
                el.addEventListener("change", applyFilter);
            }
        });
    });
});
