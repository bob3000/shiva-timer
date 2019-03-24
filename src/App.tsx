import * as React from 'react';
import { Button, TouchableOpacity, View } from 'react-native';
import Timer from './components/Timer';

interface IAppProps {}

interface IAppState {
  countdownTime: number;
  isEditing: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private countdownInput = 0;
  private timer?: number;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      countdownTime: 0,
      isEditing: false,
    };
  }

  public componentWillUnmount() {
    this.pauseCountdown();
  }

  public render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (!this.state.isEditing) {
              this.setState({ isEditing: !this.state.isEditing });
            } else {
              this.endTimerEdit();
            }
          }}
        >
          <Timer
            changeHandler={this.setCountdownInput}
            endEditingHandler={this.endTimerEdit}
            displayTime={this.state.countdownTime}
            isEditMode={this.state.isEditing}
          />
        </TouchableOpacity>
        <Button title={'Start'} onPress={this.startCountdown} />
        <Button title={'Pause'} onPress={this.pauseCountdown} />
        <Button title={'Reset'} onPress={this.resetCountdown} />
      </View>
    );
  }

  public pauseCountdown = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  public resetCountdown = () => {
    this.pauseCountdown();
    this.setState({ countdownTime: 0 });
  }

  public startCountdown = () => {
    if (this.state.countdownTime <= 0) return;

    this.timer = setInterval(() => {
      if (this.state.countdownTime <= 1) {
        this.pauseCountdown();
      }
      this.setState({ countdownTime: this.state.countdownTime - 1 });
    },                       1000);
  }

  private setCountdownInput = (time: number) => {
    this.countdownInput = time;
  }

  private endTimerEdit = () =>
    this.setState({ countdownTime: this.countdownInput, isEditing: false })
}
