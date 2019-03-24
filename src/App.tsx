import * as React from 'react';
import { Button, Slider, Text, TouchableOpacity, View } from 'react-native';
import Timer, { secondsToMinutes } from './components/Timer';

interface IAppProps {}

interface IAppState {
  countdownTime: number;
  isCountdownRunning: boolean;
  isEditing: boolean;
  warmupTime: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private countdownInput = 0;
  private timer?: number;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      countdownTime: 0,
      isCountdownRunning: false,
      isEditing: false,
      warmupTime: 0,
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
            if (this.state.isCountdownRunning) return;
            !this.state.isEditing
              ? this.setState({ isEditing: !this.state.isEditing })
              : this.endTimerEdit();
          }}
        >
          <Timer
            changeHandler={this.setCountdownInput}
            endEditingHandler={this.endTimerEdit}
            displayTime={this.state.countdownTime}
            isEditMode={this.state.isEditing}
          />
        </TouchableOpacity>

        <View>
          <Slider
            minimumValue={0}
            maximumValue={600}
            onValueChange={(value: number) =>
              this.setState({ warmupTime: Math.trunc(value) })
            }
            step={10}
            value={this.state.warmupTime}
          />
          <Text>{this.displayWarmupTime()}</Text>
        </View>

        <View>
          {this.timer ? (
            <Button title={'Pause'} onPress={this.pauseCountdown} />
          ) : (
            <Button title={'Start'} onPress={this.startCountdown} />
          )}
          <Button title={'Reset'} onPress={this.resetCountdown} />
        </View>
      </View>
    );
  }

  public pauseCountdown = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
      this.setState({ isCountdownRunning: false });
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
      this.setState({
        countdownTime: this.state.countdownTime - 1,
        isCountdownRunning: true,
      });
    },                       1000);
  }

  public setCountdownInput = (time: number) => {
    this.countdownInput = time;
  }

  public endTimerEdit = () =>
    this.setState({ countdownTime: this.countdownInput, isEditing: false })

  private displayWarmupTime = () => {
    const { minutes, seconds } = secondsToMinutes(this.state.warmupTime);
    return `${minutes}:${seconds}`;
  }
}
