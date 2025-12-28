
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jtcfclcaiofqlteipiyj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_kEenOxGFuT65F7eYjL5-Ig_9TLirGVp';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function updateCategoryName() {
    console.log('Fetching menu data...');
    const { data, error: fetchError } = await supabase
        .from('app_data')
        .select('value')
        .eq('key', 'menu.json')
        .single();

    if (fetchError || !data) {
        console.error('Error fetching menu:', fetchError);
        return;
    }

    const menu = data.value;
    const catId = 'klasi-kler-su-kola-vs-';

    if (menu.categories && menu.categories[catId]) {
        console.log(`Current name: ${menu.categories[catId].name}`);
        menu.categories[catId].name = 'KLASİKLER';
        console.log('Updating to: KLASİKLER');

        const { error: updateError } = await supabase
            .from('app_data')
            .upsert({ key: 'menu.json', value: menu });

        if (updateError) {
            console.error('Error updating menu:', updateError);
        } else {
            console.log('Menu update successful!');
        }
    } else {
        console.error('Category not found in menu data.');
    }
}

updateCategoryName();
