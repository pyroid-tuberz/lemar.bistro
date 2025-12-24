
import { createClient } from '@supabase/supabase-js';

// Credentials (reused from src/lib/supabase.ts)
const SUPABASE_URL = 'https://jtcfclcaiofqlteipiyj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_kEenOxGFuT65F7eYjL5-Ig_9TLirGVp';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function resetMenu() {
    console.log('Resetting menu data in Supabase...');

    // Basic structure with just main categories
    const emptyMenu = {
        items: [],
        categories: {
            "root": {
                "name": "Menü",
                "parent": null,
                "color": "#FFC700",
                "size": "normal",
                "name_en": "Menu"
            }
        }
    };

    const { error } = await supabase
        .from('app_data')
        .upsert({ key: 'menu.json', value: emptyMenu });

    if (error) {
        console.error('Error resetting menu:', error);
    } else {
        console.log('Menu reset successful!');
    }
}

resetMenu();
