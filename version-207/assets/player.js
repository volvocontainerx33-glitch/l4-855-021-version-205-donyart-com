(function() {
  var video = document.querySelector('[data-player-video]');
  var cover = document.querySelector('[data-player-cover]');
  var startButton = document.querySelector('[data-player-start]');

  if (!video || !cover || !startButton) {
    return;
  }

  var source = startButton.getAttribute('data-src');
  var ready = false;
  var hlsInstance = null;

  function prepare() {
    if (ready || !source) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        maxBufferLength: 30,
        enableWorker: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function start() {
    prepare();
    cover.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function() {});
    }
  }

  cover.addEventListener('click', start);
  startButton.addEventListener('click', start);
  video.addEventListener('click', function() {
    if (video.paused) {
      start();
    }
  });

  window.addEventListener('beforeunload', function() {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
