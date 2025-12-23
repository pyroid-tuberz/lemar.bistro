
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'menu.json');

try {
    const dataStr = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(dataStr);

    const newCategories = {};

    // Hardcoded hierarchy map based on common knowledge of the menu or defaults
    // Since we don't have the explicit hierarchy in the old json, we will default to 'root'
    // and try to map known parents.

    for (const [id, name] of Object.entries(data.categories)) {
        if (typeof name === 'object') {
            // Already migrated?
            newCategories[id] = name;
            continue;
        }

        let parent = 'root';
        if (id === 'root') parent = null;

        // Educated guesses for hierarchy based on IDs
        if (['kahvalti-list', 'burger-wrap-list', 'atistirmaliklar-list', 'makarnalar-list', 'pizzalar-list', 'salatalar-list', 'et-yemekleri-list', 'tavuk-yemekleri-list', 'mezeler-list', 'izgaralar-list'].includes(id)) {
            parent = 'yiyecekler-panel'; // Assuming a generic food parent or just root
        }

        // Actually, let's keep it simple. Default everything to 'root' EXCEPT 'yiyecekler', 'icecekler' etc.
        // The user can rearrange them in the new Admin UI.
        // Wait, 'yiyecekler' and 'icecekler' seem like main categories.

        let color = '#FFC700'; // Default yellow

        newCategories[id] = {
            name: name,
            parent: parent,
            color: color,
            size: 'normal'
        };
    }

    // Ensure root exists properly
    if (!newCategories['root']) {
        newCategories['root'] = { name: "Menü", parent: null, color: "#FFC700", size: "normal" };
    } else {
        newCategories['root'].parent = null;
    }

    data.categories = newCategories;

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Migration complete.');

} catch (err) {
    console.error('Migration failed:', err);
}
