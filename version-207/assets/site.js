(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = index;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var index = Number(dot.getAttribute('data-hero-dot')) || 0;
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function() {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  var searchInput = document.querySelector('[data-page-search]');
  var emptyNotice = document.querySelector('[data-search-empty]');

  if (searchInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

    searchInput.addEventListener('input', function() {
      var keyword = searchInput.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function(card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || ''
        ].join(' ').toLowerCase();
        var matched = haystack.indexOf(keyword) !== -1;
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (emptyNotice) {
        emptyNotice.hidden = visible !== 0;
      }
    });
  }
})();
