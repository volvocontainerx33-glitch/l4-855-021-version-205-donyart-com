(function () {
  function initMoviePlayer(videoId, triggerId, streamUrl) {
    var video = document.getElementById(videoId);
    var trigger = document.getElementById(triggerId);

    if (!video || !trigger || !streamUrl) {
      return;
    }

    var box = video.closest(".player-box");
    var loaded = false;

    function loadStream() {
      if (loaded) {
        return;
      }
      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        return;
      }

      video.src = streamUrl;
    }

    function markPlaying() {
      if (box) {
        box.classList.add("is-playing");
      }
    }

    function start(event) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      loadStream();
      markPlaying();
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    trigger.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", markPlaying);
    video.addEventListener("pause", function () {
      if (box && video.currentTime === 0) {
        box.classList.remove("is-playing");
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
