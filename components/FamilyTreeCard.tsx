// 個体カードコンポーネント

import React from 'react';
import {
  FamilyTreeNode,
  CARD_CONFIG,
  STATUS_COLORS,
  GENDER_COLORS,
} from '@/lib/familyTreeMaster';

interface FamilyTreeCardProps {
  node: FamilyTreeNode;
}

export function FamilyTreeCard({ node }: FamilyTreeCardProps) {
  const statusColor = STATUS_COLORS[node.statusLabel];

  // 生年月日のフォーマット
  const formatBirthDate = (date: string | null) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${year}.${month}.${day} 生`;
  };

  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      {/* カード本体 */}
      <rect
        width={CARD_CONFIG.width}
        height={CARD_CONFIG.height}
        rx={CARD_CONFIG.borderRadius}
        fill="#ffffff"
        stroke="#dce3da"
        strokeWidth="1.2"
      />

      {/* 左端のステータスバー */}
      <rect
        x="0"
        y={CARD_CONFIG.borderRadius / 2}
        width={CARD_CONFIG.leftBarWidth}
        height={CARD_CONFIG.height - CARD_CONFIG.borderRadius}
        rx="2"
        fill={statusColor.bar}
      />

      {/* 名前 */}
      <text
        x={CARD_CONFIG.padding + CARD_CONFIG.leftBarWidth}
        y={28}
        fontSize="21"
        fontWeight="bold"
        fill="#31463d"
      >
        {node.name}
      </text>

      {/* 性別記号 */}
      <text
        x={CARD_CONFIG.width - 25}
        y={28}
        fontSize="17"
        fill={GENDER_COLORS[node.gender]}
      >
        {node.gender === 'オス' ? '♂' : '♀'}
      </text>

      {/* 生年月日 */}
      {node.birthDate && (
        <text
          x={CARD_CONFIG.padding + CARD_CONFIG.leftBarWidth}
          y={52}
          fontSize="13"
          fill="#66746c"
        >
          {formatBirthDate(node.birthDate)}
        </text>
      )}

      {/* ステータスバッジ */}
      <g transform={`translate(${CARD_CONFIG.width - 70}, ${CARD_CONFIG.height - 25})`}>
        <rect
          width="60"
          height="18"
          rx="5"
          fill={statusColor.badgeBg}
        />
        <text
          x="30"
          y="13"
          fontSize="11"
          fill={statusColor.badgeText}
          textAnchor="middle"
        >
          {node.statusLabel}
        </text>
      </g>
    </g>
  );
}
