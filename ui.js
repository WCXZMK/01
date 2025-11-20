// UI控制器 - 处理控制面板和用户交互
class UIController {
    constructor() {
        this.controlPanel = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupControlPanelEvents();
    }
    
    // 设置拖拽功能
    setupDragAndDrop() {
        const controlPanel = document.getElementById('controlPanel');
        if (!controlPanel) return;
        
        this.controlPanel = controlPanel;
        
        // 为控制面板添加拖拽功能
        controlPanel.addEventListener('mousedown', (e) => {
            // 只在点击标题栏时开始拖拽
            if (e.target.tagName === 'H3' || e.target.closest('h3')) {
                this.startDrag(e);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.drag(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.stopDrag();
        });
    }
    
    startDrag(e) {
        this.isDragging = true;
        const rect = this.controlPanel.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        this.controlPanel.style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // 确保面板不会拖出屏幕
        const maxX = window.innerWidth - this.controlPanel.offsetWidth;
        const maxY = window.innerHeight - this.controlPanel.offsetHeight;
        
        this.controlPanel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.controlPanel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        this.controlPanel.style.right = 'auto';
    }
    
    stopDrag() {
        this.isDragging = false;
        if (this.controlPanel) {
            this.controlPanel.style.cursor = 'default';
        }
    }
    
    // 设置控制面板事件
    setupControlPanelEvents() {
        // 音乐控制事件（移除背景设置事件）
        this.setupMusicEvents();
        
        // 预设事件
        this.setupPresetEvents();
    }
    

    
    setupMusicEvents() {
        // 音量滑块
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeDisplay = document.getElementById('volumeDisplay');
        
        if (volumeSlider && volumeDisplay) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                FireworksConfig.setVolume(volume);
                volumeDisplay.textContent = e.target.value + '%';
                
                // 更新音乐管理器音量
                if (window.fireworksApp && window.fireworksApp.musicManager) {
                    window.fireworksApp.musicManager.setVolume(volume);
                }
            });
        }
        
        // 音乐URL输入
        const musicUrl = document.getElementById('musicUrl');
        if (musicUrl) {
            musicUrl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addMusicTrack(e.target.value);
                    e.target.value = '';
                }
            });
        }
    }
    
    setupPresetEvents() {
        // 预设按钮事件将在主应用中设置
    }
    
    // 应用背景图片
    applyBackgroundImage(url) {
        if (!url) return;
        
        FireworksConfig.setBackgroundImage(url);
        
        // 清空输入框
        const bgImageUrl = document.getElementById('bgImageUrl');
        if (bgImageUrl) {
            bgImageUrl.value = '';
        }
    }
    
    // 添加音乐轨道
    addMusicTrack(url) {
        if (!url) return;
        
        const trackName = this.extractFilenameFromUrl(url);
        FireworksConfig.addMusicTrack(trackName, url);
        
        // 更新音乐管理器
        if (window.fireworksApp && window.fireworksApp.musicManager) {
            window.fireworksApp.musicManager.loadTrack(FireworksConfig.music.tracks.length - 1);
        }
    }
    
    // 从URL提取文件名
    extractFilenameFromUrl(url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.split('.')[0] || '未知音乐';
    }
    
    // 显示提示信息
    showMessage(message, type = 'info') {
        // 创建提示元素
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(messageEl);
        
        // 3秒后移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
}