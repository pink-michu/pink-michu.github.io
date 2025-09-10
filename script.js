document.addEventListener('DOMContentLoaded', () => {

    // --- Particle Animation (unchanged) ---
    // ... (keep all the existing particle code here) ...
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    class Particle { constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 2 + 1; this.speedY = Math.random() * 1 + 0.5; this.opacity = Math.random() * 0.5 + 0.2; } update() { this.y += this.speedY; if (this.y > canvas.height) { this.y = 0 - this.size; this.x = Math.random() * canvas.width; } } draw() { ctx.fillStyle = `rgba(50, 50, 50, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } }
    function initParticles() { particles = []; const numberOfParticles = Math.floor(canvas.width / 40); for (let i = 0; i < numberOfParticles; i++) { particles.push(new Particle()); } }
    function animateParticles() { ctx.clearRect(0, 0, canvas.width, canvas.height); for (const particle of particles) { particle.update(); particle.draw(); } requestAnimationFrame(animateParticles); }
    resizeCanvas(); initParticles(); animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    // --- Audio and Volume Control ---
    const audio = document.getElementById('bg-music');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeIcon = volumeBtn.querySelector('i');
    const volumeSlider = document.getElementById('volume-slider');

    // --- NEW: Media Player Elements ---
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    
    // --- Existing Volume Logic ---
    audio.volume = volumeSlider.value;
    function updateVolumeIcon() { if (audio.paused || audio.volume === 0) { volumeIcon.classList.remove('fa-volume-up'); volumeIcon.classList.add('fa-volume-mute'); } else { volumeIcon.classList.remove('fa-volume-mute'); volumeIcon.classList.add('fa-volume-up'); } }
    volumeBtn.addEventListener('click', () => { if (audio.paused) { audio.play().catch(e => console.error(e)); } else { audio.pause(); } setTimeout(updateVolumeIcon, 100); });
    volumeSlider.addEventListener('input', () => { audio.volume = volumeSlider.value; updateVolumeIcon(); });
    audio.addEventListener('play', updateVolumeIcon);
    audio.addEventListener('pause', updateVolumeIcon);

    // --- NEW: Media Player Logic ---
    
    // Helper function to format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
    audio.addEventListener('loadedmetadata', setDuration);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);


    // --- Center Main Card on Mobile (unchanged) ---
    const cardSlider = document.querySelector('.card-slider');
    const mainCard = document.getElementById('main-card');
    if (cardSlider && mainCard && window.innerWidth < 1200) {
        const scrollLeft = mainCard.offsetLeft - (cardSlider.offsetWidth / 2) + (mainCard.offsetWidth / 2);
        cardSlider.scrollLeft = scrollLeft;
    }
});