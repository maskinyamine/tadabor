import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path, Line } from 'react-native-svg';

interface MosaicBackgroundProps {
  /** Couleur du motif (défaut : or #C9A84C) */
  color?: string;
  /** Opacité du motif 0–1 (défaut : 0.10) */
  opacity?: number;
  /** Hauteur du fond (défaut : 100 %) */
  svgHeight?: number | string;
}

/**
 * Fond mosaïque islamique — motif géométrique octogonal style zellige.
 * Positionné en absolu pour couvrir le parent (le parent doit avoir position:relative).
 *
 * Le tile 60×60 contient :
 *  - Un octogone central en traits
 *  - Quatre lignes de coin reliant l'octogone aux coins de la tuile
 *  - Quatre lignes de bord reliant l'octogone aux milieux des côtés
 * Quand les tuiles s'assemblent, cela forme le classique pattern étoile-croix.
 */
export function MosaicBackground({
  color = '#C9A84C',
  opacity = 0.10,
  svgHeight = '100%',
}: MosaicBackgroundProps) {
  const { width } = useWindowDimensions();

  // ── Tuile 60×60 ──────────────────────────────────────────────────────────
  // Octogone inscrit dans un cercle r=22, centré en (30,30)
  // d = r / √2 ≈ 15.56  → point diagonal
  const cx = 30;
  const cy = 30;
  const r  = 22;
  const d  = r / Math.SQRT2; // ≈ 15.56

  // 8 sommets de l'octogone (sens horaire depuis le haut)
  const oct = [
    [cx,     cy - r ],          // haut
    [cx + d, cy - d ],          // haut-droite
    [cx + r, cy     ],          // droite
    [cx + d, cy + d ],          // bas-droite
    [cx,     cy + r ],          // bas
    [cx - d, cy + d ],          // bas-gauche
    [cx - r, cy     ],          // gauche
    [cx - d, cy - d ],          // haut-gauche
  ];

  // Chemin SVG de l'octogone
  const octPath = oct
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ') + ' Z';

  const stroke = color;
  const sw     = 0.9; // épaisseur du trait

  return (
    <Svg
      width="100%"
      height={svgHeight}
      style={[StyleSheet.absoluteFillObject, { opacity }]}
      preserveAspectRatio="xMidYMid slice"
    >
      <Defs>
        <Pattern
          id="islaicMosaic"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* ── Octogone central ── */}
          <Path
            d={octPath}
            stroke={stroke}
            strokeWidth={sw}
            fill="none"
          />

          {/* ── Lignes coin → coin de la tuile ── */}
          {/* Haut-droite : sommet [1] → coin (60,0) */}
          <Line x1={oct[1][0].toFixed(2)} y1={oct[1][1].toFixed(2)} x2="60" y2="0"  stroke={stroke} strokeWidth={sw} />
          {/* Bas-droite  : sommet [3] → coin (60,60) */}
          <Line x1={oct[3][0].toFixed(2)} y1={oct[3][1].toFixed(2)} x2="60" y2="60" stroke={stroke} strokeWidth={sw} />
          {/* Bas-gauche  : sommet [5] → coin (0,60) */}
          <Line x1={oct[5][0].toFixed(2)} y1={oct[5][1].toFixed(2)} x2="0"  y2="60" stroke={stroke} strokeWidth={sw} />
          {/* Haut-gauche : sommet [7] → coin (0,0) */}
          <Line x1={oct[7][0].toFixed(2)} y1={oct[7][1].toFixed(2)} x2="0"  y2="0"  stroke={stroke} strokeWidth={sw} />

          {/* ── Lignes milieu de bord → bord de la tuile ── */}
          {/* Haut  : sommet [0] → bord haut  (30,0) */}
          <Line x1={oct[0][0].toFixed(2)} y1={oct[0][1].toFixed(2)} x2="30" y2="0"  stroke={stroke} strokeWidth={sw} />
          {/* Droite : sommet [2] → bord droit (60,30) */}
          <Line x1={oct[2][0].toFixed(2)} y1={oct[2][1].toFixed(2)} x2="60" y2="30" stroke={stroke} strokeWidth={sw} />
          {/* Bas   : sommet [4] → bord bas   (30,60) */}
          <Line x1={oct[4][0].toFixed(2)} y1={oct[4][1].toFixed(2)} x2="30" y2="60" stroke={stroke} strokeWidth={sw} />
          {/* Gauche : sommet [6] → bord gauche (0,30) */}
          <Line x1={oct[6][0].toFixed(2)} y1={oct[6][1].toFixed(2)} x2="0"  y2="30" stroke={stroke} strokeWidth={sw} />
        </Pattern>
      </Defs>

      {/* Remplissage avec le motif */}
      <Rect width="100%" height="100%" fill="url(#islaicMosaic)" />
    </Svg>
  );
}
