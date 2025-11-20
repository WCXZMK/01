// 文件管理器 - 处理本地文件加载和管理
class FileManager {
    constructor() {
        this.images = [];
        this.audios = [];
        this.loadLocalFiles();
    }
    
    // 加载本地文件列表
    loadLocalFiles() {
        // 扫描本地images和audios文件夹
        this.scanLocalDirectory('images');
        this.scanLocalDirectory('audios');
    }
    
    // 扫描本地目录
    scanLocalDirectory(type) {
        const path = type === 'images' ? './images/' : './audios/';
        const supported = type === 'images' ? 
            FireworksConfig.getSupportedImageTypes() : 
            FireworksConfig.getSupportedAudioTypes();
        
        // 这里将通过AJAX请求获取服务器上的文件列表
        // 由于浏览器安全限制，我们需要使用HTTP服务器
        this.simulateLocalFiles(type, path, supported);
    }
    
    // 模拟本地文件（实际使用时需要服务器支持）
    simulateLocalFiles(type, path, supported) {
        // 在实际应用中，这里应该发送AJAX请求到服务器
        // 获取真实的文件列表
        console.log(`扫描${type}目录: ${path}`);
        
        // 这里可以添加一些示例文件
        if (type === 'images') {
            // this.addImageFile('example.jpg', path + 'example.jpg');
        } else {
            // this.addAudioFile('example.mp3', path + 'example.mp3');
        }
    }
    
    // 添加图片文件
    addImageFile(filename, url) {
        if (FireworksConfig.isImageTypeSupported(filename)) {
            this.images.push({
                name: filename,
                url: url,
                type: 'image'
            });
            return true;
        }
        return false;
    }
    
    // 添加音频文件
    addAudioFile(filename, url) {
        if (FireworksConfig.isAudioTypeSupported(filename)) {
            this.audios.push({
                name: filename,
                url: url,
                type: 'audio'
            });
            return true;
        }
        return false;
    }
    
    // 处理文件上传
    handleFileUpload(file, type) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('没有选择文件');
                return;
            }
            
            // 检查文件类型
            const isSupported = type === 'image' ? 
                FireworksConfig.isImageTypeSupported(file.name) :
                FireworksConfig.isAudioTypeSupported(file.name);
            
            if (!isSupported) {
                reject(`不支持的文件类型: ${file.name}`);
                return;
            }
            
            // 创建文件URL
            const url = URL.createObjectURL(file);
            
            // 添加到相应的列表
            if (type === 'image') {
                this.addImageFile(file.name, url);
            } else {
                this.addAudioFile(file.name, url);
            }
            
            resolve({
                name: file.name,
                url: url,
                size: file.size,
                type: type
            });
        });
    }
    
    // 获取图片列表
    getImages() {
        return this.images;
    }
    
    // 获取音频列表
    getAudios() {
        return this.audios;
    }
    
    // 删除文件
    removeFile(filename, type) {
        if (type === 'image') {
            this.images = this.images.filter(img => img.name !== filename);
        } else {
            this.audios = this.audios.filter(audio => audio.name !== filename);
        }
    }
    
    // 清空所有文件
    clearAll() {
        // 释放所有对象URL
        [...this.images, ...this.audios].forEach(file => {
            if (file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url);
            }
        });
        
        this.images = [];
        this.audios = [];
    }
}