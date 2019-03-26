import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ILifeButtonProps {
  onPress: () => void;
  title: string;
}

export const LifeButton: React.FunctionComponent<ILifeButtonProps> = (
  props,
) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.mainContainer} />
    </TouchableOpacity>
  );
};

interface ILifeButtonStyle {
  mainContainer: ViewStyle;
}

export const styles = StyleSheet.create<ILifeButtonStyle>({
  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    height: 200,
    width: 200,
  },
});

export default LifeButton;
