// 家系図のヘッダーと凡例コンポーネント

import React from 'react';
import { FamilyTreeNode, STATUS_COLORS } from '@/lib/familyTreeMaster';

interface FamilyTreeHeaderProps {
  nodes: FamilyTreeNode[];
  width: number;
}

export function FamilyTreeHeader({ nodes, width }: FamilyTreeHeaderProps) {
  // ステータス別の個体数を集計
  const statusCounts = {
    現在飼育: nodes.filter((n) => n.statusLabel === '現在飼育').length,
    移動: nodes.filter((n) => n.statusLabel === '移動').length,
    お空組: nodes.filter((n) => n.statusLabel === 'お空組').length,
  };

  const totalCount = nodes.length;

  return (
    <g>
      {/* ヘッダー背景 */}
      <rect width={width} height="80" fill="#365b46" />

      {/* タイトル */}
      <text
        x="24"
        y="32"
        fontSize="28"
        fontWeight="bold"
        fill="#ffffff"
      >
        レッサーパンダ 家系図
      </text>

      {/* サブタイトル */}
      <text
        x="24"
        y="58"
        fontSize="14"
        fill="#d0e8d8"
      >
        父親・母親欄に基づく系譜｜親から子へ、左→右に読みます
      </text>

      {/* 総数表示 */}
      <text
        x={width - 24}
        y="32"
        fontSize="16"
        fill="#ffffff"
        textAnchor="end"
      >
        {totalCount}個体
      </text>

      {/* ステータス内訳 */}
      <text
        x={width - 24}
        y="58"
        fontSize="13"
        fill="#d0e8d8"
        textAnchor="end"
      >
        現在飼育{statusCounts.現在飼育} ・ 移動{statusCounts.移動} ・ お空組{statusCounts.お空組}
      </text>
    </g>
  );
}

export function FamilyTreeLegend() {
  return (
    <g transform="translate(24, 100)">
      {/* 凡例タイトル */}
      <text
        x="0"
        y="0"
        fontSize="16"
        fontWeight="bold"
        fill="#31463d"
      >
        凡例
      </text>

      {/* ステータスの凡例 */}
      <g transform="translate(0, 20)">
        {/* 現在飼育 */}
        <rect
          x="0"
          y="0"
          width="4"
          height="20"
          rx="2"
          fill={STATUS_COLORS.現在飼育.bar}
        />
        <text
          x="12"
          y="15"
          fontSize="13"
          fill="#31463d"
        >
          現在飼育
        </text>

        {/* 移動 */}
        <rect
          x="100"
          y="0"
          width="4"
          height="20"
          rx="2"
          fill={STATUS_COLORS.移動.bar}
        />
        <text
          x="112"
          y="15"
          fontSize="13"
          fill="#31463d"
        >
          移動
        </text>

        {/* お空組 */}
        <rect
          x="180"
          y="0"
          width="4"
          height="20"
          rx="2"
          fill={STATUS_COLORS.お空組.bar}
        />
        <text
          x="192"
          y="15"
          fontSize="13"
          fill="#31463d"
        >
          お空組
        </text>
      </g>

      {/* 性別の凡例 */}
      <g transform="translate(0, 50)">
        <text
          x="0"
          y="15"
          fontSize="17"
          fill="#4c7b82"
        >
          ♂
        </text>
        <text
          x="20"
          y="15"
          fontSize="13"
          fill="#31463d"
        >
          オス
        </text>

        <text
          x="100"
          y="15"
          fontSize="17"
          fill="#b37260"
        >
          ♀
        </text>
        <text
          x="120"
          y="15"
          fontSize="13"
          fill="#31463d"
        >
          メス
        </text>
      </g>

      {/* パートナーの凡例 */}
      <g transform="translate(0, 80)">
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="#365b46"
          opacity="0.8"
        />
        <text
          x="20"
          y="13"
          fontSize="13"
          fill="#31463d"
        >
          親の組み合わせ
        </text>
      </g>
    </g>
  );
}
