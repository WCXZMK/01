// 配置模块（移除背景配置）
const FireworksConfig = {
    // 音乐配置
    music: {
        enabled: true,
        volume: 0.3, // 音量 0-1
        tracks: [
            // 默认音乐列表，可以添加更多
            {
                name: '默认背景音乐',
                url: '', // 音乐文件URL
                loop: true
            }
        ]
    },
    
    // 文件资源路径配置
    resources: {
        images: {
            path: './images/',
            supported: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
        },
        audios: {
            path: './audios/',
            supported: ['mp3', 'wav', 'ogg', 'm4a', 'aac']
        }
    },
    
    // 设置方法
    addMusicTrack(name, url, loop = true) {
        this.music.tracks.push({ name, url, loop });
    },
    
    setVolume(volume) {
        this.music.volume = Math.max(0, Math.min(1, volume));
    },
    
    // 获取支持的文件类型
    getSupportedImageTypes() {
        return this.resources.images.supported;
    },
    
    getSupportedAudioTypes() {
        return this.resources.audios.supported;
    },
    
    // 检查文件类型是否支持
    isImageTypeSupported(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return this.resources.images.supported.includes(ext);
    },
    
    isAudioTypeSupported(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return this.resources.audios.supported.includes(ext);
    }
};