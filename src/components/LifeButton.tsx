import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ILifeButtonProps {
  onPress: () => void;
  size?: number | string;
  title: string;
  textSize?: number;
}

interface ILifeButtonStyle {
  mainContainer: ViewStyle;
  titleText: TextStyle;
}

export const LifeButton: React.FunctionComponent<ILifeButtonProps> = (
  props,
) => {
  const styles = StyleSheet.create<ILifeButtonStyle>({
    mainContainer: {
      alignItems: 'center',
      backgroundColor: '#000000',
      borderRadius: 100,
      height: props.size,
      justifyContent: 'center',
      width: props.size,
    },
    titleText: {
      color: '#FFFFFF',
      fontSize: props.textSize,
    },
  });

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.mainContainer}>
        <Text style={styles.titleText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LifeButton;
