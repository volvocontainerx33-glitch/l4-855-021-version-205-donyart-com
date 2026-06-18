(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var opened = mobilePanel.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
            mobilePanel.setAttribute('aria-hidden', opened ? 'false' : 'true');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-index]'));
    var heroIndex = 0;
    var heroTimer = null;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === heroIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === heroIndex);
        });
    }

    function startHero() {
        if (slides.length <= 1) {
            return;
        }
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function () {
            showHero(heroIndex + 1);
        }, 5200);
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showHero(Number(dot.getAttribute('data-hero-index') || 0));
            startHero();
        });
    });

    showHero(0);
    startHero();

    var searchInput = document.querySelector('.card-search');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
    var emptyState = document.querySelector('.empty-state');
    var activeFilter = '';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyCardFilter() {
        if (!cards.length) {
            return;
        }
        var keyword = normalize(searchInput ? searchInput.value : '');
        var filter = normalize(activeFilter);
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-meta'),
                card.getAttribute('data-tags')
            ].join(' '));
            var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchedFilter = !filter || haystack.indexOf(filter) !== -1;
            var matched = matchedKeyword && matchedFilter;
            card.hidden = !matched;
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (initialQuery) {
            searchInput.value = initialQuery;
        }
        searchInput.addEventListener('input', applyCardFilter);
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (item) {
                item.classList.remove('is-active');
            });
            chip.classList.add('is-active');
            activeFilter = chip.getAttribute('data-filter') || '';
            applyCardFilter();
        });
    });

    applyCardFilter();
})();

function initMoviePlayer(src) {
    var video = document.getElementById('movieVideo');
    var cover = document.querySelector('.player-cover');
    var hlsInstance = null;

    if (!video || !src) {
        return;
    }

    function attachSource() {
        if (video.getAttribute('data-ready') === '1') {
            return;
        }
        video.setAttribute('data-ready', '1');

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal || !hlsInstance) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hlsInstance.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hlsInstance.recoverMediaError();
                } else {
                    hlsInstance.destroy();
                }
            });
        } else {
            video.src = src;
        }
    }

    function beginPlay() {
        attachSource();
        if (cover) {
            cover.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    attachSource();

    if (cover) {
        cover.addEventListener('click', beginPlay);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            beginPlay();
        }
    });

    video.addEventListener('play', function () {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
