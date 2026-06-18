function initializeMoviePlayer(videoId, buttonId, streamUrl) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  let hlsInstance = null;

  if (!video || !button || !streamUrl) {
    return;
  }

  const attachStream = function() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (!video.getAttribute("src")) {
        video.src = streamUrl;
      }
      return Promise.resolve();
    }

    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      }
      return Promise.resolve();
    }

    video.src = streamUrl;
    return Promise.resolve();
  };

  const start = function() {
    attachStream().then(function() {
      button.classList.add("is-hidden");
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function() {
          button.classList.remove("is-hidden");
        });
      }
    });
  };

  button.addEventListener("click", start);
  video.addEventListener("click", function() {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener("play", function() {
    button.classList.add("is-hidden");
  });
  video.addEventListener("pause", function() {
    if (!video.ended) {
      button.classList.remove("is-hidden");
    }
  });
  video.addEventListener("ended", function() {
    button.classList.remove("is-hidden");
  });
}
