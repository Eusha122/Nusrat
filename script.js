// Setup Particles
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 50; i++) particles.push(new Particle());
}
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// Application Logic
document.addEventListener('DOMContentLoaded', () => {
    // Audio Elements
    const bgMusic = document.getElementById('bg-music');
    const narration = document.getElementById('narration-audio');
    const musicToggle = document.getElementById('bg-music-toggle');
    const playNarrationBtn = document.getElementById('play-narration');

    // Set Audio Volume
    bgMusic.volume = 0.3;

    // Landing Typewriter
    gsap.to(".typing-text", {
        text: {
            value: "Hey Nusrat… I want to tell you something honestly.",
            delimiter: ""
        },
        duration: 4,
        ease: "none",
        delay: 1
    });

    // Start Button Logic
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
        // Try playing music (user interaction required)
        bgMusic.play().catch(e => console.log("Audio autoplay prevented"));

        // Transition to next section
        gsap.to("#landing", {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.getElementById('landing').classList.remove('active');
                document.getElementById('letter-reveal').classList.add('active');

                // Animate envelope entrance
                gsap.from(".envelope", {
                    y: 50,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.out"
                });
            }
        });
    });

    // Music Toggle
    let isMusicPlaying = false;
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.style.opacity = 1;
        } else {
            bgMusic.pause();
            musicToggle.style.opacity = 0.5;
        }
    });

    // Envelope Interaction
    const envelope = document.getElementById('envelope');
    const letterSection = document.getElementById('letter-reveal');
    let isOpened = false;

    envelope.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        envelope.classList.add('open');
        letterSection.classList.add('reading');

        // Ensure BG music is playing if it wasn't
        bgMusic.play().catch(() => { });
        bgMusic.volume = 0.1; // Duck background music

        // Auto-play Narration
        narration.play().catch(e => console.log("Narration autoplay prevented", e));

        // Animate text reveal inside
        gsap.from(".letter-content p", {
            y: 20,
            opacity: 0,
            stagger: 0.3, // Slow stagger for reading pacing
            delay: 0.8,
            duration: 1
        });

        // Show controls separately
        gsap.to(".controls", {
            opacity: 1,
            delay: 3, // Delay until some text is read
            duration: 1
        });
    });

    narration.onended = () => {
        bgMusic.volume = 0.3;
    };

    // Transition to Choice
    document.getElementById('next-to-choice').addEventListener('click', () => {
        // Stop narration if playing
        narration.pause();
        narration.currentTime = 0;
        bgMusic.volume = 0.3; // Restore bg music

        gsap.to("#letter-reveal", {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.getElementById('letter-reveal').classList.remove('active');
                document.getElementById('choice').classList.add('active');

                // Animate card entrance
                gsap.from(".glass-card", {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    delay: 0.5
                });
            }
        });
    });

    // Final Choice Logic: YES
    document.getElementById('btn-yes').addEventListener('click', () => {
        transitionToFinal('final-accept');
    });

    // Final Choice Logic: NO
    document.getElementById('btn-no').addEventListener('click', () => {
        transitionToFinal('final-reject');
    });

    function transitionToFinal(targetId) {
        gsap.to("#choice", {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.getElementById('choice').classList.remove('active');
                const finalSection = document.getElementById(targetId);
                finalSection.classList.add('active');

                gsap.from(`#${targetId} h2`, {
                    opacity: 0,
                    y: 20,
                    duration: 1.5,
                    delay: 0.5
                });
            }
        });
    }
});
