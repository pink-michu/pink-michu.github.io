document.addEventListener('DOMContentLoaded', () => {

    // --- Particle Animation (unchanged) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.y += this.speedY;
            if (this.y > canvas.height) {
                this.y = 0 - this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(50, 50, 50, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numberOfParticles = Math.floor(canvas.width / 40);
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
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // --- NEW: Audio and Volume Control Logic ---
    const audio = document.getElementById('bg-music');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeIcon = volumeBtn.querySelector('i');
    const volumeSlider = document.getElementById('volume-slider');

    // Set initial volume from slider's default value
    audio.volume = volumeSlider.value;

    // Function to update the icon based on audio state
    function updateVolumeIcon() {
        if (audio.paused || audio.volume === 0) {
            volumeIcon.classList.remove('fa-volume-up');
            volumeIcon.classList.add('fa-volume-mute');
        } else {
            volumeIcon.classList.remove('fa-volume-mute');
            volumeIcon.classList.add('fa-volume-up');
        }
    }

    // Event listener for the play/pause button
    volumeBtn.addEventListener('click', () => {
        // Important: Browsers require user interaction to play audio first.
        if (audio.paused) {
            audio.play().catch(error => {
                console.error("Audio playback failed:", error);
            });
        } else {
            audio.pause();
        }
        // Update icon after a short delay to sync with audio state change
        setTimeout(updateVolumeIcon, 100);
    });

    // Event listener for the volume slider
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        updateVolumeIcon();
    });
    
    // Also update icon when music ends or is paused by other means
    audio.addEventListener('play', updateVolumeIcon);
    audio.addEventListener('pause', updateVolumeIcon);

});