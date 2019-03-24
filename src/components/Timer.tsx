import * as React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputEndEditingEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export const secondsToMinutes = (secs: number) => {
  const minutes = Math.trunc(secs / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secs % 60).toString().padStart(2, '0');

  return { minutes, seconds };
};

interface ITimerProps {
  changeHandler: (time: number) => void;
  displayTime: number;
  isEditMode: boolean;
  endEditingHandler: () => void;
}

export const Timer: React.FunctionComponent<ITimerProps> = (props) => {
  const { minutes, seconds } = secondsToMinutes(props.displayTime);

  const endEditing = () => {
    props.endEditingHandler();
  };

  const changeText = (time: string) => {
    if (!isNaN(parseInt(time, 10))) {
      props.changeHandler(parseInt(time, 10) * 60);
    }
  };

  return (
    <View style={styles.displayContainer}>
      {!props.isEditMode && (
        <View style={styles.digitContainer}>
          <Text style={[styles.displayText, styles.digitSpace]}>{minutes}</Text>
          <Text style={styles.displayText}>:</Text>
          <Text style={[styles.displayText, styles.digitSpace]}>{seconds}</Text>
        </View>
      )}

      {props.isEditMode && (
        <View style={styles.digitContainer}>
          <TextInput
            autoFocus={true}
            keyboardType={'numeric'}
            onBlur={(_: NativeSyntheticEvent<TextInputEndEditingEventData>) =>
              endEditing()
            }
            onChangeText={(time: string) => changeText(time)}
            onEndEditing={(
              _: NativeSyntheticEvent<TextInputEndEditingEventData>,
            ) => endEditing()}
            style={[styles.displayText, styles.editSpace]}
            placeholder={minutes}
            selection={{ start: 0, end: 0 }}
          />
          <Text style={styles.displayText}>:00</Text>
        </View>
      )}
    </View>
  );
};

interface ITimerStyles {
  digitContainer: ViewStyle;
  digitSpace: ViewStyle;
  displayContainer: ViewStyle;
  displayText: TextStyle;
  editSpace: ViewStyle;
}

const styles = StyleSheet.create<ITimerStyles>({
  digitContainer: {
    flexDirection: 'row',
  },
  digitSpace: {
    width: 86,
  },
  displayContainer: {
    alignItems: 'center',
    backgroundColor: '#151515',
    height: 100,
  },
  displayText: {
    color: '#FFFFFF',
    fontSize: 76,
  },
  editSpace: {
    width: 100,
  },
});

export default Timer;
