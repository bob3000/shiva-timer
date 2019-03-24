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

interface ITimerProps {
  changeHandler: (time: number) => void;
  displayTime: number;
  isEditMode: boolean;
  endEditingHandler: () => void;
}

export const Timer: React.FunctionComponent<ITimerProps> = (props) => {
  const minutes = Math.trunc(props.displayTime / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (props.displayTime % 60).toString().padStart(2, '0');

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
    width: 90,
  },
  displayContainer: {
    backgroundColor: '#151515',
    height: 100,
    width: 200,
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
