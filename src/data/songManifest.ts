import { coverAssets, ingredientAssets, seasoningAssets } from './assetManifest';

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export type FlavorProfile = {
  energy: number;
  brightness: number;
  chill: number;
  night: number;
};

export type IngredientCategory = 'base' | 'bass' | 'chords' | 'atmosphere' | 'vocal';

export type IngredientOption = {
  id: string;
  category: IngredientCategory;
  roleLabel: string;
  musicSource: string;
  label: string;
  emoji: string;
  image: string;
  audioTrackId: string;
  flavorDelta: Partial<FlavorProfile>;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  key: string;
  cover: string;
  coverFallback: string;
  promptTags: string[];
  analysis: FlavorProfile;
  originalIngredients: IngredientOption[];
  ingredientOptions: Record<IngredientCategory, IngredientOption[]>;
};

const option = (
  id: string,
  category: IngredientCategory,
  roleLabel: string,
  musicSource: string,
  assetId: keyof typeof ingredientAssets,
  audioTrackId: string,
  flavorDelta: Partial<FlavorProfile>,
): IngredientOption => {
  const asset = ingredientAssets[assetId];
  return {
    id,
    category,
    roleLabel,
    musicSource,
    label: asset.label,
    emoji: asset.fallbackEmoji,
    image: asset.image,
    audioTrackId,
    flavorDelta,
  };
};

export const ingredientOptions: Record<IngredientCategory, IngredientOption[]> = {
  base: [
    option('rice-base', 'base', 'Base / 底料', '深沉鼓点', 'rice', 'drums-rice', { chill: 4, night: 4 }),
    option('potato-base', 'base', 'Base / 底料', '厚实鼓点', 'potato', 'drums-potato', { energy: 8 }),
    option('bread-base', 'base', 'Base / 底料', '松软节拍', 'bread', 'drums-bread', { brightness: 5, chill: 3 }),
  ],
  bass: [
    option('pepper-bass', 'bass', 'Bass / 主料', '明亮贝斯', 'pepper', 'bass-pepper', { brightness: 8, energy: 4 }),
    option('beef-bass', 'bass', 'Bass / 主料', '温暖低频', 'beef', 'bass-beef', { energy: 7, night: 5 }),
    option('mushroom-bass', 'bass', 'Bass / 主料', '圆润贝斯', 'mushroom', 'bass-mushroom', { chill: 7 }),
  ],
  chords: [
    option('onion-chords', 'chords', 'Chords / 配菜', '梦幻和弦', 'onion', 'chords-onion', { night: 5, chill: 5 }),
    option('cheese-chords', 'chords', 'Chords / 配菜', '甜亮和弦', 'cheese', 'chords-cheese', { brightness: 8 }),
    option('shiitake-chords', 'chords', 'Chords / 配菜', '爵士和弦', 'shiitake', 'chords-shiitake', { chill: 6, night: 3 }),
  ],
  atmosphere: [
    option('vinyl-atmosphere', 'atmosphere', 'Atmosphere / 调料', '颗粒氛围', 'vinylSauce', 'atmos-vinyl', { night: 8 }),
    option('rain-atmosphere', 'atmosphere', 'Atmosphere / 调料', '雨夜音效', 'rainSauce', 'atmos-rain', { chill: 6, night: 6 }),
    option('moon-atmosphere', 'atmosphere', 'Atmosphere / 调料', '月光铺底', 'moonSauce', 'atmos-moon', { night: 9, chill: 4 }),
  ],
  vocal: [
    option('berry-vocal', 'vocal', 'Vocal / 点缀', '切片人声', 'berry', 'vocal-berry', { brightness: 5 }),
    option('lemon-vocal', 'vocal', 'Vocal / 点缀', '清新人声', 'lemon', 'vocal-lemon', { brightness: 7, energy: 2 }),
    option('mint-vocal', 'vocal', 'Vocal / 点缀', '轻声哼唱', 'mint', 'vocal-mint', { chill: 6 }),
  ],
};

export const audioManifest = {
  bpm: 120,
  tracks: [
    { id: 'drums-rice', category: 'base', path: publicAsset('audio/loops/drums/rice.wav') },
    { id: 'drums-potato', category: 'base', path: publicAsset('audio/loops/drums/potato.wav') },
    { id: 'drums-bread', category: 'base', path: publicAsset('audio/loops/drums/bread.wav') },
    { id: 'bass-pepper', category: 'bass', path: publicAsset('audio/loops/bass/pepper.wav') },
    { id: 'bass-beef', category: 'bass', path: publicAsset('audio/loops/bass/beef.wav') },
    { id: 'bass-mushroom', category: 'bass', path: publicAsset('audio/loops/bass/mushroom.wav') },
    { id: 'chords-onion', category: 'chords', path: publicAsset('audio/loops/chords/onion.wav') },
    { id: 'chords-cheese', category: 'chords', path: publicAsset('audio/loops/chords/cheese.wav') },
    { id: 'chords-shiitake', category: 'chords', path: publicAsset('audio/loops/chords/shiitake.wav') },
    { id: 'atmos-vinyl', category: 'atmosphere', path: publicAsset('audio/loops/atmosphere/vinyl.wav') },
    { id: 'atmos-rain', category: 'atmosphere', path: publicAsset('audio/loops/atmosphere/rain.wav') },
    { id: 'atmos-moon', category: 'atmosphere', path: publicAsset('audio/loops/atmosphere/moon.wav') },
    { id: 'vocal-berry', category: 'vocal', path: publicAsset('audio/loops/vocal/berry.wav') },
    { id: 'vocal-lemon', category: 'vocal', path: publicAsset('audio/loops/vocal/lemon.wav') },
    { id: 'vocal-mint', category: 'vocal', path: publicAsset('audio/loops/vocal/mint.wav') },
  ],
} as const;

export type SeasoningOption = {
  id: string;
  label: string;
  emoji: string;
  flavorDelta: Partial<FlavorProfile>;
};

export const seasoningOptions: SeasoningOption[] = [
  { id: 'chili', label: seasoningAssets.chili.label, emoji: seasoningAssets.chili.fallbackEmoji, flavorDelta: { energy: 12 } },
  { id: 'salt', label: seasoningAssets.salt.label, emoji: seasoningAssets.salt.fallbackEmoji, flavorDelta: { brightness: 6, energy: 3 } },
  { id: 'water', label: seasoningAssets.water.label, emoji: seasoningAssets.water.fallbackEmoji, flavorDelta: { chill: 8, energy: -3 } },
  { id: 'honey', label: seasoningAssets.honey.label, emoji: seasoningAssets.honey.fallbackEmoji, flavorDelta: { brightness: 12 } },
  { id: 'ice', label: seasoningAssets.ice.label, emoji: seasoningAssets.ice.fallbackEmoji, flavorDelta: { chill: 12 } },
  { id: 'moon', label: seasoningAssets.moon.label, emoji: seasoningAssets.moon.fallbackEmoji, flavorDelta: { night: 12 } },
  { id: 'rain', label: seasoningAssets.rain.label, emoji: seasoningAssets.rain.fallbackEmoji, flavorDelta: { chill: 5, night: 6 } },
];

export const songs: Song[] = [
  {
    id: 'midnight-walk',
    title: 'Midnight Walk',
    artist: 'Luna Byte',
    duration: '02:48',
    bpm: 116,
    key: 'F minor',
    cover: coverAssets.midnightWalk.image,
    coverFallback: coverAssets.midnightWalk.fallbackEmoji,
    promptTags: ['lo-fi night walk', 'warm low end', 'soft pad', 'late-night ambience'],
    analysis: { energy: 56, brightness: 42, chill: 72, night: 88 },
    originalIngredients: [
      ingredientOptions.base[0],
      ingredientOptions.bass[1],
      ingredientOptions.chords[0],
      ingredientOptions.atmosphere[2],
    ],
    ingredientOptions,
  },
  {
    id: 'sunny-day',
    title: 'Sunny Day',
    artist: 'Mika Soda',
    duration: '03:16',
    bpm: 124,
    key: 'A major',
    cover: coverAssets.sunnyDay.image,
    coverFallback: coverAssets.sunnyDay.fallbackEmoji,
    promptTags: ['city pop', 'bright synth chords', 'major feeling', 'sunny groove'],
    analysis: { energy: 76, brightness: 90, chill: 48, night: 20 },
    originalIngredients: [
      ingredientOptions.base[2],
      ingredientOptions.bass[0],
      ingredientOptions.chords[1],
      ingredientOptions.vocal[1],
    ],
    ingredientOptions,
  },
  {
    id: 'ocean-drive',
    title: 'Ocean Drive',
    artist: 'Neon Tofu',
    duration: '02:59',
    bpm: 120,
    key: 'D minor',
    cover: coverAssets.oceanDrive.image,
    coverFallback: coverAssets.oceanDrive.fallbackEmoji,
    promptTags: ['synthwave drive', 'ocean breeze', 'smooth bass', 'ambient texture'],
    analysis: { energy: 66, brightness: 64, chill: 62, night: 58 },
    originalIngredients: [
      ingredientOptions.base[1],
      ingredientOptions.bass[2],
      ingredientOptions.chords[2],
      ingredientOptions.atmosphere[1],
    ],
    ingredientOptions,
  },
];
