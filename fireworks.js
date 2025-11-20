// 烟花应用主类
class FireworksApp {
    constructor() {
        this.canvas = document.getElementById('cvs');
        this.ctx = this.canvas.getContext('2d');
        this.rockets = [];
        this.particles = [];
        this.explosions = [];
        this.audioContext = null;
        this.lastAutoLaunch = 0;
        this.autoLaunchInterval = 400;
        
        // 管理器（移除背景管理器）
        this.musicManager = new MusicManager();
        this.fileManager = new FileManager();
        this.uiController = new UIController();
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.initMusic();
        this.animate();
    }
    
    initMusic() {
        this.musicManager.init();
        // 延迟播放音乐，避免浏览器的自动播放限制
        setTimeout(() => {
            this.musicManager.play();
        }, 1000);
    }
    
    setupCanvas() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    
    handleClick(e) {
        this.createRocket(e.clientX, e.clientY);
        this.hideHintText();
    }
    
    hideHintText() {
        const hintText = document.querySelector('.hint-text');
        if (hintText) {
            hintText.style.display = 'none';
        }
    }
    
    // 音频相关方法
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playExplosionSound() {
        if (!this.audioContext) return;
        
        const soundType = Math.random();
        
        if (soundType < 0.5) {
            this.createLargeExplosionSound();
        } else {
            this.createMediumExplosionSound();
        }
    }
    
    createLargeExplosionSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
        filter.Q.setValueAtTime(1, this.audioContext.currentTime);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.6);
    }
    
    createMediumExplosionSound() {
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        filter.Q.setValueAtTime(2, this.audioContext.currentTime);
        
        oscillator1.type = 'square';
        oscillator1.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.15);
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(350, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(120, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.35);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.35);
        oscillator2.stop(this.audioContext.currentTime + 0.35);
    }
    
    // 火箭和爆炸相关方法
    createRocket(targetX, targetY) {
        const rocket = new Rocket(targetX, this.canvas.height, targetX, targetY, this);
        this.rockets.push(rocket);
    }
    
    autoLaunch() {
        const now = Date.now();
        if (now - this.lastAutoLaunch > this.autoLaunchInterval) {
            const groupSize = Math.random() < 0.5 ? 2 : 3;
            for (let i = 0; i < groupSize; i++) {
                const sx = Math.random() * this.canvas.width;
                const tx = Math.random() * this.canvas.width;
                const ty = Math.random() * this.canvas.height * 0.5 + this.canvas.height * 0.1;
                
                this.rockets.push(new Rocket(sx, this.canvas.height, tx, ty, this));
            }
            this.lastAutoLaunch = now;
        }
    }
    
    animate() {
        // 透明背景处理，让body的背景图片显示
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 添加烟花轨迹的半透明覆盖效果（减少透明度以更好地显示背景）
        this.ctx.fillStyle = 'rgba(0,0,0,0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.autoLaunch();
        
        // 绘制爆炸光效（底层）
        this.updateAndDraw(this.explosions);
        this.updateAndDraw(this.rockets);
        this.updateAndDraw(this.particles);
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateAndDraw(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            const item = array[i];
            if (item.update()) {
                array.splice(i, 1);
            } else {
                item.draw();
            }
        }
    }
    
    addExplosion(x, y) {
        this.explosions.push(new ExplosionEffect(x, y));
    }
        
    addParticles(x, y, hue) {
        const count = 80 + Math.random() * 40;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5 + 0.5;
            const color = `hsl(${hue + (Math.random() * 40 - 20)}, 100%, ${Math.random() * 20 + 50}%)`;
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color));
        }
    }
}

// 烟花爆炸光效类
class ExplosionEffect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1;
        this.brightness = 1;
    }
    
    update() {
        this.life -= 0.05;
        this.brightness *= 0.9;
        return this.life <= 0;
    }
    
    draw() {
        const ctx = fireworksApp.ctx;
        ctx.save();
        ctx.globalAlpha = this.life * 0.6;
        
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, 60 * this.brightness
        );
        
        gradient.addColorStop(0, `rgba(255,255,255,${this.brightness * 1.2})`);
        gradient.addColorStop(0.3, `rgba(255,255,200,${this.brightness * 0.8})`);
        gradient.addColorStop(0.7, `rgba(255,255,255,${this.brightness * 0.4})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            this.x - 60 * this.brightness,
            this.y - 60 * this.brightness,
            120 * this.brightness,
            120 * this.brightness
        );
        
        ctx.restore();
    }
}