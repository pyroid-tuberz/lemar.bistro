'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
    name: string;
    description?: string;
    price: string;
    category: string;
}

interface Category {
    name: string;
    parent: string | null;
    color: string;
    size: string;
}

interface MenuData {
    items: MenuItem[];
    categories: Record<string, Category>;
}

export default function MenuSystem({ initialData }: { initialData: MenuData }) {
    const [historyStack, setHistoryStack] = useState<string[]>(['root']);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<MenuItem[]>([]);

    const currentPanelId = searchQuery ? 'search-results' : historyStack[historyStack.length - 1];

    const navigateTo = (panelId: string) => {
        setHistoryStack(prev => {
            if (prev[prev.length - 1] === panelId) return prev;
            return [...prev, panelId];
        });
        setSearchQuery('');
    };

    const goBack = () => {
        if (historyStack.length > 1) {
            setHistoryStack(prev => prev.slice(0, -1));
        }
    };

    const goHome = () => {
        setHistoryStack(['root']);
        setSearchQuery('');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const q = query.toLowerCase().trim();
        if (q.length === 0) {
            setSearchResults([]);
            return;
        }
        const filtered = initialData.items.filter(item =>
            (item.name && item.name.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q))
        );
        setSearchResults(filtered);
    };

    const priorityMap: Record<string, number> = {
        'yi-yecek-ler': 1, 'yi-yecekler': 1, 'yiyecekler': 1,
        'i-ce-cek-ler': 2, 'i-cecekler': 2, 'icecekler': 2,
        'tatli-lar': 3, 'tatlilar': 3,
        'kla-sik-ler': 4, 'kla-sikler': 4, 'klasikler': 4,
        'nargi-le': 5, 'nargile': 5,
        'atistirmaliklar': 6, 'sepetler': 7, 'mezeler': 50
    };

    const categories = initialData.categories;
    const items = initialData.items;

    const hierarchy: Record<string, string[]> = {};
    Object.keys(categories).forEach(catId => {
        if (catId === 'root') return;
        const parent = categories[catId].parent || 'root';
        if (!hierarchy[parent]) hierarchy[parent] = [];
        hierarchy[parent].push(catId);
    });

    return (
        <div className="menu-system" style={{ position: 'relative' }}>
            <div className="search-container">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Ürün Ara... (Örn: Votka, Burger)"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div id="menu-nav-bar" style={{ display: currentPanelId === 'root' ? 'none' : 'flex', padding: '0 20px 10px 20px', gap: '10px', zIndex: 100, position: 'relative' }}>
                <button onClick={goBack} className="nav-control-btn">← Geri</button>
                <button onClick={goHome} className="nav-control-btn">⌂ Ana Menü</button>
            </div>

            {Object.keys(categories).map(catId => {
                const isActive = currentPanelId === catId;
                const cat = categories[catId];
                const sortedSubIds = (hierarchy[catId] || []).sort((a, b) => {
                    const pA = priorityMap[a.toLowerCase()] || 10;
                    const pB = priorityMap[b.toLowerCase()] || 10;
                    return pA - pB;
                });

                const panelItems = items.filter(i => {
                    if (!i.category) return false;
                    const itemCat = i.category.toLowerCase();
                    const targetCat = catId.toLowerCase();
                    return itemCat === targetCat || itemCat === targetCat + '-list' || targetCat === itemCat + '-list';
                });

                return (
                    <div key={catId} id={`panel-${catId}`} className={`menu-panel ${isActive ? 'is-active' : ''}`} style={{ display: isActive ? 'block' : 'none' }}>
                        <h2 className="panel-title">{cat.name}</h2>
                        {sortedSubIds.length > 0 && (
                            <div className="main-menu">
                                {sortedSubIds.map(subId => {
                                    const subCat = categories[subId];
                                    return (
                                        <button
                                            key={subId}
                                            className={`nav-button ${subCat.name.length >= 9 ? 'long-text' : ''}`}
                                            style={{ borderColor: subCat.color || 'var(--primary)', color: subCat.color || 'var(--primary)' }}
                                            onClick={() => navigateTo(subId)}
                                        >
                                            <span>{subCat.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {panelItems.length > 0 && (
                            <div className="menu-item-list">
                                {panelItems.map((item, idx) => (
                                    <div key={idx} className="menu-item">
                                        <div className="menu-item-header">
                                            <h3 className="menu-item-name">{item.name}</h3>
                                            <span className="menu-item-price">{item.price}</span>
                                        </div>
                                        {item.description && <p className="menu-item-description">{item.description}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {currentPanelId === 'search-results' && (
                <div id="panel-search-results" className="menu-panel is-active">
                    <h2 className="panel-title">Arama Sonuçları</h2>
                    {searchResults.length > 0 ? (
                        <div className="menu-item-list">
                            {searchResults.map((item, idx) => (
                                <div key={idx} className="menu-item">
                                    <div className="menu-item-header">
                                        <h3 className="menu-item-name">{item.name}</h3>
                                        <span className="menu-item-price">{item.price}</span>
                                    </div>
                                    {item.description && <p className="menu-item-description">{item.description}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'white' }}>Sonuç bulunamadı.</p>
                    )}
                </div>
            )}
        </div>
    );
}
