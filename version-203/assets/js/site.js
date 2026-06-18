(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let activeSlide = 0;
    let slideTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeSlide);
        });
    }

    function scheduleSlides() {
        if (slides.length < 2) {
            return;
        }

        slideTimer = window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            window.clearInterval(slideTimer);
            showSlide(index);
            scheduleSlides();
        });
    });

    showSlide(0);
    scheduleSlides();

    const searchInput = document.querySelector('[data-filter-keyword]');
    const yearSelect = document.querySelector('[data-filter-year]');
    const typeSelect = document.querySelector('[data-filter-type]');
    const categorySelect = document.querySelector('[data-filter-category]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const empty = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        const keyword = normalize(searchInput ? searchInput.value : '');
        const year = yearSelect ? yearSelect.value : '';
        const type = typeSelect ? typeSelect.value : '';
        const category = categorySelect ? categorySelect.value : '';
        let visibleCount = 0;

        cards.forEach(function (card) {
            const haystack = normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.genre,
                card.dataset.tags,
                card.dataset.type,
                card.dataset.category
            ].join(' '));
            const passKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            const passYear = !year || card.dataset.year === year;
            const passType = !type || card.dataset.type === type;
            const passCategory = !category || card.dataset.category === category;
            const show = passKeyword && passYear && passType && passCategory;

            card.style.display = show ? '' : 'none';
            if (show) {
                visibleCount += 1;
            }
        });

        if (empty) {
            empty.style.display = visibleCount ? 'none' : 'block';
        }
    }

    [searchInput, yearSelect, typeSelect, categorySelect].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });

    applyFilters();
})();
