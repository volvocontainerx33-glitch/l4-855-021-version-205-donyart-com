(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var navToggle = document.querySelector("[data-nav-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (navToggle && mobileNav) {
            navToggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
            var prev = slider.querySelector("[data-hero-prev]");
            var next = slider.querySelector("[data-hero-next]");
            var index = 0;
            var timer;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }

                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === index);
                });
            }

            function start() {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5000);
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    start();
                });
            });

            if (prev) {
                prev.addEventListener("click", function () {
                    show(index - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(index + 1);
                    start();
                });
            }

            show(0);
            start();
        });

        document.querySelectorAll("[data-filter-form]").forEach(function (form) {
            var root = form.parentElement || document;
            var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));
            var textInput = form.querySelector("[data-filter-text]");
            var yearSelect = form.querySelector("[data-filter-year]");
            var regionInput = form.querySelector("[data-filter-region]");
            var categorySelect = form.querySelector("[data-filter-category]");

            function valueOf(input) {
                return input ? input.value.trim().toLowerCase() : "";
            }

            function applyFilters() {
                var text = valueOf(textInput);
                var year = valueOf(yearSelect);
                var region = valueOf(regionInput);
                var category = valueOf(categorySelect);

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-category") || "",
                        card.getAttribute("data-tags") || ""
                    ].join(" ").toLowerCase();
                    var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
                    var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
                    var cardCategory = (card.getAttribute("data-category") || "").toLowerCase();
                    var visible = true;

                    if (text && haystack.indexOf(text) === -1) {
                        visible = false;
                    }

                    if (year && cardYear.indexOf(year) === -1) {
                        visible = false;
                    }

                    if (region && cardRegion.indexOf(region) === -1) {
                        visible = false;
                    }

                    if (category && cardCategory !== category) {
                        visible = false;
                    }

                    card.hidden = !visible;
                });
            }

            [textInput, yearSelect, regionInput, categorySelect].forEach(function (input) {
                if (!input) {
                    return;
                }
                input.addEventListener("input", applyFilters);
                input.addEventListener("change", applyFilters);
            });
        });

        document.querySelectorAll(".player-shell").forEach(function (shell) {
            var video = shell.querySelector("video");
            var overlay = shell.querySelector(".player-overlay");
            var src = shell.getAttribute("data-video-src");
            var loaded = false;
            var hlsInstance = null;

            function loadVideo() {
                if (!video || !src || loaded) {
                    return;
                }

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = src;
                    loaded = true;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(src);
                    hlsInstance.attachMedia(video);
                    loaded = true;
                    return;
                }

                video.src = src;
                loaded = true;
            }

            function startVideo() {
                loadVideo();
                shell.classList.add("is-playing");
                if (video) {
                    video.controls = true;
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === "function") {
                        playPromise.catch(function () {});
                    }
                }
            }

            if (overlay) {
                overlay.addEventListener("click", startVideo);
            }

            if (video) {
                video.addEventListener("click", function () {
                    if (!loaded) {
                        startVideo();
                    }
                });
                video.addEventListener("play", function () {
                    shell.classList.add("is-playing");
                });
                video.addEventListener("ended", function () {
                    shell.classList.remove("is-playing");
                });
            }

            window.addEventListener("pagehide", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    });
})();
