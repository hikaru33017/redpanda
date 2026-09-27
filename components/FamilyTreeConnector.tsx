// 親子関係のコネクター（線）コンポーネント

import React from 'react';
import { FamilyTreeNode, CARD_CONFIG, LINEAGE_COLORS } from '@/lib/familyTreeMaster';

interface FamilyTreeConnectorProps {
  parent: FamilyTreeNode;
  child: FamilyTreeNode;
  colorIndex: number;
}

export function FamilyTreeConnector({
  parent,
  child,
  colorIndex,
}: FamilyTreeConnectorProps) {
  const color = LINEAGE_COLORS[colorIndex % LINEAGE_COLORS.length];

  // 親カードの右端の中心
  const startX = parent.x + CARD_CONFIG.width;
  const startY = parent.y + CARD_CONFIG.height / 2;

  // 子カードの左端の中心
  const endX = child.x;
  const endY = child.y + CARD_CONFIG.height / 2;

  // 中間点を計算（ベジェ曲線用）
  const midX = (startX + endX) / 2;

  // パスを生成（滑らかな曲線）
  const path = `
    M ${startX} ${startY}
    C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}
  `;

  return (
    <path
      d={path}
      stroke={color}
      strokeWidth="2"
      fill="none"
      opacity="0.7"
    />
  );
}

interface PartnerConnectorProps {
  node1: FamilyTreeNode;
  node2: FamilyTreeNode;
}

export function PartnerConnector({ node1, node2 }: PartnerConnectorProps) {
  // パートナー印（●）を2つのノードの間に表示
  const x1 = node1.x + CARD_CONFIG.width / 2;
  const y1 = node1.y + CARD_CONFIG.height / 2;
  const x2 = node2.x + CARD_CONFIG.width / 2;
  const y2 = node2.y + CARD_CONFIG.height / 2;

  // 中点
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      {/* パートナーマーカー */}
      <circle
        cx={midX}
        cy={midY}
        r="6"
        fill="#365b46"
        opacity="0.8"
      />
      {/* 薄い線で接続（オプション） */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#365b46"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.3"
      />
    </g>
  );
}
