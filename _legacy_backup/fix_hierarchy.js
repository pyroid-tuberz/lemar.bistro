
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'menu.json');

try {
    const dataStr = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(dataStr);

    // Fix parents
    const corrections = {
        'ana-yemekler': 'yiyecekler',
        'kahvalti-list': 'yiyecekler',
        'burger-wrap-list': 'yiyecekler',
        'atistirmaliklar-list': 'yiyecekler',
        'makarnalar-list': 'yiyecekler',
        'pizzalar-list': 'yiyecekler',
        'salatalar-list': 'yiyecekler',
        'et-yemekleri-list': 'ana-yemekler',
        'tavuk-yemekleri-list': 'ana-yemekler',
        'mezeler-list': 'yiyecekler',
        'izgaralar-list': 'ana-yemekler',
        'tatlilar-list': 'yiyecekler',

        'alkollu-icecekler': 'icecekler',
        'alkolsuz-icecekler': 'icecekler',
        'soguk-icecekler-list': 'alkolsuz-icecekler',
        'bira-list': 'alkollu-icecekler',
        'ozel-karisimlar-list': 'alkolsuz-icecekler',
        'kokteyl-list': 'alkollu-icecekler',
        'shot-list': 'alkollu-icecekler',
        'sarap-list': 'alkollu-icecekler',

        'nargile-list': 'root'
    };

    for (const [id, newParent] of Object.entries(corrections)) {
        if (data.categories[id]) {
            data.categories[id].parent = newParent;
        }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Hierarchy fixed.');

} catch (err) {
    console.error('Fix failed:', err);
}
