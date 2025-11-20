// 火箭类
class Rocket {
    constructor(sx, sy, tx, ty, app) {
        this.x = sx;
        this.y = sy;
        this.tx = tx;
        this.ty = ty;
        this.app = app;
        this.vy = -5;
        this.vx = Math.sign(tx - sx) * Math.abs(this.vy) * 0.25;
        this.trail = [];
        this.waveOffset = Math.random() * Math.PI * 2;
        this.waveAmplitude = 0.2;
        this.waveFrequency = 0.05;
        this.time = 0;
    }
    
    update() {
        this.time++;
        
        // 计算蛇形运动的横向偏移（只影响Y方向，X保持垂直）
        const waveOffsetY = Math.sin(this.time * this.waveFrequency + this.waveOffset) * this.waveAmplitude;
        
        // 应用垂直速度（保持x坐标不变，只移动y坐标）
        this.y += this.vy;
        
        // 应用蛇形偏移（只影响Y方向）
        this.y += waveOffsetY;
        
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 20) this.trail.shift();
        
        // 当达到目标高度时爆炸（只检查y坐标）
        if (this.y <= this.ty) {
            this.explode();
            return true;
        }
        return false;
    }
    
    explode() {
        this.app.initAudio();
        this.app.playExplosionSound();
        this.app.addExplosion(this.x, this.ty);
        
        // 增加粒子数量但减小每个粒子的大小和速度，使爆炸更细腻
        const count = 80 + Math.random() * 40;
        // 选择一个主色调，使爆炸颜色更协调
        const hue = Math.random() * 360;
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            // 进一步减小速度，缩小爆炸范围
            const speed = Math.random() * 1.5 + 0.5;
            // 围绕主色调生成相似的颜色
            const color = `hsl(${hue + (Math.random() * 40 - 20)}, 100%, ${Math.random() * 20 + 50}%)`;
            this.app.particles.push(new Particle(this.x, this.ty, Math.cos(angle) * speed, Math.sin(angle) * speed, color));
        }
    }
    
    draw() {
        const ctx = this.app.ctx;
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < this.trail.length - 1; i++) {
            ctx.moveTo(this.trail[i].x, this.trail[i].y);
            ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
        }
        
        ctx.stroke();
        ctx.restore();
    }
}

// 粒子类
class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.color = color || `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.drag = 0.97;
        this.lifeDecay = Math.random() * 0.01 + 0.005;
    }
    
    update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.03;
        this.life -= this.lifeDecay;
        
        return this.life <= 0;
    }
    
    draw() {
        const ctx = fireworksApp.ctx;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        const size = Math.random() * 4 + 2;
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        
        ctx.fill();
        ctx.restore();
    }
}