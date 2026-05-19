import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useMemo, useState, useEffect, useRef } from 'react';

type Props = {
  /** Currently selected date as ISO YYYY-MM-DD, or null. */
  value: string | null;
  /** Called with ISO YYYY-MM-DD when a day is tapped. */
  onChange: (isoDate: string) => void;
  /** Inclusive max selectable date. Defaults to today. */
  maxDate?: Date;
  /** Inclusive min selectable date. Defaults to ~120 years before today. */
  minDate?: Date;
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
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

export default function CalendarPicker({ value, onChange, maxDate, minDate }: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const effectiveMax = useMemo(
    () => startOfDay(maxDate ?? today),
    [maxDate, today],
  );
  const effectiveMin = useMemo(() => {
    if (minDate) return startOfDay(minDate);
    const d = new Date(today);
    d.setFullYear(d.getFullYear() - 120);
    return d;
  }, [minDate, today]);

  const initial = parseIso(value) ?? today;
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
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goPrevYear = () => setViewYear((y) => y - 1);
  const goNextYear = () => setViewYear((y) => y + 1);

  const isOutOfRange = (date: Date): boolean => {
    return date < effectiveMin || date > effectiveMax;
  };

  const isSameDay = (a: Date | null, b: Date | null): boolean => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navGroup}>
          <Pressable
            onPress={goPrevYear}
            disabled={mode !== 'days'}
            style={({ pressed }) => [
              styles.navButton,
              pressed && mode === 'days' && styles.navPressed,
              mode !== 'days' && styles.navHidden,
            ]}
            accessibilityLabel="Previous year"
          >
            <Text style={styles.navText}>‹‹</Text>
          </Pressable>
          <Pressable
            onPress={goPrevMonth}
            disabled={mode !== 'days'}
            style={({ pressed }) => [
              styles.navButton,
              pressed && mode === 'days' && styles.navPressed,
              mode !== 'days' && styles.navHidden,
            ]}
            accessibilityLabel="Previous month"
          >
            <Text style={styles.navText}>‹</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setMode((m) => (m === 'days' ? 'years' : 'days'))}
          style={({ pressed }) => [
            styles.headerLabelButton,
            pressed && styles.headerLabelButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={mode === 'days' ? 'Choose year' : 'Back to days'}
        >
          <Text style={styles.headerLabel}>
            {mode === 'days' ? `${MONTH_NAMES[viewMonth]} ${viewYear}` : `${viewYear}`}
          </Text>
          <Text style={styles.headerLabelCaret}>{mode === 'days' ? '▾' : '▴'}</Text>
        </Pressable>

        <View style={styles.navGroup}>
          <Pressable
            onPress={goNextMonth}
            disabled={mode !== 'days'}
            style={({ pressed }) => [
              styles.navButton,
              pressed && mode === 'days' && styles.navPressed,
              mode !== 'days' && styles.navHidden,
            ]}
            accessibilityLabel="Next month"
          >
            <Text style={styles.navText}>›</Text>
          </Pressable>
          <Pressable
            onPress={goNextYear}
            disabled={mode !== 'days'}
            style={({ pressed }) => [
              styles.navButton,
              pressed && mode === 'days' && styles.navPressed,
              mode !== 'days' && styles.navHidden,
            ]}
            accessibilityLabel="Next year"
          >
            <Text style={styles.navText}>››</Text>
          </Pressable>
        </View>
      </View>

      {mode === 'days' ? (
        <>
          <View style={styles.weekRow}>
            {WEEKDAYS.map((d, i) => (
              <Text key={`${d}-${i}`} style={styles.weekday}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((day, idx) => {
              if (day === null) {
                return <View key={`empty-${idx}`} style={styles.cell} />;
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
                    styles.cell,
                    pressed && !disabled && styles.cellPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected, disabled }}
                >
                  <View
                    style={[
                      styles.dayPill,
                      isToday && styles.dayPillToday,
                      isSelected && styles.dayPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        disabled && styles.dayTextDisabled,
                        isToday && !isSelected && styles.dayTextToday,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
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
                style={({ pressed }) => [
                  styles.yearCell,
                  pressed && styles.yearCellPressed,
                ]}
                onPress={() => {
                  setViewYear(year);
                  setMode('days');
                }}
              >
                <View
                  style={[
                    styles.yearPill,
                    isThisYear && !isCurrent && styles.yearPillToday,
                    isCurrent && styles.yearPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.yearText,
                      isThisYear && !isCurrent && styles.yearTextToday,
                      isCurrent && styles.yearTextSelected,
                    ]}
                  >
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
    marginBottom: 12,
  },

  headerLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  headerLabelButtonPressed: {
    backgroundColor: '#eef7f9',
  },

  headerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  headerLabelCaret: {
    marginLeft: 6,
    color: '#49A3BD',
    fontSize: 12,
  },

  navGroup: {
    flexDirection: 'row',
  },

  navButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },

  navPressed: {
    opacity: 0.5,
  },

  navHidden: {
    opacity: 0,
  },

  navText: {
    fontSize: 18,
    color: '#49A3BD',
    fontWeight: '600',
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cellPressed: {
    opacity: 0.7,
  },

  dayPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayPillToday: {
    borderWidth: 1,
    borderColor: '#49A3BD',
  },

  dayPillSelected: {
    backgroundColor: '#49A3BD',
    borderWidth: 0,
  },

  dayText: {
    fontSize: 14,
    color: '#333',
  },

  dayTextDisabled: {
    color: '#ccc',
  },

  dayTextToday: {
    color: '#49A3BD',
    fontWeight: '600',
  },

  dayTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
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
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  yearPillToday: {
    borderWidth: 1,
    borderColor: '#49A3BD',
  },

  yearPillSelected: {
    backgroundColor: '#49A3BD',
    borderWidth: 0,
  },

  yearText: {
    fontSize: 14,
    color: '#333',
  },

  yearTextToday: {
    color: '#49A3BD',
    fontWeight: '600',
  },

  yearTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
