import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Keyboard,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, FONTS } from '../../src/theme';
import { Task } from '../../src/types';
import { getTasksForDate, saveTasksForDate, toDateStr, formatTurkishDate } from '../../src/storage';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function TaskSlot({
  task,
  index,
  isEditing,
  editText,
  onChangeText,
  onSubmit,
  onStartEdit,
  onComplete,
  colors,
}: {
  task: Task | undefined;
  index: number;
  isEditing: boolean;
  editText: string;
  onChangeText: (t: string) => void;
  onSubmit: () => void;
  onStartEdit: (i: number) => void;
  onComplete: (i: number) => void;
  colors: any;
}) {
  const strikeProgress = useSharedValue(task?.completed ? 1 : 0);
  const textOpacity = useSharedValue(task?.completed ? 0.35 : 1);
  const checkScale = useSharedValue(task?.completed ? 1 : 0);
  const wasCompleted = useRef(task?.completed);

  useEffect(() => {
    if (task?.completed && !wasCompleted.current) {
      strikeProgress.value = withTiming(1, { duration: 280 });
      textOpacity.value = withTiming(0.35, { duration: 280 });
      checkScale.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withTiming(1, { duration: 100 }),
      );
    }
    wasCompleted.current = task?.completed;
  }, [task?.completed]);

  const strikeStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: 0,
    top: '50%' as any,
    height: 2,
    backgroundColor: colors.accent,
    width: `${strikeProgress.value * 100}%` as any,
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  if (isEditing) {
    return (
      <View style={[styles.slot, { borderBottomColor: colors.border }]}>
        <Text style={[styles.slotNumber, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          {index + 1}.
        </Text>
        <TextInput
          testID={`task-input-${index + 1}`}
          style={[styles.slotInput, { color: colors.textPrimary, fontFamily: FONTS.mono }]}
          value={editText}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          onBlur={onSubmit}
          placeholder={`Görev ${index + 1}`}
          placeholderTextColor={colors.textSecondary}
          autoFocus
          returnKeyType="done"
          maxLength={100}
        />
      </View>
    );
  }

  if (!task) {
    return (
      <TouchableOpacity
        testID={`task-slot-${index + 1}`}
        style={[styles.slot, { borderBottomColor: colors.border }]}
        onPress={() => onStartEdit(index)}
        activeOpacity={0.6}
      >
        <Text style={[styles.slotNumber, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          {index + 1}.
        </Text>
        <Text style={[styles.slotPlaceholder, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          Görev ekle
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      testID={`task-slot-${index + 1}`}
      style={[styles.slot, { borderBottomColor: colors.border }]}
      onPress={() => !task.completed && onComplete(index)}
      activeOpacity={task.completed ? 1 : 0.6}
      disabled={task.completed}
    >
      <Text style={[styles.slotNumber, { color: task.completed ? colors.textSecondary : colors.textPrimary, fontFamily: FONTS.mono }]}>
        {index + 1}.
      </Text>
      <View style={styles.slotTextWrap}>
        <Animated.Text
          style={[styles.slotText, { color: colors.textPrimary, fontFamily: FONTS.mono }, textAnimStyle]}
          numberOfLines={2}
        >
          {task.text}
        </Animated.Text>
        <Animated.View style={strikeStyle} />
      </View>
      {task.completed && (
        <Animated.View style={checkAnimStyle}>
          <Ionicons name="checkmark" size={22} color={colors.accent} />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationOpacity = useSharedValue(0);
  const celebrationScale = useSharedValue(0.8);

  const today = new Date();
  const todayStr = toDateStr(today);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  async function loadTasks() {
    const loaded = await getTasksForDate(todayStr);
    setTasks(loaded);
  }

  function startEditing(index: number) {
    if (tasks.length >= 3 && index >= tasks.length) return;
    setEditingIndex(index);
    setEditText('');
  }

  async function submitTask() {
    if (editingIndex === null) return;
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditingIndex(null);
      setEditText('');
      Keyboard.dismiss();
      return;
    }
    const newTask: Task = { id: genId(), text: trimmed, completed: false };
    const updated = [...tasks];
    if (editingIndex < tasks.length) {
      updated[editingIndex] = newTask;
    } else {
      updated.push(newTask);
    }
    setTasks(updated);
    await saveTasksForDate(todayStr, updated);
    setEditingIndex(null);
    setEditText('');
    Keyboard.dismiss();
  }

  async function completeTask(index: number) {
    if (!tasks[index] || tasks[index].completed) return;
    const updated = [...tasks];
    updated[index] = { ...updated[index], completed: true };
    setTasks(updated);
    await saveTasksForDate(todayStr, updated);

    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}

    const completedNow = updated.filter(t => t.completed).length;
    if (completedNow === 3 && updated.length === 3) {
      setShowCelebration(true);
      celebrationOpacity.value = withTiming(1, { duration: 250 });
      celebrationScale.value = withTiming(1, { duration: 300 });
      try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      setTimeout(() => {
        celebrationOpacity.value = withTiming(0, { duration: 500 });
        celebrationScale.value = withTiming(0.8, { duration: 500 });
        setTimeout(() => setShowCelebration(false), 600);
      }, 1400);
    }
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const slots = [0, 1, 2];

  const celebrationAnimStyle = useAnimatedStyle(() => ({
    opacity: celebrationOpacity.value,
    transform: [{ scale: celebrationScale.value }],
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View testID="home-screen" style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date Header */}
          <View style={styles.dateSection}>
            <Text
              testID="date-header"
              style={[styles.dateText, { color: colors.textPrimary, fontFamily: FONTS.serif }]}
            >
              {formatTurkishDate(today)}
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Task Slots */}
          <View style={styles.tasksSection}>
            {slots.map(i => (
              <TaskSlot
                key={i}
                index={i}
                task={tasks[i]}
                isEditing={editingIndex === i}
                editText={editText}
                onChangeText={setEditText}
                onSubmit={submitTask}
                onStartEdit={startEditing}
                onComplete={completeTask}
                colors={colors}
              />
            ))}
          </View>

          {/* Counter */}
          <View style={styles.counterSection}>
            <Text style={[styles.counterNum, { color: colors.accent, fontFamily: FONTS.serif }]}>
              {completedCount}
            </Text>
            <Text style={[styles.counterLabel, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
              / {tasks.length > 0 ? tasks.length : 3} TAMAMLANDI
            </Text>
          </View>
        </ScrollView>

        {/* Celebration overlay */}
        {showCelebration && (
          <Animated.View
            testID="celebration-overlay"
            style={[styles.celebration, { backgroundColor: colors.background, pointerEvents: 'none' }, celebrationAnimStyle]}
          >
            <Ionicons name="checkmark-done-circle" size={72} color={colors.accent} />
            <Text style={[styles.celebrationText, { color: colors.textPrimary, fontFamily: FONTS.serif }]}>
              Bugün tamam!
            </Text>
            <Text style={[styles.celebrationSub, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
              3/3 GÖREV TAMAMLANDI
            </Text>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 40 },
  dateSection: { marginTop: 24, marginBottom: 8 },
  dateText: { fontSize: 32, lineHeight: 42, letterSpacing: -0.5 },
  divider: { height: 1, marginTop: 16 },
  tasksSection: { marginTop: 32 },
  slot: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, minHeight: 68 },
  slotNumber: { fontSize: 16, width: 32, letterSpacing: 1 },
  slotPlaceholder: { fontSize: 18, flex: 1, opacity: 0.5 },
  slotInput: { fontSize: 18, flex: 1, paddingVertical: 0 },
  slotTextWrap: { flex: 1, position: 'relative', justifyContent: 'center' },
  slotText: { fontSize: 18, lineHeight: 26 },
  counterSection: { flexDirection: 'row', alignItems: 'baseline', marginTop: 48, justifyContent: 'center' },
  counterNum: { fontSize: 56, lineHeight: 64 },
  counterLabel: { fontSize: 14, marginLeft: 4, letterSpacing: 1.5 },
  celebration: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  celebrationText: { fontSize: 36, marginTop: 16, letterSpacing: -0.5 },
  celebrationSub: { fontSize: 12, marginTop: 8, letterSpacing: 2 },
});
