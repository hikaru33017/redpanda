// 家系図のツリーレイアウトアルゴリズム

import {
  FamilyTreeMasterRecord,
  FamilyTreeNode,
  CARD_CONFIG,
} from './familyTreeMaster';
import masterData from './familyTreeMasterData.json';

/**
 * マスターデータからツリー構造を構築する
 */
export function buildFamilyTree(): FamilyTreeNode[] {
  const data = masterData as FamilyTreeMasterRecord[];

  // 名前をキーにしたマップを作成
  const nodeMap = new Map<string, FamilyTreeNode>();

  // すべてのノードを初期化
  data.forEach((record) => {
    nodeMap.set(record.name, {
      ...record,
      id: record.name,
      x: 0,
      y: 0,
      depth: 0,
      children: [],
    });
  });

  // ガイア（王子）を追加（親欄のみに登場する個体）
  if (!nodeMap.has('ガイア（王子）')) {
    nodeMap.set('ガイア（王子）', {
      name: 'ガイア（王子）',
      statusLabel: '移動',
      gender: 'オス',
      birthDate: null,
      deathDate: null,
      ageAtDeathOrLastRecord: null,
      transferDate: null,
      transferDestination: null,
      arrivalDate: null,
      arrivalOrigin: '神戸市立王子動物園',
      father: null,
      mother: null,
      partners: ['ミンファ'],
      personality: null,
      notes: '親欄のみ登場',
      id: 'ガイア（王子）',
      x: 0,
      y: 0,
      depth: 0,
      children: [],
    });
  }

  // 親子関係を構築
  data.forEach((record) => {
    const node = nodeMap.get(record.name);
    if (!node) return;

    // 父親からの関係
    if (record.father) {
      const fatherNode = nodeMap.get(record.father);
      if (fatherNode && !fatherNode.children.includes(node)) {
        fatherNode.children.push(node);
      }
    }

    // 母親からの関係（父親がいない場合のみ）
    if (record.mother && !record.father) {
      const motherNode = nodeMap.get(record.mother);
      if (motherNode && !motherNode.children.includes(node)) {
        motherNode.children.push(node);
      }
    }
  });

  // ルートノード（親がいない個体）を特定
  const rootNodes: FamilyTreeNode[] = [];
  nodeMap.forEach((node) => {
    const hasParent = Array.from(nodeMap.values()).some(
      (n) => n.children.includes(node)
    );
    if (!hasParent) {
      rootNodes.push(node);
    }
  });

  // 深さを計算
  function calculateDepth(node: FamilyTreeNode, depth: number) {
    node.depth = depth;
    node.children.forEach((child) => calculateDepth(child, depth + 1));
  }

  rootNodes.forEach((root) => calculateDepth(root, 0));

  // 全ノードを返す
  return Array.from(nodeMap.values());
}

/**
 * ツリーレイアウトを計算する
 */
export function calculateTreeLayout(nodes: FamilyTreeNode[]): FamilyTreeNode[] {
  // ルートノードを取得
  const rootNodes = nodes.filter((node) => node.depth === 0);

  // 各ルートノードのサブツリーをレイアウト
  let currentY = 100; // 初期Y位置（ヘッダー分の余白）

  rootNodes.forEach((root, index) => {
    const subtreeHeight = layoutSubtree(root, 0, currentY);
    currentY += subtreeHeight + CARD_CONFIG.verticalSpacing * 3; // ルート間に余白
  });

  return nodes;
}

/**
 * サブツリーのレイアウトを計算（再帰的）
 */
function layoutSubtree(
  node: FamilyTreeNode,
  depth: number,
  startY: number
): number {
  const x = depth * (CARD_CONFIG.width + CARD_CONFIG.horizontalSpacing);

  if (node.children.length === 0) {
    // 葉ノード
    node.x = x;
    node.y = startY;
    return CARD_CONFIG.height;
  }

  // 子ノードを再帰的にレイアウト
  let currentY = startY;
  let totalHeight = 0;

  node.children.forEach((child) => {
    const childHeight = layoutSubtree(child, depth + 1, currentY);
    currentY += childHeight + CARD_CONFIG.verticalSpacing;
    totalHeight += childHeight + CARD_CONFIG.verticalSpacing;
  });

  // 余分な間隔を除去
  totalHeight -= CARD_CONFIG.verticalSpacing;

  // 親ノードは子ノードの中央に配置
  const firstChildY = node.children[0].y;
  const lastChildY = node.children[node.children.length - 1].y;
  const centerY = (firstChildY + lastChildY) / 2;

  node.x = x;
  node.y = centerY;

  return Math.max(totalHeight, CARD_CONFIG.height);
}

/**
 * パートナー関係を取得
 */
export function getPartnerPairs(nodes: FamilyTreeNode[]): Array<{
  node1: FamilyTreeNode;
  node2: FamilyTreeNode;
}> {
  const pairs: Array<{ node1: FamilyTreeNode; node2: FamilyTreeNode }> = [];
  const processed = new Set<string>();

  nodes.forEach((node) => {
    node.partners.forEach((partnerName) => {
      const partner = nodes.find((n) => n.name === partnerName);
      if (partner) {
        const key1 = `${node.name}-${partnerName}`;
        const key2 = `${partnerName}-${node.name}`;

        if (!processed.has(key1) && !processed.has(key2)) {
          pairs.push({ node1: node, node2: partner });
          processed.add(key1);
          processed.add(key2);
        }
      }
    });
  });

  return pairs;
}

/**
 * 親子関係のエッジを取得
 */
export function getParentChildEdges(nodes: FamilyTreeNode[]): Array<{
  parent: FamilyTreeNode;
  child: FamilyTreeNode;
}> {
  const edges: Array<{ parent: FamilyTreeNode; child: FamilyTreeNode }> = [];

  nodes.forEach((parent) => {
    parent.children.forEach((child) => {
      edges.push({ parent, child });
    });
  });

  return edges;
}
