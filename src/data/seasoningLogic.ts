import type { FlavorProfile } from './songManifest';

export type SeasoningCounts = Record<string, number>;

export const seasoningRules = [
  {
    id: 'chili-cool',
    icons: ['🌶️', '🧊', '💧'],
    resultIcon: '🫧',
    description: '辣椒遇到冰块或水，会被降温，能量下降但清爽感上升。',
  },
  {
    id: 'honey-rain',
    icons: ['🍯', '🌧️'],
    resultIcon: '🌫️',
    description: '蜂蜜遇到雨滴，甜味会被打散，变成湿润的梦幻氛围。',
  },
  {
    id: 'salt-spark',
    icons: ['🧂'],
    resultIcon: '✨',
    description: '盐少量提鲜，放多了像给低频撒闪粉。',
  },
  {
    id: 'moon-rain',
    icons: ['🌙', '🌧️'],
    resultIcon: '🌃',
    description: '月亮酱和雨滴叠加，会明显增强夜晚氛围。',
  },
] as const;

export const getSeasoningCounts = (seasoningIds: readonly string[]): SeasoningCounts =>
  seasoningIds.reduce<SeasoningCounts>((counts, id) => {
    counts[id] = (counts[id] ?? 0) + 1;
    return counts;
  }, {});

export const getEffectiveSeasoningCounts = (seasoningIds: readonly string[]) => {
  const counts = getSeasoningCounts(seasoningIds);
  const coolingCount = (counts.ice ?? 0) + (counts.water ?? 0);
  const chiliIceCancel = Math.min(counts.chili ?? 0, coolingCount);
  const honeyRainCancel = Math.min(counts.honey ?? 0, counts.rain ?? 0);

  return {
    chili: Math.min((counts.chili ?? 0) - chiliIceCancel, 4),
    ice: Math.min(Math.max((counts.ice ?? 0) - chiliIceCancel, 0), 4),
    water: Math.min(Math.max((counts.water ?? 0) - Math.max(chiliIceCancel - (counts.ice ?? 0), 0), 0), 4),
    salt: Math.min(counts.salt ?? 0, 4),
    honey: Math.min((counts.honey ?? 0) - honeyRainCancel, 4),
    rain: Math.min((counts.rain ?? 0) - honeyRainCancel, 4),
    moon: Math.min(counts.moon ?? 0, 4),
    chiliIceCancel,
    honeyRainCancel,
  };
};

export const getSeasoningFlavorDelta = (seasoningIds: readonly string[]): Partial<FlavorProfile> => {
  const effective = getEffectiveSeasoningCounts(seasoningIds);

  return {
    energy: effective.chili * 10 + effective.salt * 3 - effective.ice * 2 - effective.water * 3,
    brightness: effective.honey * 10 + effective.salt * 6 + effective.chiliIceCancel * 2,
    chill: effective.ice * 10 + effective.water * 8 + effective.rain * 4 + effective.honeyRainCancel * 2,
    night: effective.moon * 10 + effective.rain * 6,
  };
};

export const getSeasoningFeedback = (seasoningIds: readonly string[]) => {
  const counts = getSeasoningCounts(seasoningIds);
  const effective = getEffectiveSeasoningCounts(seasoningIds);
  const feedback: string[] = [];

  if ((counts.chili ?? 0) >= 3 && effective.chili > 0) {
    feedback.push('辣椒放到第三勺，锅边已经开始小型蹦迪。');
  }

  if ((counts.salt ?? 0) >= 3) {
    feedback.push('盐有点上头，像给低频撒了一把亮晶晶的闪粉。');
  }

  if (effective.chiliIceCancel > 0) {
    feedback.push('辣椒遇到冰块/水，火气被按住，留下清爽的刺激感。');
  }

  if (effective.honeyRainCancel > 0) {
    feedback.push('蜂蜜撞上雨滴，甜味变成了湿润的霓虹雾。');
  }

  if ((counts.moon ?? 0) > 0 && (counts.rain ?? 0) > 0) {
    feedback.push('月亮酱和雨滴叠在一起，夜晚氛围直接拉满。');
  }

  return feedback;
};
