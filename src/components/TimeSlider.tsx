import * as React from 'react';
import { Slider, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Timer from '../components/Timer';

export interface ITimeSliderProps {
  disabled?: boolean;
  intervals: number[];
  onSlidingComplete?: () => void;
  onValueChange?: (value: number) => void;
  value: number;
}

export const TimeSlider: React.FunctionComponent<ITimeSliderProps> = (
  props,
) => {
  return (
    <View style={styles.sliderContainer}>
      <Slider
        disabled={props.disabled}
        maximumTrackTintColor={'#000000'}
        maximumValue={props.intervals.length - 1}
        minimumTrackTintColor={'#000000'}
        minimumValue={0}
        onSlidingComplete={props.onSlidingComplete}
        onValueChange={(value: number) => {
          if (props.onValueChange) {
            props.onValueChange(props.intervals[Math.trunc(value)]);
          }
        }}
        style={styles.slider}
        thumbTintColor={'#000000'}
        value={props.intervals.indexOf(props.value)}
      />
      <Timer
        digitSpace={22}
        displayTimeStyle={styles.scaleText}
        displayTime={props.value}
        isEditMode={false}
      />
    </View>
  );
};

export interface ITimeSliderStyle {
  scaleText: TextStyle;
  slider: TextStyle;
  sliderContainer: ViewStyle;
}

const styles = StyleSheet.create<ITimeSliderStyle>({
  scaleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  slider: {
    width: 200,
  },
  sliderContainer: {
    flexDirection: 'row',
    padding: 15,
  },
});

export default TimeSlider;
