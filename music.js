// 音乐管理器
class MusicManager {
    constructor() {
        this.audio = null;
        this.currentTrack = 0;
        this.isPlaying = false;
        this.localTracks = []; // 本地音乐列表
        this.loadLocalTracks();
    }
    
    // 加载本地音乐列表
    loadLocalTracks() {
        // 这里将通过文件管理器获取本地音乐
        this.localTracks = [];
    }
    
    init() {
        if (!FireworksConfig.music.enabled) return;
        
        this.audio = new Audio();
        this.audio.volume = FireworksConfig.music.volume;
        
        this.loadTrack(0);
    }
    
    loadTrack(index) {
        const tracks = FireworksConfig.music.tracks;
        if (!tracks || tracks.length === 0 || index >= tracks.length) return;
        
        const track = tracks[index];
        if (!track.url) return;
        
        this.audio.src = track.url;
        this.audio.loop = track.loop;
        this.currentTrack = index;
    }
    
    play() {
        if (!this.audio || !FireworksConfig.music.enabled) return;
        
        this.audio.play().catch(error => {
            console.warn('音乐播放失败:', error);
        });
        this.isPlaying = true;
    }
    
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }
    
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
        }
    }
    
    nextTrack() {
        const tracks = FireworksConfig.music.tracks;
        if (tracks.length === 0) return;
        
        this.currentTrack = (this.currentTrack + 1) % tracks.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.play();
    }
    
    previousTrack() {
        const tracks = FireworksConfig.music.tracks;
        if (tracks.length === 0) return;
        
        this.currentTrack = (this.currentTrack - 1 + tracks.length) % tracks.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.play();
    }
    
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    // 添加本地音乐
    addLocalTrack(filename, url) {
        const trackName = filename.replace(/\.[^/.]+$/, ""); // 移除扩展名
        this.localTracks.push({
            name: trackName,
            url: url,
            loop: true
        });
        
        // 添加到配置中
        FireworksConfig.addMusicTrack(trackName, url);
    }
    
    // 获取本地音乐列表
    getLocalTracks() {
        return this.localTracks;
    }
    
    // 获取当前播放的音乐信息
    getCurrentTrackInfo() {
        const tracks = FireworksConfig.music.tracks;
        if (tracks.length > 0 && this.currentTrack < tracks.length) {
            return tracks[this.currentTrack];
        }
        return null;
    }
}