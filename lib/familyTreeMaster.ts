// 家系図マスターデータの型定義

export interface FamilyTreeMasterRecord {
  name: string;
  statusLabel: '現在飼育' | '移動' | 'お空組';
  gender: 'オス' | 'メス';
  birthDate: string | null;
  deathDate: string | null;
  ageAtDeathOrLastRecord: number | null;
  transferDate: string | null;
  transferDestination: string | null;
  arrivalDate: string | null;
  arrivalOrigin: string | null;
  father: string | null;
  mother: string | null;
  partners: string[];
  personality: string | null;
  notes: string | null;
}

// 家系図レイアウト用のノード型
export interface FamilyTreeNode extends FamilyTreeMasterRecord {
  id: string;
  x: number;
  y: number;
  depth: number; // ルートからの深さ（世代）
  children: FamilyTreeNode[];
}

// カード表示用の設定
export const CARD_CONFIG = {
  width: 195.84,
  height: 100.8,
  borderRadius: 10,
  leftBarWidth: 4,
  padding: 12,
  horizontalSpacing: 80, // カード間の横間隔
  verticalSpacing: 20,   // カード間の縦間隔
} as const;

// ステータス別の色設定
export const STATUS_COLORS = {
  現在飼育: {
    bar: '#256441',
    badgeBg: '#e5f1e6',
    badgeText: '#256441',
  },
  移動: {
    bar: '#946031',
    badgeBg: '#f8eddf',
    badgeText: '#946031',
  },
  お空組: {
    bar: '#7d827c',
    badgeBg: '#f1f0ec',
    badgeText: '#7d827c',
  },
} as const;

// 性別の色設定
export const GENDER_COLORS = {
  オス: '#4c7b82',
  メス: '#b37260',
} as const;

// コネクターの色設定（系統別）
export const LINEAGE_COLORS = [
  '#668578',
  '#aa8068',
  '#6f8da7',
  '#8b7d6b',
  '#7a9b8e',
  '#a87d7d',
] as const;
