import * as React from 'react';
import { Animated, ViewStyle } from 'react-native';

interface IFadeInViewProps {
  style?: ViewStyle;
}

interface IFadeInViewState {
  fadeAnim: Animated.Value;
}

export default class FadeInView extends React.Component<
  IFadeInViewProps,
  IFadeInViewState
> {
  constructor(props: IFadeInViewProps) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  public componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      duration: 10000,
      toValue: 1,
    }).start();
  }

  public render() {
    const { fadeAnim } = this.state;

    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: fadeAnim,
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
