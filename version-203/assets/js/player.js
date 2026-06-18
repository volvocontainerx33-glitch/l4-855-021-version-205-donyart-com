(function () {
    function bootPlayer() {
        const video = document.querySelector('[data-player-video]');
        const overlay = document.querySelector('[data-player-overlay]');
        const button = document.querySelector('[data-player-button]');

        if (!video || !overlay || !button) {
            return;
        }

        const streamUrl = video.dataset.stream || '';
        let started = false;
        let hlsInstance = null;

        function startPlayback() {
            if (started || !streamUrl) {
                return;
            }

            started = true;
            overlay.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }

            video.src = streamUrl;
            video.play().catch(function () {});
        }

        overlay.addEventListener('click', startPlayback);
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            startPlayback();
        });
        video.addEventListener('click', function () {
            if (!started) {
                startPlayback();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootPlayer);
    } else {
        bootPlayer();
    }
})();
