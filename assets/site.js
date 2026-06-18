(function () {
  var body = document.body;
  var menuToggle = document.querySelector('.menu-toggle');
  var searchToggle = document.querySelector('.search-toggle');

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      body.classList.toggle('search-open');
      var input = document.querySelector('.search-panel input');
      if (body.classList.contains('search-open') && input) {
        input.focus();
      }
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('is-hidden');
    });
  });

  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var current = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    }));

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  });

  document.querySelectorAll('[data-rail]').forEach(function (rail) {
    var section = rail.closest('.rail-section') || document;
    var prev = section.querySelector('[data-rail-prev]');
    var next = section.querySelector('[data-rail-next]');
    if (prev) {
      prev.addEventListener('click', function () {
        rail.scrollBy({ left: -420, behavior: 'smooth' });
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        rail.scrollBy({ left: 420, behavior: 'smooth' });
      });
    }
  });

  var pageSearch = document.querySelector('[data-page-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function cardMatches(card, query, filter) {
    var haystack = normalize(card.getAttribute('data-title'));
    var typeText = normalize(card.getAttribute('data-type'));
    var queryOk = !query || haystack.indexOf(query) !== -1;
    var filterOk = filter === 'all' || typeText.indexOf(filter) !== -1 || haystack.indexOf(filter) !== -1;
    return queryOk && filterOk;
  }

  function applyFilters() {
    var query = pageSearch ? normalize(pageSearch.value) : '';
    cards.forEach(function (card) {
      card.classList.toggle('is-hidden', !cardMatches(card, query, activeFilter));
    });
  }

  if (pageSearch && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var value = params.get('q');
    if (value) {
      pageSearch.value = value;
    }
    pageSearch.addEventListener('input', applyFilters);
    applyFilters();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');
      activeFilter = normalize(button.getAttribute('data-filter'));
      applyFilters();
    });
  });

  document.querySelectorAll('[data-player]').forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.player-start');
    var hlsInstance = null;
    var ready = false;

    function activate() {
      if (!video) {
        return;
      }
      var stream = video.getAttribute('data-stream');
      if (!stream) {
        return;
      }
      if (!ready) {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }
        ready = true;
      }
      shell.classList.add('is-ready');
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        activate();
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target === video || event.target.closest('button')) {
        return;
      }
      activate();
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
