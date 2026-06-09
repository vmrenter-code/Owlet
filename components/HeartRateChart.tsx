import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Svg, Polyline, Line, Text as SvgText, Rect } from 'react-native-svg';
import type { HeartRateDataPoint } from '../context/ScreeningContext';

interface Props {
  data: HeartRateDataPoint[];
}

const PAD = { top: 20, right: 16, bottom: 36, left: 44 };
const CHART_HEIGHT = 180;

export default function HeartRateChart({ data }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const W = screenWidth - 48;
  const chartW = W - PAD.left - PAD.right;
  const chartH = CHART_HEIGHT - PAD.top - PAD.bottom;

  const stats = useMemo(() => {
    if (!data.length) return null;
    const bpms = data.map(p => p.bpm);
    return {
      min: Math.min(...bpms),
      max: Math.max(...bpms),
      avg: Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length),
    };
  }, [data]);

  const { points, gridValues, xLabels } = useMemo(() => {
    if (!data.length) return { points: '', gridValues: [], xLabels: [] };

    const bpms = data.map(p => p.bpm);
    const times = data.map(p => p.time);
    const rawMin = Math.min(...bpms);
    const rawMax = Math.max(...bpms);
    const minBpm = rawMin - 5;
    const maxBpm = rawMax + 5;
    const bpmRange = maxBpm - minBpm || 1;
    const maxTime = Math.max(...times) || 1;

    const toX = (t: number) => PAD.left + (t / maxTime) * chartW;
    const toY = (b: number) => PAD.top + chartH - ((b - minBpm) / bpmRange) * chartH;

    const pts = data.map(p => `${toX(p.time).toFixed(1)},${toY(p.bpm).toFixed(1)}`).join(' ');

    // 4 evenly-spaced round BPM grid lines
    const step = Math.ceil((rawMax - rawMin + 10) / 4 / 5) * 5 || 10;
    const startVal = Math.floor(minBpm / step) * step;
    const grid: { bpm: number; y: number }[] = [];
    for (let b = startVal; b <= maxBpm + step; b += step) {
      const y = toY(b);
      if (y >= PAD.top - 2 && y <= PAD.top + chartH + 2) {
        grid.push({ bpm: b, y });
      }
    }

    // 5 evenly-spaced time labels on X axis
    const xl = Array.from({ length: 5 }, (_, i) => {
      const frac = i / 4;
      return { label: `${Math.round(frac * maxTime)}s`, x: PAD.left + frac * chartW };
    });

    return { points: pts, gridValues: grid, xLabels: xl };
  }, [data, chartW, chartH]);

  if (!data.length) {
    return (
      <View style={[styles.container, styles.empty]}>
        <Text style={styles.emptyText}>No heart rate data recorded</Text>
        <Text style={styles.emptyHint}>Connect a Polar H9 before screening to capture BPM data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Rate During Screening</Text>
      <Svg width={W} height={CHART_HEIGHT}>
        <Rect x={0} y={0} width={W} height={CHART_HEIGHT} fill="transparent" />

        {/* Horizontal grid lines */}
        {gridValues.map(({ bpm, y }) => (
          <React.Fragment key={bpm}>
            <Line
              x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
              stroke="rgba(255,255,255,0.07)" strokeWidth={1}
            />
            <SvgText x={PAD.left - 6} y={y + 4} fill="#777" fontSize={10} textAnchor="end">
              {bpm}
            </SvgText>
          </React.Fragment>
        ))}

        {/* Axes */}
        <Line
          x1={PAD.left} y1={PAD.top}
          x2={PAD.left} y2={PAD.top + chartH}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1}
        />
        <Line
          x1={PAD.left} y1={PAD.top + chartH}
          x2={W - PAD.right} y2={PAD.top + chartH}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1}
        />

        {/* Heart rate line */}
        {points.length > 0 && (
          <Polyline
            points={points}
            fill="none"
            stroke="#ff6b6b"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* X-axis time labels */}
        {xLabels.map(({ label, x }) => (
          <SvgText key={label} x={x} y={CHART_HEIGHT - 6} fill="#777" fontSize={10} textAnchor="middle">
            {label}
          </SvgText>
        ))}
      </Svg>

      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.avg}</Text>
            <Text style={styles.statLabel}>Avg BPM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.min}</Text>
            <Text style={styles.statLabel}>Min BPM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.max}</Text>
            <Text style={styles.statLabel}>Max BPM</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12122a',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  empty: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 2,
    letterSpacing: 0.2,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyHint: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statValue: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
});
