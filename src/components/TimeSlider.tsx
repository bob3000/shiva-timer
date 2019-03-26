import * as React from 'react';
import { Slider, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Timer from '../components/Timer';

export interface ITimeSliderProps {
  disabled?: boolean;
  intervals: number[];
  onSlidingComplete: () => void;
  onValueChange: (value: number) => void;
  value: number;
}

export const TimeSlider: React.FunctionComponent<ITimeSliderProps> = (
  props,
) => {
  return (
    <View style={styles.sliderContainer}>
      <Slider
        disabled={props.disabled}
        minimumValue={0}
        maximumValue={props.intervals.length - 1}
        onSlidingComplete={props.onSlidingComplete}
        onValueChange={(value: number) => {
          props.onValueChange(props.intervals[Math.trunc(value)]);
        }}
        style={styles.slider}
        value={props.intervals.indexOf(props.value)}
      />
      <Timer displayTime={props.value} isEditMode={false} />
    </View>
  );
};

export interface ITimeSliderStyle {
  slider: TextStyle;
  sliderContainer: ViewStyle;
}

const styles = StyleSheet.create<ITimeSliderStyle>({
  slider: {
    color: '#FFFFFF',
    width: 200,
  },
  sliderContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
    padding: 10,
    width: '100%',
  },
});

export default TimeSlider;
