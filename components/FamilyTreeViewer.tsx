'use client';

// 家系図ビューアー（SVG直接表示・ズーム・パン機能付き）

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LESSER_PANDAS } from '@/lib/pandaData';
import { ANCESTOR_PANDAS } from '@/lib/ancestorPandaData';

export function FamilyTreeViewer() {
  const router = useRouter();
  const [zoom, setZoom] = useState(0.4); // 初期表示は縮小（SVGが大きいため）
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgContent, setSvgContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // パンダ名からIDへのマッピングを作成
  const createPandaNameToIdMap = useCallback(() => {
    const map = new Map<string, string>();

    // 現在飼育中および過去の個体
    LESSER_PANDAS.forEach(panda => {
      map.set(panda.name, panda.id);
      if (panda.nameEn) {
        map.set(panda.nameEn.toLowerCase(), panda.id);
      }
    });

    // 先祖個体
    ANCESTOR_PANDAS.forEach(panda => {
      map.set(panda.name, panda.id);
      if (panda.nameEn) {
        map.set(panda.nameEn.toLowerCase(), panda.id);
      }
    });

    return map;
  }, []);

  // SVGファイルを読み込む
  useEffect(() => {
    fetch('/family-tree/red-panda-family-tree.svg')
      .then(res => res.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error('Failed to load SVG:', err));
  }, []);

  // SVGを挿入してクリックハンドラーを設定
  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;

    const container = svgContainerRef.current;
    container.innerHTML = svgContent;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // すべてのg要素（aria-label付き）を取得
    const groups = svg.querySelectorAll('g[aria-label]');
    const nameToIdMap = createPandaNameToIdMap();

    groups.forEach(group => {
      const ariaLabel = group.getAttribute('aria-label');
      if (!ariaLabel) return;

      // aria-labelからパンダ名を抽出（括弧がある場合は両方試す）
      let pandaId: string | undefined;

      // 完全一致を試す
      pandaId = nameToIdMap.get(ariaLabel);

      // 括弧を除いた部分でマッチを試す（例: "胖胖（パンパン）" → "胖胖"）
      if (!pandaId) {
        const withoutParens = ariaLabel.replace(/[（(].*?[）)]/g, '').trim();
        pandaId = nameToIdMap.get(withoutParens);
      }

      // 括弧内のカタカナ部分でマッチを試す（例: "胖胖（パンパン）" → "パンパン"）
      if (!pandaId) {
        const match = ariaLabel.match(/[（(](.*?)[）)]/);
        if (match && match[1]) {
          pandaId = nameToIdMap.get(match[1]);
        }
      }

      if (pandaId) {
        // クリック可能にする
        (group as SVGGElement).style.cursor = 'pointer';

        // ホバー時のスタイル
        (group as SVGGElement).addEventListener('mouseenter', () => {
          const rect = group.querySelector('rect');
          if (rect) {
            rect.setAttribute('data-original-stroke', rect.getAttribute('stroke') || 'none');
            rect.setAttribute('data-original-stroke-width', rect.getAttribute('stroke-width') || '1');
            rect.setAttribute('stroke', '#2563eb');
            rect.setAttribute('stroke-width', '3');
          }
        });

        (group as SVGGElement).addEventListener('mouseleave', () => {
          const rect = group.querySelector('rect');
          if (rect) {
            const originalStroke = rect.getAttribute('data-original-stroke');
            const originalWidth = rect.getAttribute('data-original-stroke-width');
            if (originalStroke) rect.setAttribute('stroke', originalStroke);
            if (originalWidth) rect.setAttribute('stroke-width', originalWidth);
          }
        });

        // クリックイベント
        (group as SVGGElement).addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/pandas/${pandaId}`);
        });
      }
    });
  }, [svgContent, createPandaNameToIdMap, router]);

  // ズーム操作
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.2));

  // ドラッグ操作
  const handleMouseDown = (e: React.MouseEvent) => {
    // SVG要素自体がクリックされた場合のみドラッグを開始
    if ((e.target as HTMLElement).tagName === 'svg' ||
        (e.target as HTMLElement).classList.contains('svg-wrapper')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden relative">
      {/* コントロールパネル */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white p-2 rounded-lg shadow-md">
        <button
          onClick={handleZoomOut}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          aria-label="縮小"
        >
          −
        </button>
        <span className="px-3 py-2 text-sm font-medium">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          aria-label="拡大"
        >
          +
        </button>
        <button
          onClick={() => {
            setZoom(0.4);
            setPan({ x: 0, y: 0 });
          }}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded ml-2"
        >
          リセット
        </button>
      </div>

      {/* SVGコンテナ */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="svg-wrapper"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s',
            display: 'inline-block',
          }}
        >
          <div ref={svgContainerRef} />
        </div>
      </div>

      {/* 操作説明 */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm text-gray-600 max-w-xs">
        <p className="font-semibold mb-1">操作方法</p>
        <ul className="text-xs space-y-1">
          <li>• ドラッグで移動、ボタンでズーム</li>
          <li>• 個体名をクリックするとプロフィールページへ</li>
          <li className="text-gray-400">※プロフィールがない個体はクリックできません</li>
        </ul>
      </div>
    </div>
  );
}
