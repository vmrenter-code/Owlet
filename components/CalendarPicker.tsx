import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';

type Props = {
  value: string | null;
  onChange: (isoDate: string) => void;
  maxDate?: Date;
  minDate?: Date;
  /** Month shown when no date is selected yet */
  defaultViewDate?: Date;
};

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toIso(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function parseIso(iso: string | null): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const ChevronLeft = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke="#5058b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRight = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke="#5058b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronsLeft = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" stroke="#5058b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronsRight = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M13 17l5-5-5-5M6 17l5-5-5-5" stroke="#5058b4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CaretDown = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke="#5058b4" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CaretUp = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke="#5058b4" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function CalendarPicker({ value, onChange, maxDate, minDate, defaultViewDate }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const calendarPadding = 40 + 8;
  const cellSize = Math.floor((screenWidth - calendarPadding) / 7);

  const today = useMemo(() => startOfDay(new Date()), []);
  const effectiveMax = useMemo(() => startOfDay(maxDate ?? today), [maxDate, today]);
  const effectiveMin = useMemo(() => {
    if (minDate) return startOfDay(minDate);
    const d = new Date(today);
    d.setFullYear(d.getFullYear() - 120);
    return d;
  }, [minDate, today]);

  const initial = parseIso(value) ?? startOfDay(defaultViewDate ?? today);
  const [viewYear, setViewYear] = useState<number>(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initial.getMonth());
  const [mode, setMode] = useState<'days' | 'years'>('days');

  const selected = parseIso(value);

  const yearScrollRef = useRef<ScrollView>(null);
  const yearRowHeight = 48;
  const yearsPerRow = 4;
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = effectiveMax.getFullYear(); y >= effectiveMin.getFullYear(); y -= 1) {
      arr.push(y);
    }
    return arr;
  }, [effectiveMax, effectiveMin]);

  useEffect(() => {
    if (mode !== 'years') return;
    const idx = years.indexOf(viewYear);
    if (idx < 0) return;
    const row = Math.floor(idx / yearsPerRow);
    const offsetY = Math.max(0, row * yearRowHeight - 80);
    requestAnimationFrame(() => {
      yearScrollRef.current?.scrollTo({ y: offsetY, animated: false });
    });
  }, [mode, years, viewYear]);

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else { setViewMonth((m) => m - 1); }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else { setViewMonth((m) => m + 1); }
  };

  const goPrevYear = () => setViewYear((y) => y - 1);
  const goNextYear = () => setViewYear((y) => y + 1);

  const isOutOfRange = (date: Date): boolean => date < effectiveMin || date > effectiveMax;

  const isSameDay = (a: Date | null, b: Date | null): boolean => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const pillSize = Math.min(cellSize - 4, 36);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navGroup}>
          <Pressable
            onPress={goPrevYear}
            disabled={mode !== 'days'}
            style={({ pressed }) => [styles.navButton, pressed && mode === 'days' && styles.navPressed, mode !== 'days' && styles.navHidden]}
            accessibilityRole="button"
            accessibilityLabel="Previous year"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronsLeft />
          </Pressable>
          <Pressable
            onPress={goPrevMonth}
            disabled={mode !== 'days'}
            style={({ pressed }) => [styles.navButton, pressed && mode === 'days' && styles.navPressed, mode !== 'days' && styles.navHidden]}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setMode((m) => (m === 'days' ? 'years' : 'days'))}
          style={({ pressed }) => [styles.headerLabelButton, pressed && styles.headerLabelButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel={mode === 'days' ? 'Choose year' : 'Back to days'}
        >
          <Text style={styles.headerLabel}>
            {mode === 'days' ? `${MONTH_NAMES[viewMonth]} ${viewYear}` : `${viewYear}`}
          </Text>
          <View style={styles.headerLabelCaret}>
            {mode === 'days' ? <CaretDown /> : <CaretUp />}
          </View>
        </Pressable>

        <View style={styles.navGroup}>
          <Pressable
            onPress={goNextMonth}
            disabled={mode !== 'days'}
            style={({ pressed }) => [styles.navButton, pressed && mode === 'days' && styles.navPressed, mode !== 'days' && styles.navHidden]}
            accessibilityRole="button"
            accessibilityLabel="Next month"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronRight />
          </Pressable>
          <Pressable
            onPress={goNextYear}
            disabled={mode !== 'days'}
            style={({ pressed }) => [styles.navButton, pressed && mode === 'days' && styles.navPressed, mode !== 'days' && styles.navHidden]}
            accessibilityRole="button"
            accessibilityLabel="Next year"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronsRight />
          </Pressable>
        </View>
      </View>

      {mode === 'days' ? (
        <>
          <View style={styles.weekRow}>
            {WEEKDAYS.map((d, i) => (
              <View key={`${d}-${i}`} style={[styles.weekdayCell, { width: cellSize }]}>
                <Text style={styles.weekday}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((day, idx) => {
              if (day === null) {
                return <View key={`empty-${idx}`} style={{ width: cellSize, height: cellSize }} />;
              }
              const cellDate = new Date(viewYear, viewMonth, day);
              const disabled = isOutOfRange(cellDate);
              const isSelected = isSameDay(cellDate, selected);
              const isToday = isSameDay(cellDate, today);

              return (
                <Pressable
                  key={`d-${day}`}
                  disabled={disabled}
                  onPress={() => onChange(toIso(viewYear, viewMonth, day))}
                  style={({ pressed }) => [
                    { width: cellSize, height: cellSize, alignItems: 'center', justifyContent: 'center' },
                    pressed && !disabled && styles.cellPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${MONTH_NAMES[viewMonth]} ${day} ${viewYear}`}
                  accessibilityState={{ selected: isSelected, disabled }}
                >
                  <View style={[
                    styles.dayPill,
                    { width: pillSize, height: pillSize, borderRadius: pillSize / 2 },
                    isToday && styles.dayPillToday,
                    isSelected && styles.dayPillSelected,
                  ]}>
                    <Text style={[
                      styles.dayText,
                      disabled && styles.dayTextDisabled,
                      isToday && !isSelected && styles.dayTextToday,
                      isSelected && styles.dayTextSelected,
                    ]}>
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <ScrollView
          ref={yearScrollRef}
          style={styles.yearScroll}
          contentContainerStyle={styles.yearGrid}
          showsVerticalScrollIndicator={false}
        >
          {years.map((year) => {
            const isCurrent = year === viewYear;
            const isThisYear = year === today.getFullYear();
            return (
              <Pressable
                key={year}
                style={({ pressed }) => [styles.yearCell, pressed && styles.yearCellPressed]}
                onPress={() => { setViewYear(year); setMode('days'); }}
                accessibilityRole="button"
                accessibilityLabel={`Select year ${year}`}
                accessibilityState={{ selected: isCurrent }}
              >
                <View style={[
                  styles.yearPill,
                  isThisYear && !isCurrent && styles.yearPillToday,
                  isCurrent && styles.yearPillSelected,
                ]}>
                  <Text style={[
                    styles.yearText,
                    isThisYear && !isCurrent && styles.yearTextToday,
                    isCurrent && styles.yearTextSelected,
                  ]}>
                    {year}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  headerLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },

  headerLabelButtonPressed: {
    backgroundColor: '#f0fafa',
  },

  headerLabel: {
    fontSize: 16,
    fontFamily: 'NotoSans-SemiBold',
    color: '#151515',
    letterSpacing: -0.2,
  },

  headerLabelCaret: {
    marginLeft: 6,
  },

  navGroup: {
    flexDirection: 'row',
    gap: 4,
  },

  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  navPressed: {
    backgroundColor: '#f0fafa',
  },

  navHidden: {
    opacity: 0,
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  weekdayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },

  weekday: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'NotoSans-SemiBold',
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cellPressed: {
    opacity: 0.7,
  },

  dayPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayPillToday: {
    borderWidth: 1.5,
    borderColor: '#5058b4',
  },

  dayPillSelected: {
    backgroundColor: '#5058b4',
    borderWidth: 0,
  },

  dayText: {
    fontSize: 14,
    color: '#151515',
    fontFamily: 'NotoSans-Regular',
  },

  dayTextDisabled: {
    color: 'rgba(0,0,0,0.2)',
  },

  dayTextToday: {
    color: '#5058b4',
    fontFamily: 'NotoSans-SemiBold',
  },

  dayTextSelected: {
    color: '#ffffff',
    fontFamily: 'NotoSans-SemiBold',
  },

  yearScroll: {
    maxHeight: 240,
  },

  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },

  yearCell: {
    width: '25%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  yearCellPressed: {
    opacity: 0.7,
  },

  yearPill: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  yearPillToday: {
    borderWidth: 1.5,
    borderColor: '#5058b4',
  },

  yearPillSelected: {
    backgroundColor: '#5058b4',
    borderWidth: 0,
  },

  yearText: {
    fontSize: 14,
    color: '#151515',
    fontFamily: 'NotoSans-Regular',
  },

  yearTextToday: {
    color: '#5058b4',
    fontFamily: 'NotoSans-SemiBold',
  },

  yearTextSelected: {
    color: '#ffffff',
    fontFamily: 'NotoSans-SemiBold',
  },
});