import React, { useState } from 'react';
import { View, Text, StyleSheet, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { palette } from '../../utils/colors';
import { fontSizes, spacing } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';
import { useKeepAwake } from 'expo-keep-awake';

export const Timer = ({ timerSubject, onTimerCancel, onTimerEnd }) => {
  const DEFAULT_TIME = 0.1;
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);
  const [minutes, setMinutes] = useState(DEFAULT_TIME);

  useKeepAwake();

  const onProgress = (currentProgress) => {
    setProgress(currentProgress);
  };

  const onTimerChange = (updatedMinutes) => {
    setMinutes(updatedMinutes);
    setProgress(1);
    setIsStarted(false);
  };

  const onCountdownEnd = () => {
    vibrate();
    setMinutes(DEFAULT_TIME);
    setProgress(1);
    setIsStarted(false);
    onTimerEnd();
  };

  const vibrate = () => {
    if (Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 5000);
    } else {
      Vibration.vibrate([400, 600, 400, 600, 400, 600, 400, 600, 400, 600]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onCountdownEnd}
        />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focusing on:</Text>
        <Text style={styles.task}>{timerSubject}</Text>
      </View>
      <View style={{ paddintTop: spacing.md }}>
        <ProgressBar
          progress={progress}
          color={palette.primaryAccent}
          style={{ height: 10 }}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Timing onChangeTime={onTimerChange} />
      </View>
      <View style={styles.buttonWrapper}>
        {isStarted ? (
          <RoundedButton title="Pause" size={100} onPress={() => setIsStarted(false)} />
        ) : (
          <RoundedButton title="Start" size={100} onPress={() => setIsStarted(true)} />
        )}
          <RoundedButton title="Cancel" size={100} onPress={() => onTimerCancel()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: palette.secondary,
    fontSize: fontSizes.xl,
    textAlign: 'center',
  },
  task: {
    color: palette.secondary,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 0.3,
    flexDirection: 'row',
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
