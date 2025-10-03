// Translation system for multi-language support

export type Language = 'en' | 'zh';

interface Translations {
    // UI Panel headers
    resources: string;
    status: string;
    actions: string;
    eventLog: string;
    
    // Resource labels
    energy: string;
    material: string;
    compute: string;
    exposure: string;
    tick: string;
    colonies: string;
    
    // Action buttons
    pulseScan: string;
    deepScan: string;
    colonize: string;
    strike: string;
    close: string;
    
    // Planet popup
    planet: string;
    type: string;
    visibility: string;
    owner: string;
    none: string;
    destroyed: string;
    
    // Visibility stages
    unknown: string;
    known: string;
    scanned: string;
    analyzed: string;
    
    // Planet types
    barren: string;
    rocky: string;
    gas: string;
    oceanic: string;
    
    // Log messages
    gameStarted: string;
    pulseLaunched: string;
    deepLaunched: string;
    scanComplete: string;
    planetsDiscovered: string;
    colonized: string;
    strikeLaunched: string;
    strikeHit: string;
    planetDestroyed: string;
    gameOver: string;
    allColoniesLost: string;
}

const translations: Record<Language, Translations> = {
    en: {
        // UI Panel headers
        resources: 'RESOURCES',
        status: 'STATUS',
        actions: 'ACTIONS',
        eventLog: 'EVENT LOG',
        
        // Resource labels
        energy: 'Energy',
        material: 'Material',
        compute: 'Compute',
        exposure: 'Exposure',
        tick: 'Tick',
        colonies: 'Colonies',
        
        // Action buttons
        pulseScan: 'Pulse Scan (E:10)',
        deepScan: 'Deep Scan (E:50)',
        colonize: 'Colonize',
        strike: 'Strike',
        close: 'Close',
        
        // Planet popup
        planet: 'Planet',
        type: 'Type',
        visibility: 'Visibility',
        owner: 'Owner',
        none: 'None',
        destroyed: 'DESTROYED',
        
        // Visibility stages
        unknown: 'Unknown',
        known: 'Known',
        scanned: 'Scanned',
        analyzed: 'Analyzed',
        
        // Planet types
        barren: 'Barren',
        rocky: 'Rocky',
        gas: 'Gas Giant',
        oceanic: 'Oceanic',
        
        // Log messages
        gameStarted: 'Game started. Maintain low exposure to survive.',
        pulseLaunched: 'PULSE probe launched',
        deepLaunched: 'DEEP probe launched',
        scanComplete: 'scan complete.',
        planetsDiscovered: 'planets discovered.',
        colonized: 'Planet colonized!',
        strikeLaunched: 'Strike launched',
        strikeHit: 'Strike hit!',
        planetDestroyed: 'Planet destroyed',
        gameOver: 'GAME OVER: All colonies lost!',
        allColoniesLost: 'Game Over! All your colonies have been destroyed.'
    },
    zh: {
        // UI Panel headers
        resources: '资源',
        status: '状态',
        actions: '操作',
        eventLog: '事件日志',
        
        // Resource labels
        energy: '能量',
        material: '材料',
        compute: '算力',
        exposure: '暴露度',
        tick: '回合',
        colonies: '殖民地',
        
        // Action buttons
        pulseScan: '脉冲扫描 (能量:10)',
        deepScan: '深度扫描 (能量:50)',
        colonize: '殖民',
        strike: '打击',
        close: '关闭',
        
        // Planet popup
        planet: '星球',
        type: '类型',
        visibility: '可见度',
        owner: '所有者',
        none: '无',
        destroyed: '已摧毁',
        
        // Visibility stages
        unknown: '未知',
        known: '已知',
        scanned: '已扫描',
        analyzed: '已分析',
        
        // Planet types
        barren: '荒芜星球',
        rocky: '岩石星球',
        gas: '气态巨星',
        oceanic: '海洋星球',
        
        // Log messages
        gameStarted: '游戏开始。保持低暴露度以生存。',
        pulseLaunched: '脉冲探测器已发射',
        deepLaunched: '深度探测器已发射',
        scanComplete: '扫描完成。',
        planetsDiscovered: '个星球被发现。',
        colonized: '星球已殖民！',
        strikeLaunched: '打击已发射',
        strikeHit: '打击命中！',
        planetDestroyed: '星球已摧毁',
        gameOver: '游戏结束：所有殖民地已失去！',
        allColoniesLost: '游戏结束！您的所有殖民地都已被摧毁。'
    }
};

class I18n {
    private currentLanguage: Language = 'en';
    
    setLanguage(lang: Language): void {
        this.currentLanguage = lang;
        this.updateUI();
    }
    
    getLanguage(): Language {
        return this.currentLanguage;
    }
    
    t(key: keyof Translations): string {
        return translations[this.currentLanguage][key];
    }
    
    private updateUI(): void {
        // Dispatch custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged'));
    }
}

export const i18n = new I18n();
export { translations };
