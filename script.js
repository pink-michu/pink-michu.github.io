document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      // Set initial position and properties
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 2; // Snowflakes can be bigger
      this.speedY = Math.random() * 1.5 + 0.5; // Varies falling speed
      this.speedX = Math.random() * 2 - 1; // Horizontal drift
      this.opacity = Math.random() * 0.5 + 0.3;

      // Properties for rotation
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.02; // How fast and which direction it spins
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.angle += this.spin;

      // Reset particle when it goes off screen
      if (this.y > canvas.height + this.size) {
        this.y = 0 - this.size;
        this.x = Math.random() * canvas.width;
      }
      if (this.x > canvas.width + this.size) {
        this.x = 0 - this.size;
      }
      if (this.x < 0 - this.size) {
        this.x = canvas.width + this.size;
      }
    }

    draw() {
      ctx.save(); // Save the current canvas state

      // Move the canvas origin to the particle's position for easy rotation
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Set snowflake color
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = 1.5;

      // Draw the 6 arms of the snowflake
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.size); // Draw the main arm
        // You can add more lines here for more complex snowflakes
        ctx.rotate(Math.PI / 3); // Rotate for the next arm
      }

      ctx.stroke(); // Use stroke for a delicate line-art look
      ctx.restore(); // Restore the canvas state
    }
  }

  function initParticles() {
    particles = [];
    // More particles for a snowier effect
    const numberOfParticles = Math.floor(canvas.width / 15);
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  // --- Audio and Volume Control ---
  const audio = document.getElementById("bg-music");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeIcon = volumeBtn.querySelector("i");
  const volumeSlider = document.getElementById("volume-slider");

  // --- NEW: Media Player Elements ---
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const totalDurationEl = document.getElementById("total-duration");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playPauseIcon = playPauseBtn.querySelector("i");

  const spinningThumbnail = document.getElementById("spinning-thumbnail");

  // --- Existing Volume Logic ---
  audio.volume = volumeSlider.value;
  function updateVolumeIcon() {
    if (audio.paused || audio.volume === 0) {
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    } else {
      volumeIcon.classList.remove("fa-volume-mute");
      volumeIcon.classList.add("fa-volume-up");
    }
  }
  volumeBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch((e) => console.error(e));
    } else {
      audio.pause();
    }
    setTimeout(updateVolumeIcon, 100);
  });
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    updateVolumeIcon();
  });
  audio.addEventListener("play", updateVolumeIcon);
  audio.addEventListener("pause", updateVolumeIcon);

  // --- NEW: Media Player Logic ---

  function updatePlayPauseIcon() {
    if (audio.paused) {
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
    } else {
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
    }
  }

  // Helper function to format time in MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  // Update progress bar and time displays
  function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }

  // Set song duration when metadata loads
  function setDuration() {
    totalDurationEl.textContent = formatTime(audio.duration);
  }

  // Set progress bar when user clicks
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  }

  // --- NEW: Event Listeners for Media Player ---
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      spinningThumbnail.classList.add("spinning"); // Add this line
      audio.play().catch((e) => console.error(e));
    } else {
      spinningThumbnail.classList.remove("spinning"); // Add this line
      audio.pause();
    }
  });
  audio.addEventListener("play", updatePlayPauseIcon);
  audio.addEventListener("pause", updatePlayPauseIcon);
  audio.addEventListener("loadedmetadata", setDuration);
  audio.addEventListener("timeupdate", updateProgress);
  progressContainer.addEventListener("click", setProgress);

  // --- Initialize icon state ---
  updatePlayPauseIcon();

  const slideshowTrack = document.querySelector(".slideshow-track");

  if (slideshowTrack) {
    const originalSlides = slideshowTrack.querySelectorAll(".slide-image");
    const slideCount = originalSlides.length;
    let currentIndex = 0;

    // 1. Clone the first slide and append it to the end
    const firstClone = originalSlides[0].cloneNode(true);
    slideshowTrack.appendChild(firstClone);

    // Get the new collection of all slides (including the clone)
    const allSlides = slideshowTrack.querySelectorAll(".slide-image");
    const totalSlides = allSlides.length;

    // 2. Set the track and slide widths dynamically
    slideshowTrack.style.width = `${totalSlides * 100}%`;
    allSlides.forEach((slide) => {
      slide.style.width = `${100 / totalSlides}%`;
    });

    // 3. Listen for the end of the transition
    slideshowTrack.addEventListener("transitionend", () => {
      // If we are at the cloned slide (which is the last one)
      if (currentIndex >= slideCount) {
        // Instantly jump back to the real first slide
        slideshowTrack.classList.add("no-transition"); // Disable transition
        currentIndex = 0; // Reset index
        slideshowTrack.style.transform = `translateX(0%)`; // Jump

        // Use a tiny timeout to re-enable the transition AFTER the jump
        setTimeout(() => {
          slideshowTrack.classList.remove("no-transition");
        }, 50);
      }
    });

    function nextSlide() {
      // Move to the next index
      currentIndex++;

      // Calculate the new position to move the track
      const newTransformValue = -currentIndex * (100 / totalSlides);

      // Apply the transformation to slide the images
      slideshowTrack.style.transform = `translateX(${newTransformValue}%)`;
    }

    // Change image every 3 seconds
    setInterval(nextSlide, 3000);
  }
});
