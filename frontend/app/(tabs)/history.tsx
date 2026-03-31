import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, FONTS } from '../../src/theme';
import { useLanguage } from '../../src/language';
import { getDayCompletionMap, calculateStreak } from '../../src/storage';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { t, monthName, dayShorts, isRTL, rtl } = useLanguage();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<Record<string, { total: number; completed: number }>>({});
  const [streak, setStreak] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useFocusEffect(useCallback(() => {
    getDayCompletionMap().then(map => { setData(map); setStreak(calculateStreak(map)); });
  }, []));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const adjustedFirst = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const cells: (number | null)[] = [];
  for (let i = 0; i < adjustedFirst; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  function getDayColor(day: number): string | undefined {
    const d = data[dateStr(day)];
    if (!d || d.total === 0) return undefined;
    if (d.completed === d.total && d.total === 3) return colors.success;
    if (d.completed > 0) return colors.partial;
    return colors.fail;
  }

  const today = new Date();
  const isTodayFn = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => {
    const now = new Date();
    if (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth())) return;
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <ScrollView testID="history-screen" style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>

      <View style={styles.streakSection}>
        <Text testID="streak-counter" style={[styles.streakNum, { color: colors.accent, fontFamily: FONTS.serif }]}>{streak}</Text>
        <Text style={[styles.streakLabel, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>{t.history.streak}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={[styles.monthNav, rtl.row]}>
        <TouchableOpacity testID="prev-month-btn" onPress={prevMonth} hitSlop={12}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: colors.textPrimary, fontFamily: FONTS.serif }]}>
          {monthName(month)} {year}
        </Text>
        <TouchableOpacity testID="next-month-btn" onPress={nextMonth} hitSlop={12}>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.dayHeaders}>
        {dayShorts.map(d => (
          <View key={d} style={styles.dayHeaderCell}>
            <Text style={[styles.dayHeaderText, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>{d}</Text>
          </View>
        ))}
      </View>

      <View testID="calendar-grid" style={styles.calGrid}>
        {cells.map((day, i) => {
          const color = day ? getDayColor(day) : undefined;
          const todayMark = day ? isTodayFn(day) : false;
          return (
            <View key={i} style={styles.calCell}>
              {day !== null && (
                <View style={[styles.calDayWrap, todayMark && { borderWidth: 1, borderColor: colors.accent }]}>
                  <Text style={[styles.calDayNum, { color: color ? '#FFF' : colors.textPrimary, fontFamily: FONTS.mono },
                    color ? { backgroundColor: color } : null]}>{day}</Text>
                  {color && <View style={[styles.calDot, { backgroundColor: color }]} />}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>{t.history.full}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.partial }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>{t.history.partial}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.fail }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>{t.history.none}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 28, paddingBottom: 40 },
  streakSection: { alignItems: 'center', marginTop: 8, marginBottom: 16 },
  streakNum: { fontSize: 80, lineHeight: 88 },
  streakLabel: { fontSize: 11, letterSpacing: 3, marginTop: 4 },
  divider: { height: 1, marginVertical: 16 },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  monthText: { fontSize: 22 },
  dayHeaders: { flexDirection: 'row', marginBottom: 8 },
  dayHeaderCell: { flex: 1, alignItems: 'center' },
  dayHeaderText: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.285%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2 },
  calDayWrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  calDayNum: { fontSize: 14, textAlign: 'center', width: 28, height: 28, lineHeight: 28 },
  calDot: { width: 5, height: 5, borderRadius: 0, marginTop: 2 },
  legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 24 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10 },
  legendText: { fontSize: 11, letterSpacing: 0.5 },
});
