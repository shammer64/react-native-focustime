import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { fontSizes, spacing } from '../../utils/sizes';
import { palette } from '../../utils/sizes';
import { RoundedButton } from '../../components/RoundedButton';

export const FocusHistory = ({ focusHistory, onClearHistory }) => {
  const clearHistory = () => {
    onClearHistory();
  };

  const dimensions = Dimensions.get('window');
  const screenWidth = dimensions.width;

  const renderHistoryItem = ({ item }) => (
    <Text style={styles.historyItem(item.status)}>{item.subject}</Text>
  );

  return (
    <>
      <SafeAreaView style={{ flex: 0.5, alignItems: 'center' }}>
        <Text style={styles.title}>Stuff we have focused on:</Text>
        {focusHistory.length > 0 ? (
          <>
            <FlatList
              style={{
                flex: 1,
              }}
              contentContainerStyle={{ alignItems: 'center' }}
              data={focusHistory}
              keyExtractor={(item) => item.key}
              renderItem={renderHistoryItem}
            />
            <View style={styles.clearContainer}>
              <RoundedButton
                size={75}
                title="Clear"
                onPress={() => onClearHistory()}
              />
            </View>
          </>
        ) : (
          <Text style={styles.subTitle}>Add one!</Text>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  historyItem: (status) => ({
    color: status === 0 ? 'red' : 'green',
    fontSize: fontSizes.lg,
  }),
  title: {
    color: 'white',
    fontSize: fontSizes.lg,
  },
  subTitle: {
    color: 'white',
    fontSize: fontSizes.lg,
    textAlign: 'center',
  },
  clearContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
});
