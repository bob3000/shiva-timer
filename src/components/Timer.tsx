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

interface ITimerStyles {
  digitContainer: ViewStyle;
  digitSpace: ViewStyle;
  displayContainer: ViewStyle;
  displayText: TextStyle;
  titleText: TextStyle;
}

export interface ITimerProps {
  backgroundColor?: string;
  changeHandler?: (time: number) => void;
  digitSpace?: number;
  displayTime: number;
  displayTimeStyle?: TextStyle;
  isEditMode?: boolean;
  endEditingHandler?: () => void;
  title?: string;
}

export enum TimerType {
  digit = 1,
  slider,
}

export interface ITimerState {
  intervals?: number[];
  isEditing?: boolean;
  timerType: TimerType;
  timeCurrent: number;
  timeTotal: number;
}

export const Timer: React.FunctionComponent<ITimerProps> = (props) => {
  const { minutes, seconds } = secondsToMinutes(props.displayTime);

  const endEditing = () => {
    if (props.endEditingHandler) props.endEditingHandler();
  };

  const changeText = (time: string) => {
    if (!isNaN(parseInt(time, 10)) && props.changeHandler) {
      props.changeHandler(parseInt(time, 10) * 60);
    }
  };

  const styles = StyleSheet.create<ITimerStyles>({
    digitContainer: {
      flexDirection: 'row',
    },
    digitSpace: {
      width: props.digitSpace,
    },
    displayContainer: {
      alignItems: 'center',
      backgroundColor: props.backgroundColor,
    },
    displayText: {
      color: '#000000',
      fontSize: 76,
      ...props.displayTimeStyle,
    },
    titleText: {
      fontSize: 18,
    },
  });

  return (
    <View style={styles.displayContainer}>
      <Text style={styles.titleText}>{props.title}</Text>
      {!props.isEditMode && (
        <View style={styles.digitContainer}>
          <Text
            style={[
              styles.displayText,
              styles.digitSpace,
              { textAlign: 'right' },
            ]}
          >
            {minutes}
          </Text>
          <Text style={[styles.displayText]}>:</Text>
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
            style={[
              styles.displayText,
              styles.digitSpace,
              { textAlign: 'center' },
            ]}
            placeholder={minutes}
            selection={{ start: 0, end: 0 }}
          />
          <Text style={styles.displayText}>:00</Text>
        </View>
      )}
    </View>
  );
};

export default Timer;
