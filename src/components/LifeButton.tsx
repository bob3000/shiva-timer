import * as React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ILifeButtonProps {
  background?: ViewStyle;
  onPress?: () => void;
  size?: number | string;
  title?: string;
  textSize?: number;
}

interface ILifeButtonStyle {
  background: ViewStyle;
  mainContainer: ViewStyle;
  titleText: TextStyle;
  titleTextContainer: ViewStyle;
}

export const LifeButton: React.FunctionComponent<ILifeButtonProps> = (
  props,
) => {
  const styles = StyleSheet.create<ILifeButtonStyle>({
    background: {
      opacity: 0.8,
      ...props.background,
    },
    mainContainer: {
      alignItems: 'center',
      borderColor: '#000000',
      borderRadius: 100,
      borderWidth: 1,
      height: props.size,
      justifyContent: 'center',
      opacity: 0.8,
      width: props.size,
    },
    titleText: {
      color: '#000000',
      fontSize: props.textSize,
      fontWeight: 'bold',
    },
    titleTextContainer: {
      borderRadius: 40,
      opacity: 1,
      padding: 5,
    },
  });

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={props.onPress}>
      <ImageBackground
        source={require('../../assets/images/flower_of_life.png')}
        style={[styles.background, styles.mainContainer]}
      >
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>{props.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default LifeButton;
