
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Use promises for easier async/await
const path = require('path');
const cors = require('cors');

const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'menu.json');
const GALLERY_FILE = path.join(__dirname, 'gallery.json');
const BACKGROUNDS_FILE = path.join(__dirname, 'backgrounds.json');
const DATA_JS_FILE = path.join(__dirname, 'data.js'); // New: Target for portable data

// Multer Config for Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Sanitize filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
// Serve root static files
app.use(express.static(__dirname));
// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to check basic auth (Simulated for simplicity)
// In production, use sessions/JWT and HTTPS
const checkAuth = (req, res, next) => {
    // For this simple implementation, we'll verify a header or cookie
    // But since we are doing a simple fetch-based login, let's just use a secret token
    const token = req.headers['authorization'];
    if (token === 'Bearer lemara-secret-admin-token') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// --- HELPER: Sync JSON to data.js for Portable Mode ---
async function updateDataJs() {
    try {
        const [menu, gallery, backgrounds] = await Promise.all([
            fs.readFile(DATA_FILE, 'utf8').catch(() => '{"items":[],"categories":{}}'),
            fs.readFile(GALLERY_FILE, 'utf8').catch(() => '{"images":[]}'),
            fs.readFile(BACKGROUNDS_FILE, 'utf8').catch(() => '{}')
        ]);

        const content = `
window.LEMAR_MENU = ${menu};
window.LEMAR_GALLERY = ${gallery};
window.LEMAR_BACKGROUNDS = ${backgrounds};
`;
        await fs.writeFile(DATA_JS_FILE, content, 'utf8');
        console.log('data.js updated successfully.');
    } catch (err) {
        console.error('Failed to update data.js:', err);
    }
}

// Update data.js on startup
updateDataJs();

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Hardcoded logic for demonstration
    if (username === 'admin' && password === 'lemar2025') {
        res.json({ token: 'lemara-secret-admin-token' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// GET Menu
app.get('/api/menu', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read menu data' });
    }
});

// POST (Add/Update) Item
app.post('/api/menu/item', checkAuth, async (req, res) => {
    try {
        const { item } = req.body;
        if (!item) return res.status(400).json({ error: 'Item data required' });

        const dataStr = await fs.readFile(DATA_FILE, 'utf8');
        const data = JSON.parse(dataStr);

        // Check if updating
        const existingIndex = data.items.findIndex(i => i.id === item.id);

        if (existingIndex > -1) {
            data.items[existingIndex] = item;
        } else {
            // New item
            if (!item.id) item.id = Date.now().toString(36);
            data.items.push(item);
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync
        res.json({ success: true, item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save menu data' });
    }
});

// POST Category
app.post('/api/category', checkAuth, async (req, res) => {
    try {
        const { id, name, parent, color, size } = req.body;
        if (!id || !name) return res.status(400).json({ error: 'ID and Name required' });

        const dataStr = await fs.readFile(DATA_FILE, 'utf8');
        const data = JSON.parse(dataStr);

        data.categories[id] = {
            name: name,
            parent: parent || 'root',
            color: color || '#FFC700',
            size: size || 'normal'
        };

        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync
        res.json({ success: true, category: data.categories[id] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save category' });
    }
});

// DELETE Category
app.delete('/api/category/:id', checkAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const dataStr = await fs.readFile(DATA_FILE, 'utf8');
        const data = JSON.parse(dataStr);

        if (!data.categories[id]) return res.status(404).json({ error: 'Category not found' });

        delete data.categories[id];

        // Optional: Recursively delete subcategories or move items? 
        // For now, simple deletion. Items in this category will become orphans or need update.
        // User can manage that.

        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// DELETE Item
app.delete('/api/menu/item/:id', checkAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const dataStr = await fs.readFile(DATA_FILE, 'utf8');
        const data = JSON.parse(dataStr);

        const initialLength = data.items.length;
        data.items = data.items.filter(i => i.id !== id);

        if (data.items.length === initialLength) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

// --- Gallery Endpoints ---

// GET Gallery
app.get('/api/gallery', async (req, res) => {
    try {
        const data = await fs.readFile(GALLERY_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        // If file doesn't exist, return empty
        res.json({ images: [] });
    }
});

// POST Gallery Image
app.post('/api/gallery', checkAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const times = JSON.parse(req.body.times || '[]');
        const newImage = {
            src: 'uploads/' + req.file.filename,
            times: times
        };

        // Ensure gallery.json exists or create it with an empty array
        let data = { images: [] };
        try {
            const dataStr = await fs.readFile(GALLERY_FILE, 'utf8');
            data = JSON.parse(dataStr);
        } catch (readErr) {
            if (readErr.code === 'ENOENT') {
                // File does not exist, proceed with default empty data
                console.log('gallery.json not found, creating new one.');
            } else {
                throw readErr; // Re-throw other errors
            }
        }

        data.images.push(newImage);

        await fs.writeFile(GALLERY_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync
        res.json({ success: true, image: newImage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save gallery data' });
    }
});

// DELETE Gallery Image
app.delete('/api/gallery', checkAuth, async (req, res) => {
    try {
        const { src } = req.body;
        const dataStr = await fs.readFile(GALLERY_FILE, 'utf8');
        const data = JSON.parse(dataStr);

        data.images = data.images.filter(img => img.src !== src);

        await fs.writeFile(GALLERY_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync

        // Optionally delete the physical file too
        // const filePath = path.join(__dirname, src);
        // await fs.unlink(filePath).catch(e => console.log('File delete failed or file missing'));

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete gallery item' });
    }
});


// Serve Admin Page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Catch-all for index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET Backgrounds
app.get('/api/backgrounds', async (req, res) => {
    try {
        const dataStr = await fs.readFile(BACKGROUNDS_FILE, 'utf8');
        const data = JSON.parse(dataStr);
        // Ensure times exist if file is old
        if (!data.times) {
            data.times = { sabah: 6, oglen: 12, aksam: 18 };
        }
        res.json(data);
    } catch (err) {
        // Defaults
        res.json({
            sabah: 'sabah.png', oglen: 'oglen.jpg', aksam: 'aksam.jpg',
            times: { sabah: 6, oglen: 12, aksam: 18 }
        });
    }
});

// UPDATE Background Times
app.post('/api/background/times', checkAuth, async (req, res) => {
    try {
        const { times } = req.body; // { sabah: 6, oglen: 12, aksam: 18 }

        let data = {};
        try {
            data = JSON.parse(await fs.readFile(BACKGROUNDS_FILE, 'utf8'));
        } catch (e) { data = {}; }

        data.times = {
            sabah: parseInt(times.sabah) || 6,
            oglen: parseInt(times.oglen) || 12,
            aksam: parseInt(times.aksam) || 18
        };

        await fs.writeFile(BACKGROUNDS_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync
        res.json({ success: true, times: data.times });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update times' });
    }
});

// UPDATE Background (Upload)
app.post('/api/background', checkAuth, upload.single('image'), async (req, res) => {
    try {
        const { timeSlot } = req.body; // 'sabah', 'oglen', 'aksam'
        if (!['sabah', 'oglen', 'aksam'].includes(timeSlot)) {
            return res.status(400).json({ error: 'Invalid time slot' });
        }

        let filePath;
        if (req.file) {
            filePath = `uploads/${req.file.filename}`;
        } else {
            // If no file, maybe resetting or setting to a URL? 
            // For simplicity, require file for now or handle 'reset' action separate.
            return res.status(400).json({ error: 'No image provided' });
        }

        let data = {};
        try {
            const dataStr = await fs.readFile(BACKGROUNDS_FILE, 'utf8');
            data = JSON.parse(dataStr);
        } catch (e) {
            console.log("Creating new backgrounds file");
        }

        // Delete old file if it was an upload? 
        // Logic to cleanup old file omitted for brevity/safety unless explicitly requested.

        data[timeSlot] = filePath;
        await fs.writeFile(BACKGROUNDS_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync

        res.json({ success: true, backgrounds: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update background' });
    }
});

// RESET Background (to default)
app.post('/api/background/reset', checkAuth, async (req, res) => {
    try {
        const { timeSlot } = req.body;
        let data = JSON.parse(await fs.readFile(BACKGROUNDS_FILE, 'utf8'));

        // Defaults
        const defaults = { sabah: 'sabah.png', oglen: 'oglen.jpg', aksam: 'aksam.jpg' };

        data[timeSlot] = defaults[timeSlot];
        await fs.writeFile(BACKGROUNDS_FILE, JSON.stringify(data, null, 2));
        await updateDataJs(); // Sync

        res.json({ success: true, backgrounds: data });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
