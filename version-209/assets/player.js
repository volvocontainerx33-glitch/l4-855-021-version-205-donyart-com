function initVideoPlayer(videoId, overlayId, url) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    let attached = false;
    let hls = null;

    if (!video || !overlay || !url) {
        return;
    }

    function attach() {
        if (attached) {
            return;
        }
        attached = true;

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal || !hls) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    hls.destroy();
                    hls = null;
                }
            });
        } else {
            video.src = url;
        }
    }

    function play() {
        attach();
        overlay.classList.add("hidden");
        const action = video.play();
        if (action && typeof action.catch === "function") {
            action.catch(function () {});
        }
    }

    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (!attached) {
            play();
        }
    });
}
