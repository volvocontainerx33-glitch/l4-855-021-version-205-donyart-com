(function () {
    const players = Array.from(document.querySelectorAll('[data-player]'));

    players.forEach(function (box) {
        const video = box.querySelector('video');
        const button = box.querySelector('[data-play-button]');
        const stream = box.getAttribute('data-stream');
        let ready = false;
        let hls = null;

        const prepare = function () {
            if (!video || !stream || ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                ready = true;
                return;
            }

            video.src = stream;
            ready = true;
        };

        const play = function () {
            prepare();
            box.classList.add('is-playing');
            const result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    box.classList.remove('is-playing');
                });
            }
        };

        if (button && video) {
            button.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                box.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.ended) {
                    box.classList.remove('is-playing');
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
