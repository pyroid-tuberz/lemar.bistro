
const fs = require('fs');
const path = require('path');

const MENU_FILE = path.join(__dirname, 'menu.json');

const translations = {
    // Categories
    "Kahvaltı & Tost": "Breakfast & Toast",
    "Burger, Wrap & Sandviç": "Burger, Wrap & Sandwich",
    "Atıştırmalıklar": "Snacks",
    "Makarnalar": "Pastas",
    "Pizzalar": "Pizzas",
    "Salatalar": "Salads",
    "Et Yemekleri": "Meat Dishes",
    "Tavuk Yemekleri": "Chicken Dishes",
    "Mezeler & Ara Sıcaklar": "Appetizers & Starters",
    "Izgaralar": "Grills",
    "Alkolsüz İçecekler": "Non-Alcoholic Drinks",
    "Biralar": "Beers",
    "Özel Karışımlar": "Special Mixes",
    "Kokteyller": "Cocktails",
    "Tatlılar": "Desserts",
    "Shotlar": "Shots",
    "Şaraplar": "Wines",
    "Nargile": "Hookah",
    "Yiyecekler": "Food",
    "İçecekler": "Drinks",
    "Ana Yemekler": "Main Courses",
    "Alkollü İçecekler": "Alcoholic Drinks",

    // Items
    "Kahvaltı Tabağı": "Breakfast Plate",
    "Serpme Kahvaltı": "Mixed Breakfast Spread",
    "Serpme Kahvaltı (Tek Kişilik)": "Mixed Breakfast (Single)",
    "Sade Omlet": "Plain Omelette",
    "Sucuklu Omlet": "Sausage Omelette",
    "Kaşarlı Omlet": "Cheese Omelette",
    "Karışık Omlet": "Mixed Omelette",
    "Menemen": "Menemen (Turkish Scrambled Eggs)",
    "Kaşarlı Mantarlı Omlet": "Mushroom & Cheese Omelette",
    "Karışık Tako Tost": "Mixed Taco Toast",
    "Kaşarlı Tako Tost": "Cheese Taco Toast",
    "Kavurmalı Bazlama Tost": "Roast Beef Bazlama Toast",
    "Ayvalık Tostu": "Ayvalik Toast",
    "Sucuklu Tost": "Sausage Toast",
    "Kaşarlı Tost": "Cheese Toast",
    "Karışık Tost": "Mixed Toast",
    "Mix Bazlama Tost": "Mix Bazlama Toast",
    "Hamburger": "Hamburger",
    "Chicken Burger": "Chicken Burger",
    "CheeseBurger": "Cheeseburger",
    "Bıg Burger": "Big Burger",
    "Mexican Burger": "Mexican Burger",
    "Lemar Burger": "Lemar Burger",
    "Et Wrap": "Beef Wrap",
    "Tavuklu Wrap": "Chicken Wrap",
    "Köfteli Wrap": "Meatball Wrap",
    "Crep Wrap": "Crepe Wrap",
    "Sezar Sandviç": "Caesar Sandwich",
    "Cömert Sandviç": "Generous Sandwich",
    "Tuna Sandviç": "Tuna Sandwich",
    "Peynirli Sandviç": "Cheese Sandwich",
    "Parmak Patates": "French Fries",
    "Elma Dilim Patates": "Potato Wedges",
    "Halka Soğan": "Onion Rings",
    "Çıtır Tavuk": "Crispy Chicken",
    "Combo Tabağı": "Combo Plate",
    "Buffalo Wings": "Buffalo Wings",
    "Quesadilla": "Quesadilla",
    "Penne Romano": "Penne Romano",
    "Köri Soslu Penne": "Curry Penne",
    "Penne Portobelle": "Penne Portobello",
    "Penne Arabıatta": "Penne Arrabbiata",
    "Penne Al Tonno": "Penne Al Tonno",
    "Penne Al Fungı": "Penne Al Funghi",
    "Gnocchi": "Gnocchi",
    "Pizza Vegerarıana": "Vegetarian Pizza",
    "Barbekü Soslu Pizza": "BBQ Pizza",
    "Çıtır Tavuklu Pizza": "Crispy Chicken Pizza",
    "Peperonı Pizza": "Pepperoni Pizza",
    "Lemar Hot Pizza": "Lemar Hot Pizza",
    "Spice Chicken Pizza": "Spicy Chicken Pizza",
    "Tavuklu Pizza": "Chicken Pizza",
    "Karışık Pizza": "Mixed Pizza",
    "Pizza Ton'a": "Tuna Pizza",
    "Akdeniz Pizza": "Mediterranean Pizza",
    "Etli Pizza": "Meat Pizza",
    "Spesiyal Pizza": "Special Pizza",
    "Sezar Salata": "Caesar Salad",
    "Tavuk Salata": "Chicken Salad",
    "Beef Salata": "Beef Salad",
    "Roka Salata": "Arugula Salad",
    "Çıtır Tavuk Salata": "Crispy Chicken Salad",
    "Ton Balıklı Salata": "Tuna Salad",
    "Patlıcan salata": "Eggplant Salad",
    "Etli Çömlek Kebabı": "Clay Pot Meat Kebab",
    "Et Çökertme": "Cokertme Kebab",
    "Sac Kavurma": "Shepherd's Roast",
    "Ali Nazik": "Ali Nazik",
    "Filetto Provoncole": "Filetto Provencale",
    "Tornedo Bernaıse": "Tournedos Bearnaise",
    "Et Sote": "Beef Sauté",
    "Mexican Steak": "Mexican Steak",
    "Hünkar Beğendi": "Hunkar Begendi (Sultan's Delight)",
    "Tavuklu Çömlek Kebabı": "Clay Pot Chicken Kebab",
    "Potted Chicken": "Potted Chicken",
    "Köri Soslu Tavuk": "Curry Chicken",
    "Tavuk Çökertme": "Chicken Cokertme",
    "Soya Soslu Tavuk": "Soy Sauce Chicken",
    "Chicken Rosa Maria": "Chicken Rosa Maria",
    "Barbekü Soslu Tavuk": "BBQ Chicken",
    "Chicken Oscar": "Chicken Oscar",
    "Tavuk Sote": "Chicken Sauté",
    "Tavuk Fajita": "Chicken Fajita",
    "Kremalı Mantarlı Tavuk": "Creamy Mushroom Chicken",
    "Atom": "Atom (Spicy Yoghurt)",
    "Ekşili Mantar": "Sour Mushrooms",
    "Peynir Tabağı": "Cheese Platter",
    "Kuru cacık": "Tzatziki",
    "Karides Güveç": "Shrimp Casserole",
    "Yengeç Bacağı": "Crab Legs",
    "Kalamar Tava": "Fried Calamari",
    "Muhammara": "Muhammara",
    "Girit sarma": "Cretan Wrap",
    "Bira": "Beer",
    "Kola": "Coke",
    "Fanta": "Fanta",
    "Su": "Water",
    "Çay": "Tea",
    "Türk Kahvesi": "Turkish Coffee"
};

const commonIngredients = {
    "Domates": "Tomato",
    "Salatalık": "Cucumber",
    "Biber": "Pepper",
    "Soğan": "Onion",
    "Sarımsak": "Garlic",
    "Mantar": "Mushroom",
    "Tavuk": "Chicken",
    "Et": "Meat",
    "Peynir": "Cheese",
    "Kaşar": "Mozzarella",
    "Sucuk": "Sausage",
    "Salam": "Salami",
    "Sosis": "Sausage",
    "Zeytin": "Olive",
    "Mısır": "Corn",
    "Sos": "Sauce",
    "Krema": "Cream",
    "Yoğurt": "Yoghurt",
    "Tereyağı": "Butter",
    "Bal": "Honey",
    "Reçel": "Jam",
    "Patates": "Potato",
    "Yeşillik": "Greens",
    "Marul": "Lettuce",
    "Turşu": "Pickle"
};

try {
    const dataStr = fs.readFileSync(MENU_FILE, 'utf8');
    const data = JSON.parse(dataStr);

    let updatedCount = 0;

    // Translate Items
    if (data.items) {
        data.items = data.items.map(item => {
            let enName = translations[item.name] || item.name;
            let enDesc = item.description || "";

            // Basic Keyword Replacement for Description
            if (enDesc) {
                Object.entries(commonIngredients).forEach(([tr, en]) => {
                    const regex = new RegExp(tr, 'gi');
                    enDesc = enDesc.replace(regex, en);
                });
            }

            return {
                ...item,
                name_en: enName,
                description_en: enDesc
            };
        });
        updatedCount = data.items.length;
    }

    // Translate Categories (using 'name_en' property if we want to support it, 
    // but typically categories are used via ID. However, admin.html might need to be updated to show English names if we add them to the object)
    // For now, let's just focus on items as requested.
    // Actually, let's add `name_en` to categories too, maybe the frontend can use it if we allow it.
    // The current frontend uses `translations` dict for nav, but dynamic categories come from JSON.
    // Let's add `name_en` to categories in JSON, and update script.js to use it if available.

    if (data.categories) {
        for (const key in data.categories) {
            const cat = data.categories[key];
            if (cat.name && translations[cat.name]) {
                cat.name_en = translations[cat.name];
            } else {
                cat.name_en = cat.name;
            }
        }
    }

    fs.writeFileSync(MENU_FILE, JSON.stringify(data, null, 2));
    console.log(`Updated all items and categories with translations.`);

} catch (err) {
    console.error("Error:", err);
}
