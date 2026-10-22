import { MenuItem, RestaurantTable } from '../types/restaurant';

export const RESTAURANT_INFO = {
  name: "Saffron & Stone",
  tagline: "Artisan Woodfire Bistro & Tapas",
  address: "442 Grand Boulevard, Culinary District",
  phone: "+1 (555) 723-3766",
  openingHours: "Mon - Sun: 11:30 AM - 11:00 PM",
  rating: 4.9,
  reviewsCount: 1420,
  deliveryTime: "25-35 min",
  deliveryFee: 2.99,
  minOrder: 15.00,
  freeDeliveryThreshold: 45.00
};

export const MENU_ITEMS: MenuItem[] = [
  // CHEF'S SPECIALS & MAINS
  {
    id: "dish-1",
    name: "Truffle Ribeye Steak Au Jus",
    description: "Charred USDA Prime 12oz ribeye with black winter truffle butter, roasted shallots, and smoked marrow jus.",
    price: 38.50,
    category: "steaks",
    rating: 4.9,
    reviewsCount: 320,
    prepTimeMinutes: 22,
    calories: 780,
    spicyLevel: 0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    tags: ["Chef Special", "Prime Cut", "Gluten-Free"],
    ingredients: ["12oz Prime Ribeye", "Black Truffle Butter", "Bone Marrow Jus", "Rosemary", "Sea Salt"],
    portionOptions: [
      { id: "reg", name: "12oz Prime Cut", priceDelta: 0 },
      { id: "large", name: "16oz Tomahawk Cut", priceDelta: 12.00 }
    ],
    addons: [
      { id: "add-1", name: "Wild Forest Mushrooms", price: 5.50 },
      { id: "add-2", name: "Extra Truffle Herb Butter", price: 3.50 },
      { id: "add-3", name: "Garlic Butter Prawns (3pc)", price: 8.00 }
    ]
  },
  {
    id: "dish-2",
    name: "Artisan Burrata & Heirloom Peach",
    description: "Creamy pugliese burrata cheese, charred sweet peaches, aged 18-yr Modena balsamic glaze, pistachios, micro basil.",
    price: 18.00,
    category: "starters",
    rating: 4.8,
    reviewsCount: 215,
    prepTimeMinutes: 10,
    calories: 420,
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80",
    tags: ["Best Seller", "Vegetarian", "Gluten-Free"],
    ingredients: ["Pugliese Burrata", "Heirloom Peaches", "Modena Balsamic", "Toasted Pistachios", "Focaccia"],
    addons: [
      { id: "bur-1", name: "Extra Toasted Focaccia (2pc)", price: 3.00 },
      { id: "bur-2", name: "Prosciutto di Parma (40g)", price: 6.00 }
    ]
  },
  {
    id: "dish-3",
    name: "Woodfired Neapolitan Diavola",
    description: "San Marzano D.O.P tomatoes, spicy spianata calabrese, fresh fior di latte mozzarella, hot hot honey drizzle, fresh basil.",
    price: 22.00,
    category: "pizza_pasta",
    rating: 4.9,
    reviewsCount: 450,
    prepTimeMinutes: 15,
    calories: 890,
    spicyLevel: 2,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tags: ["Woodfired", "Spicy", "Chef Special"],
    ingredients: ["48-hr Fermented Dough", "San Marzano D.O.P", "Spicy Spianata", "Hot Honey", "Fior di Latte"],
    portionOptions: [
      { id: "p-12", name: "Medium 12-inch", priceDelta: 0 },
      { id: "p-14", name: "Large 14-inch", priceDelta: 4.50 }
    ],
    addons: [
      { id: "pza-1", name: "Extra Fresh Mozzarella", price: 3.00 },
      { id: "pza-2", name: "Calabrian Chili Oil", price: 1.50 },
      { id: "pza-3", name: "Kalamata Olives", price: 2.50 }
    ]
  },
  {
    id: "dish-4",
    name: "Handmade Tagliolini al Tartufo",
    description: "Silky egg pasta swirled in French cultured butter, 24-month Parmigiano-Reggiano, and freshly shaved Norcia black truffle.",
    price: 27.50,
    category: "pizza_pasta",
    rating: 4.9,
    reviewsCount: 290,
    prepTimeMinutes: 16,
    calories: 640,
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281023?auto=format&fit=crop&w=800&q=80",
    tags: ["Handmade", "Vegetarian", "Gourmet"],
    ingredients: ["Handmade Egg Tagliolini", "Norcia Truffles", "Parmigiano-Reggiano", "Cultured Butter"],
    addons: [
      { id: "t-1", name: "Extra Shaved Truffle (3g)", price: 8.00 },
      { id: "t-2", name: "Pan-Seared Scallops (2pc)", price: 9.50 }
    ]
  },
  {
    id: "dish-5",
    name: "Crispy Calamari Fritti",
    description: "Golden tender wild calamari with smoked paprika crunch, grilled Meyer lemon, and saffron garlic aioli dip.",
    price: 16.50,
    category: "starters",
    rating: 4.7,
    reviewsCount: 180,
    prepTimeMinutes: 12,
    calories: 460,
    spicyLevel: 1,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    tags: ["Seafood", "Crispy", "Popular"],
    ingredients: ["Wild Monterey Calamari", "Smoked Paprika", "Saffron Aioli", "Meyer Lemon"],
    addons: [
      { id: "c-1", name: "Extra Saffron Aioli Dip", price: 2.00 }
    ]
  },
  {
    id: "dish-6",
    name: "Saffron Glazed Atlantic Salmon",
    description: "Pan-crisped Norwegian salmon fillet rested on asparagus spears, saffron-infused champagne cream, and caviar pearls.",
    price: 32.00,
    category: "mains",
    rating: 4.8,
    reviewsCount: 260,
    prepTimeMinutes: 20,
    calories: 610,
    spicyLevel: 0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    tags: ["Signature", "Gluten-Free", "Rich Omega-3"],
    ingredients: ["Norwegian Salmon", "Saffron Cream", "Baby Asparagus", "Salmon Caviar"],
    portionOptions: [
      { id: "sal-1", name: "Standard 7oz", priceDelta: 0 },
      { id: "sal-2", name: "Generous 10oz", priceDelta: 7.00 }
    ]
  },
  {
    id: "dish-7",
    name: "Smoked Wagyu Smash Burger",
    description: "Twin Wagyu beef patties, melted aged cheddar, bourbon caramelized onions, crispy pancetta, house truffle mayo in toasted brioche.",
    price: 21.00,
    category: "mains",
    rating: 4.9,
    reviewsCount: 512,
    prepTimeMinutes: 14,
    calories: 880,
    spicyLevel: 1,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tags: ["Wagyu", "Best Seller", "Juicy"],
    ingredients: ["Dual Wagyu Patties", "Bourbon Onions", "Aged Cheddar", "Crispy Pancetta", "Brioche Bun"],
    addons: [
      { id: "b-1", name: "Parmesan Truffle Fries", price: 4.50 },
      { id: "b-2", name: "Fried Farm Egg", price: 2.00 },
      { id: "b-3", name: "Avocado Slices", price: 2.50 }
    ]
  },
  {
    id: "dish-8",
    name: "Wild Forest Mushroom Risotto",
    description: "Acquerello carnaroli rice slow-cooked with chanterelles, porcini broth, mascarpone cheese, and crispy herb gremolata.",
    price: 24.00,
    category: "mains",
    rating: 4.7,
    reviewsCount: 165,
    prepTimeMinutes: 18,
    calories: 520,
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: false,
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "Gluten-Free", "Comfort Food"],
    ingredients: ["Acquerello Rice", "Porcini & Chanterelle", "White Truffle Oil", "Parmigiano"]
  },
  {
    id: "dish-9",
    name: "Golden Molten Belgian Fondant",
    description: "Valrhona 72% dark chocolate warm lava cake oozing rich ganache, paired with Madagascar vanilla bean gelato & gold dust.",
    price: 13.50,
    category: "desserts",
    rating: 5.0,
    reviewsCount: 420,
    prepTimeMinutes: 12,
    calories: 490,
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    tags: ["Signature Dessert", "Valrhona Chocolate"],
    ingredients: ["Valrhona 72% Chocolate", "Madagascar Vanilla Gelato", "Fresh Raspberries", "24k Gold Flakes"]
  },
  {
    id: "dish-10",
    name: "Traditional Pistachio Tiramisu",
    description: "Espresso-soaked savoiardi biscuits, mascarpone zabaglione mousse, Sicilian Bronte pistachio cream, and cacao dust.",
    price: 12.00,
    category: "desserts",
    rating: 4.8,
    reviewsCount: 195,
    prepTimeMinutes: 8,
    calories: 430,
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    tags: ["Italian Classic", "Pistachio"],
    ingredients: ["Espresso", "Bronte Pistachio", "Mascarpone", "Savoiardi"]
  },
  {
    id: "dish-11",
    name: "Blood Orange & Rosemary Sparkler",
    description: "Freshly squeezed Sicilian blood orange, cold-pressed rosemary syrup, sparkling San Pellegrino, candied citrus wheel.",
    price: 7.50,
    category: "beverages",
    rating: 4.8,
    reviewsCount: 110,
    prepTimeMinutes: 5,
    calories: 120,
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isChefSpecial: false,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    tags: ["Artisan Mocktail", "Refreshing", "Vegan"],
    ingredients: ["Blood Orange Juice", "Rosemary Infused Agave", "San Pellegrino", "Crushed Ice"]
  },
  {
    id: "dish-12",
    name: "Smoked Bourbon Old Fashioned",
    description: "Woodford Reserve bourbon infused with roasted orange peel, Angostura aromatic bitters, smoked with cherrywood chips.",
    price: 15.00,
    category: "beverages",
    rating: 4.9,
    reviewsCount: 230,
    prepTimeMinutes: 6,
    calories: 190,
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    tags: ["Handcrafted Cocktail", "Smoked", "Top Shelf"],
    ingredients: ["Woodford Reserve", "Cherrywood Smoke", "Bitters", "Demerara Sugar"]
  }
];

export const RESTAURANT_TABLES: RestaurantTable[] = [
  { id: 1, number: 1, zone: 'main_hall', capacity: 2, isAvailable: true, label: "Table 1 (Intimate Window)" },
  { id: 2, number: 2, zone: 'main_hall', capacity: 4, isAvailable: true, label: "Table 2 (Center Dining)" },
  { id: 3, number: 3, zone: 'main_hall', capacity: 6, isAvailable: false, label: "Table 3 (Family Round)" },
  { id: 4, number: 4, zone: 'patio_garden', capacity: 2, isAvailable: true, label: "Garden Table 4 (Romantic Lantern)" },
  { id: 5, number: 5, zone: 'patio_garden', capacity: 4, isAvailable: true, label: "Garden Table 5 (Fountain View)" },
  { id: 6, number: 6, zone: 'patio_garden', capacity: 8, isAvailable: true, label: "Garden Table 6 (Pergola Group)" },
  { id: 7, number: 7, zone: 'rooftop_terrace', capacity: 2, isAvailable: true, label: "Rooftop 7 (Sunset Skyline)" },
  { id: 8, number: 8, zone: 'rooftop_terrace', capacity: 4, isAvailable: false, label: "Rooftop 8 (Starlight Lounge)" },
  { id: 9, number: 9, zone: 'chefs_counter', capacity: 2, isAvailable: true, label: "Chef Counter A (Open Kitchen Bar)" },
  { id: 10, number: 10, zone: 'chefs_counter', capacity: 2, isAvailable: true, label: "Chef Counter B (Open Kitchen Bar)" },
  { id: 11, number: 11, zone: 'vip_booth', capacity: 6, isAvailable: true, label: "VIP Velvet Booth 1" },
  { id: 12, number: 12, zone: 'vip_booth', capacity: 10, isAvailable: true, label: "VIP Grand Salon Booth" }
];

export const TIME_SLOTS = [
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM",
  "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM"
];

export const POPULAR_PROMOS = [
  { code: "GOURMET20", discountPercent: 20, description: "20% off all gourmet orders over $30" },
  { code: "BISTRO10", discountAmount: 10, description: "$10 flat discount on orders over $40" }
];
