document.addEventListener("DOMContentLoaded", () => {
  // --- Particle Animation ---
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  class Particle { constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 5 + 2; this.speedY = Math.random() * 1.5 + 0.5; this.speedX = Math.random() * 2 - 1; this.opacity = Math.random() * 0.5 + 0.3; this.angle = Math.random() * Math.PI * 2; this.spin = (Math.random() - 0.5) * 0.02; } update() { this.y += this.speedY; this.x += this.speedX; this.angle += this.spin; if (this.y > canvas.height + this.size) { this.y = 0 - this.size; this.x = Math.random() * canvas.width; } if (this.x > canvas.width + this.size) { this.x = 0 - this.size; } if (this.x < 0 - this.size) { this.x = canvas.width + this.size; } } draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 6; i++) { ctx.moveTo(0, 0); ctx.lineTo(0, this.size); ctx.rotate(Math.PI / 3); } ctx.stroke(); ctx.restore(); } }
  function initParticles() { particles = []; const numberOfParticles = Math.floor(canvas.width / 15); for (let i = 0; i < numberOfParticles; i++) { particles.push(new Particle()); } }
  function animateParticles() { ctx.clearRect(0, 0, canvas.width, canvas.height); for (const particle of particles) { particle.update(); particle.draw(); } requestAnimationFrame(animateParticles); }
  resizeCanvas(); initParticles(); animateParticles();
  window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

  // --- Element Selections ---
  const audio = document.getElementById("bg-music");
  const startOverlay = document.getElementById("start-overlay");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeIcon = volumeBtn.querySelector("i");
  const volumeSlider = document.getElementById("volume-slider");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const totalDurationEl = document.getElementById("total-duration");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playPauseIcon = playPauseBtn.querySelector("i");
  const spinningThumbnail = document.getElementById("spinning-thumbnail");

  // --- Play/Pause Logic ---
  function playSong() {
    spinningThumbnail.classList.add("spinning");
    audio.play().catch((e) => console.error("Playback was prevented.", e));
  }

  function pauseSong() {
    spinningThumbnail.classList.remove("spinning");
    audio.pause();
  }

  function updatePlayPauseIcon() {
    if (audio.paused) {
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
    } else {
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
    }
  }
  
  // --- Volume Logic ---
  audio.volume = volumeSlider.value;
  function updateVolumeIcon() {
    if (audio.muted || audio.volume === 0) { // Changed condition to include muted state
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    } else {
      volumeIcon.classList.remove("fa-volume-mute");
      volumeIcon.classList.add("fa-volume-up");
    }
  }

  // --- Progress Bar & Time Logic ---
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }

  function setDuration() {
    totalDurationEl.textContent = formatTime(audio.duration);
  }

  function setProgress(e) {
    const width = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
  }

  // --- Event Listeners ---
  startOverlay.addEventListener('click', () => {
    playSong();
    startOverlay.classList.add('hidden');
  }, { once: true });

  playPauseBtn.addEventListener("click", () => {
    audio.paused ? playSong() : pauseSong();
  });

  volumeBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    updateVolumeIcon();
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    audio.muted = false; // Unmute if user adjusts volume
    updateVolumeIcon();
  });
  
  audio.addEventListener("play", updatePlayPauseIcon);
  audio.addEventListener("pause", updatePlayPauseIcon);
  audio.addEventListener("volumechange", updateVolumeIcon); // Listen for volume changes
  audio.addEventListener("loadedmetadata", setDuration);
  audio.addEventListener("timeupdate", updateProgress);
  progressContainer.addEventListener("click", setProgress);

  // --- Slideshow Logic ---
  const slideshowTrack = document.querySelector(".slideshow-track");
  if (slideshowTrack) {
    const originalSlides = slideshowTrack.querySelectorAll(".slide-image");
    const slideCount = originalSlides.length;
    let currentIndex = 0;
    const firstClone = originalSlides[0].cloneNode(true);
    slideshowTrack.appendChild(firstClone);
    const allSlides = slideshowTrack.querySelectorAll(".slide-image");
    const totalSlides = allSlides.length;
    slideshowTrack.style.width = `${totalSlides * 100}%`;
    allSlides.forEach((slide) => {
      slide.style.width = `${100 / totalSlides}%`;
    });
    slideshowTrack.addEventListener("transitionend", () => {
      if (currentIndex >= slideCount) {
        slideshowTrack.classList.add("no-transition");
        currentIndex = 0;
        slideshowTrack.style.transform = `translateX(0%)`;
        setTimeout(() => {
          slideshowTrack.classList.remove("no-transition");
        }, 50);
      }
    });
    function nextSlide() {
      currentIndex++;
      const newTransformValue = -currentIndex * (100 / totalSlides);
      slideshowTrack.style.transform = `translateX(${newTransformValue}%)`;
    }
    setInterval(nextSlide, 3000);
  }
});