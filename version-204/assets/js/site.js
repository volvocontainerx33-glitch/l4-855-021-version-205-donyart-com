(function () {
    const body = document.body;
    const mobileToggle = document.querySelector('[data-mobile-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
            body.classList.toggle('menu-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let current = 0;
        let timer = null;

        const showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        const start = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                const index = Number(dot.getAttribute('data-hero-dot'));
                showSlide(index);
                start();
            });
        });

        start();
    }

    document.querySelectorAll('[data-scroll-left]').forEach(function (button) {
        button.addEventListener('click', function () {
            const target = document.getElementById(button.getAttribute('data-scroll-left'));
            if (target) {
                target.scrollBy({ left: -420, behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('[data-scroll-right]').forEach(function (button) {
        button.addEventListener('click', function () {
            const target = document.getElementById(button.getAttribute('data-scroll-right'));
            if (target) {
                target.scrollBy({ left: 420, behavior: 'smooth' });
            }
        });
    });

    const filterList = document.querySelector('[data-filter-list]');
    const filterInput = document.querySelector('[data-filter-input]');
    const filterButtons = Array.from(document.querySelectorAll('[data-filter-button]'));
    let activeFilter = 'all';

    const normalize = function (value) {
        return String(value || '').trim().toLowerCase();
    };

    const applyFilter = function () {
        if (!filterList) {
            return;
        }

        const term = normalize(filterInput ? filterInput.value : '');
        const filter = normalize(activeFilter);
        const cards = Array.from(filterList.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
            const key = normalize(card.getAttribute('data-filter-key'));
            const matchesTerm = !term || key.indexOf(term) !== -1;
            const matchesFilter = filter === 'all' || key.indexOf(filter) !== -1 || normalize(card.getAttribute('data-category')) === filter;
            card.classList.toggle('is-hidden', !(matchesTerm && matchesFilter));
        });
    };

    if (filterInput) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            filterInput.value = query;
        }
        filterInput.addEventListener('input', applyFilter);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.getAttribute('data-filter-button') || 'all';
            filterButtons.forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });
            applyFilter();
        });
    });

    applyFilter();
})();
