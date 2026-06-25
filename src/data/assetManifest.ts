export type AssetItem = {
  id: string;
  label: string;
  image: string;
  fallbackEmoji: string;
};

export const coverAssets: Record<string, AssetItem> = {
  midnightWalk: {
    id: 'midnightWalk',
    label: 'Midnight Walk cover',
    image: '/images/covers/midnight-walk.png',
    fallbackEmoji: '🌃',
  },
  sunnyDay: {
    id: 'sunnyDay',
    label: 'Sunny Day cover',
    image: '/images/covers/sunny-day.png',
    fallbackEmoji: '☀️',
  },
  oceanDrive: {
    id: 'oceanDrive',
    label: 'Ocean Drive cover',
    image: '/images/covers/ocean-drive.png',
    fallbackEmoji: '🌊',
  },
};

export const ingredientAssets: Record<string, AssetItem> = {
  rice: { id: 'rice', label: '米饭', image: '/images/ingredients/rice.png', fallbackEmoji: '🍚' },
  potato: { id: 'potato', label: '土豆', image: '/images/ingredients/potato.png', fallbackEmoji: '🥔' },
  bread: { id: 'bread', label: '面包', image: '/images/ingredients/bread.png', fallbackEmoji: '🍞' },
  pepper: { id: 'pepper', label: '青椒', image: '/images/ingredients/pepper.png', fallbackEmoji: '🫑' },
  beef: { id: 'beef', label: '牛肉', image: '/images/ingredients/beef.png', fallbackEmoji: '🥩' },
  mushroom: { id: 'mushroom', label: '蘑菇', image: '/images/ingredients/mushroom.png', fallbackEmoji: '🍄' },
  onion: { id: 'onion', label: '洋葱', image: '/images/ingredients/onion.png', fallbackEmoji: '🧅' },
  cheese: { id: 'cheese', label: '奶酪', image: '/images/ingredients/cheese.png', fallbackEmoji: '🧀' },
  shiitake: { id: 'shiitake', label: '香菇', image: '/images/ingredients/shiitake.png', fallbackEmoji: '🍄' },
  vinylSauce: { id: 'vinylSauce', label: '黑胶酱', image: '/images/ingredients/vinyl-sauce.png', fallbackEmoji: '⚫' },
  rainSauce: { id: 'rainSauce', label: '雨滴酱', image: '/images/ingredients/rain-sauce.png', fallbackEmoji: '🌧️' },
  moonSauce: { id: 'moonSauce', label: '月亮酱', image: '/images/ingredients/moon-sauce.png', fallbackEmoji: '🌙' },
  berry: { id: 'berry', label: '莓果点缀', image: '/images/ingredients/berry.png', fallbackEmoji: '🫐' },
  lemon: { id: 'lemon', label: '柠檬片', image: '/images/ingredients/lemon.png', fallbackEmoji: '🍋' },
  mint: { id: 'mint', label: '薄荷叶', image: '/images/ingredients/mint.png', fallbackEmoji: '🌿' },
};

export const seasoningAssets: Record<string, AssetItem> = {
  chili: { id: 'chili', label: '辣椒', image: '/images/ingredients/chili.png', fallbackEmoji: '🌶️' },
  salt: { id: 'salt', label: '盐', image: '/images/ingredients/salt.png', fallbackEmoji: '🧂' },
  water: { id: 'water', label: '水', image: '/images/ingredients/water.png', fallbackEmoji: '💧' },
  honey: { id: 'honey', label: '蜂蜜', image: '/images/ingredients/honey.png', fallbackEmoji: '🍯' },
  ice: { id: 'ice', label: '冰块', image: '/images/ingredients/ice.png', fallbackEmoji: '🧊' },
  moon: { id: 'moon', label: '月亮酱', image: '/images/ingredients/moon.png', fallbackEmoji: '🌙' },
  rain: { id: 'rain', label: '雨滴', image: '/images/ingredients/rain.png', fallbackEmoji: '🌧️' },
};
