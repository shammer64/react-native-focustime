import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSizes, spacing } from '../utils/sizes';
import { palette } from '../utils/colors';

const minutesToMillis = (minutes) => {
  return minutes * 60 * 1000;
};
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({
  minutes = 20,
  isPaused = true,
  onProgress,
  onEnd,
  ...props
}) => {
  const [millis, setMillis] = useState(minutesToMillis(minutes));
  const minutesRemaining = Math.floor(millis / 1000 / 60) % 60;
  const secondsRemaining = Math.floor(millis / 1000) % 60;
  const interval = React.useRef(null);
  const countdown = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        return time;
      }
      const timeRemaining = time - 1000;
      return timeRemaining;
    });
  };

  useEffect(() => {
    onProgress(millis / minutesToMillis(minutes));
    if (millis <= 0) {
      onEnd();
    }
  }, [millis]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    } else {
      interval.current = setInterval(countdown, 1000);
      return () => clearInterval(interval.current);
    }
  }, [isPaused]);

  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  return (
    <View>
      <Text style={styles.text}>
        {formatTime(minutesRemaining)}:{formatTime(secondsRemaining)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: palette.secondary,
    padding: spacing.lg,
    textAlign: 'center',
    backgroundColor: palette.primaryAccent,
  },
});
