import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { Timer } from './src/features/timer/Timer';
import { palette } from './src/utils/colors';
import { spacing } from './src/utils/sizes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const STATUS = { COMPLETE: 1, CANCELLED: 0 };
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addToFocusHistory = (subject, status) => {
    if (focusSubject) {
      const key = focusHistory.length;
      setFocusHistory([...focusHistory, { subject, status, key }]);
    }
  };

  const saveFocusHistory = async () => {
    try {
      console.log('Persisting history...');
      await AsyncStorage.setItem('@focusHistory', JSON.stringify(focusHistory));
      console.log('Persisted');
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      console.log('Retrieving history...');
      const history = await AsyncStorage.getItem('@focusHistory');
      if (history && JSON.parse(history).length) {
        const parsedHistory = JSON.parse(history);
        console.log('Setting history to: ', parsedHistory);
        setFocusHistory(parsedHistory);
        console.log('Retrieved');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  useEffect(() => {
    loadFocusHistory();
  }, []);

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          timerSubject={focusSubject}
          onTimerCancel={() => {
            addToFocusHistory(focusSubject, STATUS.CANCELLED);
            setFocusSubject(null);
          }}
          onTimerEnd={() => {
            addToFocusHistory(focusSubject, STATUS.COMPLETE);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory
            focusHistory={focusHistory}
            onClearHistory={() => setFocusHistory([])}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.xl,
  },
});
