(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (navButton && mobileMenu) {
    navButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
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

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-hero-dot'), 10);
        showSlide(index);
        startHero();
      });
    });

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    startHero();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter(panel) {
    var textInput = panel.querySelector('[data-filter-text]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(panel.querySelectorAll('.movie-card'));
    var query = normalize(textInput && textInput.value);
    var typeValue = normalize(typeSelect && typeSelect.value);
    var yearValue = normalize(yearSelect && yearSelect.value);

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-tags')
      ].join(' '));
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesType = !typeValue || normalize(card.getAttribute('data-type')) === typeValue;
      var matchesYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;

      card.classList.toggle('is-hidden', !(matchesQuery && matchesType && matchesYear));
    });
  }

  var filterPanels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
  var params = new URLSearchParams(window.location.search);
  var q = params.get('q');

  filterPanels.forEach(function (panel) {
    var controls = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-text], [data-filter-type], [data-filter-year]'));
    var textInput = panel.querySelector('[data-filter-text]');

    if (q && textInput) {
      textInput.value = q;
    }

    controls.forEach(function (control) {
      control.addEventListener('input', function () {
        applyFilter(panel);
      });
      control.addEventListener('change', function () {
        applyFilter(panel);
      });
    });

    applyFilter(panel);
  });

  function launchPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var url = player.getAttribute('data-m3u8');

    if (!video || !url) {
      return;
    }

    if (button) {
      button.classList.add('is-hidden');
    }

    if (video.getAttribute('data-ready') === '1') {
      video.play().catch(function () {});
      return;
    }

    video.setAttribute('data-ready', '1');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        maxBufferLength: 30,
        backBufferLength: 30
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = url;
    video.play().catch(function () {});
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');

    if (button) {
      button.addEventListener('click', function () {
        launchPlayer(player);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          launchPlayer(player);
        }
      });
    }
  });
})();
