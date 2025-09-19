document.addEventListener("DOMContentLoaded", () => {
  // --- Particle Animation (Unchanged) ---
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
  const prevBtn = document.getElementById("prev-btn"); // New button
  const nextBtn = document.getElementById("next-btn"); // New button

  // --- NEW: Playlist Logic ---
  const songs = ['music.mp3', 'music2.mp3', 'music3.mp3']; // Add your song file paths here
  let songIndex = 0;

  // Function to load a specific song
  function loadSong(song) {
      audio.src = song;
  }

  // Load the initial song
  loadSong(songs[songIndex]);

  // --- Fading Play/Pause Logic ---
  let fadeInterval = null;
  let targetVolume = parseFloat(volumeSlider.value);
  function fadeInPlay() { clearInterval(fadeInterval); audio.volume = 0; audio.play().catch((e) => console.error("Playback was prevented.", e)); fadeInterval = setInterval(() => { if (audio.volume < targetVolume - 0.05) { audio.volume += 0.05; } else { audio.volume = targetVolume; clearInterval(fadeInterval); } }, 50); }
  function fadeOutPause() { clearInterval(fadeInterval); targetVolume = audio.volume; fadeInterval = setInterval(() => { if (audio.volume > 0.05) { audio.volume -= 0.05; } else { audio.volume = 0; audio.pause(); clearInterval(fadeInterval); } }, 50); }
  function syncUIWithAudio() { if (audio.paused) { playPauseIcon.classList.remove("fa-pause"); playPauseIcon.classList.add("fa-play"); spinningThumbnail.classList.remove("spinning"); } else { playPauseIcon.classList.remove("fa-play"); playPauseIcon.classList.add("fa-pause"); spinningThumbnail.classList.add("spinning"); } }
  
  // --- NEW: Next/Previous Song Functions ---
  function nextSong() {
      songIndex = (songIndex + 1) % songs.length; // Loop to the start
      loadSong(songs[songIndex]);
      fadeInPlay();
  }

  function prevSong() {
      songIndex--;
      if (songIndex < 0) {
          songIndex = songs.length - 1; // Loop to the end
      }
      loadSong(songs[songIndex]);
      fadeInPlay();
  }

  // --- Volume Logic (Unchanged) ---
  audio.volume = targetVolume;
  function updateVolumeIcon() { if (audio.muted || audio.volume === 0) { volumeIcon.classList.remove("fa-volume-up"); volumeIcon.classList.add("fa-volume-mute"); } else { volumeIcon.classList.remove("fa-volume-mute"); volumeIcon.classList.add("fa-volume-up"); } }
  
  // --- Progress Bar & Time Logic (Unchanged) ---
  function formatTime(seconds) { const minutes = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return `${minutes}:${secs.toString().padStart(2, "0")}`; }
  function updateProgress() { const { duration, currentTime } = audio; const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0; progressBar.style.width = `${progressPercent}%`; currentTimeEl.textContent = formatTime(currentTime); }
  function setDuration() { totalDurationEl.textContent = formatTime(audio.duration); }
  function setProgress(e) { const width = e.currentTarget.clientWidth; const clickX = e.offsetX; if (audio.duration) { audio.currentTime = (clickX / width) * audio.duration; } }
  
  // --- Event Listeners ---
  startOverlay.addEventListener('click', () => { fadeInPlay(); startOverlay.classList.add('hidden'); }, { once: true });
  playPauseBtn.addEventListener("click", () => { audio.paused ? fadeInPlay() : fadeOutPause(); });
  prevBtn.addEventListener("click", prevSong); // New listener
  nextBtn.addEventListener("click", nextSong); // New listener
  volumeBtn.addEventListener("click", () => { audio.muted = !audio.muted; });
  volumeSlider.addEventListener("input", (e) => { clearInterval(fadeInterval); targetVolume = parseFloat(e.target.value); audio.volume = targetVolume; audio.muted = false; });
  audio.addEventListener("play", syncUIWithAudio);
  audio.addEventListener("pause", syncUIWithAudio);
  audio.addEventListener("volumechange", updateVolumeIcon);
  audio.addEventListener("durationchange", setDuration);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", nextSong); // Autoplay next song when current one ends
  progressContainer.addEventListener("click", setProgress);

  // --- Slideshow Logic (Unchanged) ---
  const slideshowTrack = document.querySelector(".slideshow-track");
  if (slideshowTrack) {
    let slideshowInterval = null;
    const originalSlides = slideshowTrack.querySelectorAll(".slide-image");
    const slideCount = originalSlides.length;
    let currentIndex = 0;
    const firstClone = originalSlides[0].cloneNode(true);
    slideshowTrack.appendChild(firstClone);
    const allSlides = slideshowTrack.querySelectorAll(".slide-image");
    const totalSlides = allSlides.length;
    slideshowTrack.style.width = `${totalSlides * 100}%`;
    allSlides.forEach((slide) => { slide.style.width = `${100 / totalSlides}%`; });
    function nextSlide() { currentIndex++; const newTransformValue = -currentIndex * (100 / totalSlides); slideshowTrack.style.transform = `translateX(${newTransformValue}%)`; }
    slideshowTrack.addEventListener("transitionend", () => { if (currentIndex >= slideCount) { slideshowTrack.classList.add("no-transition"); currentIndex = 0; slideshowTrack.style.transform = `translateX(0%)`; setTimeout(() => { slideshowTrack.classList.remove("no-transition"); }, 50); } });
    function startSlideshow() { clearInterval(slideshowInterval); slideshowInterval = setInterval(nextSlide, 3000); }
    function stopSlideshow() { clearInterval(slideshowInterval); }
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { stopSlideshow(); } else { startSlideshow(); } });
    startSlideshow();
  }

  const titles = [
    "♡ Michu's Page ♡",
    "૮ ´• ﻌ ´• ა",
    "Welcome!",
    "⸜(｡˃ ᵕ ˂ )⸝♡",
  ];
  const comeBackTitle = "Come back! (´• ω •`) ♡";
  let titleIndex = 0;
  let titleInterval = null;

  function changeTitle() {
    document.title = titles[titleIndex];
    titleIndex = (titleIndex + 1) % titles.length;
  }

  function startTitleAnimation() {
    // Clear any existing timer to prevent duplicates
    clearInterval(titleInterval);
    // Start a new one
    titleInterval = setInterval(changeTitle, 2000);
  }

  function stopTitleAnimation() {
    clearInterval(titleInterval);
  }

  document.addEventListener('visibilitychange', () => {
    // If the document is hidden, stop the animation and show the "come back" message
    if (document.hidden) {
      stopTitleAnimation();
      document.title = comeBackTitle;
    } 
    // If the document is visible again, restart the animation
    else {
      startTitleAnimation();
    }
  });

  // Start the title animation for the first time
  startTitleAnimation();
});
