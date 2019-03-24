import * as React from 'react';
import { Button, Slider, Text, TouchableOpacity, View } from 'react-native';
import Timer, { secondsToMinutes } from './components/Timer';

interface IAppProps {}

interface IAppState {
  countdownTime: number;
  isCountdownRunning: boolean;
  isEditing: boolean;
  isSettingWarmupTime: boolean;
  warmupTime: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private countdownInput = 0;
  private setWarmupTime = 0;
  private timer?: number;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      countdownTime: 0,
      isCountdownRunning: false,
      isEditing: false,
      isSettingWarmupTime: false,
      warmupTime: 0,
    };
  }

  public componentWillUnmount() {
    this.pauseCountdown();
  }

  public render() {
    let displayTime = 0;
    if (this.state.isCountdownRunning && this.state.warmupTime > 0) {
      displayTime = this.state.warmupTime;
    } else {
      displayTime = this.state.countdownTime;
    }

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
            displayTime={displayTime}
            isEditMode={this.state.isEditing}
          />
        </TouchableOpacity>

        <View>
          <Slider
            minimumValue={0}
            maximumValue={600}
            onSlidingComplete={() => {
              this.setWarmupTime = this.state.warmupTime;
              this.setState({ isSettingWarmupTime: false });
            }}
            onValueChange={(value: number) =>
              this.setState({
                isSettingWarmupTime: true,
                warmupTime: Math.trunc(value),
              })
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
            <Button title={'Start'} onPress={this.startWarmup} />
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

  public startWarmup = () => {
    if (this.state.countdownTime <= 0 || this.timer) return;
    if (this.state.warmupTime <= 0) {
      if (this.timer) clearInterval(this.timer);
      this.startCountdown();
      return;
    }

    this.timer = setInterval(() => {
      if (this.state.warmupTime <= 1) {
        this.pauseCountdown();
        this.warmupFinishedHandler();
        this.startCountdown();
      }
      this.setState({
        isCountdownRunning: true,
        warmupTime: this.state.warmupTime - 1,
      });
    },                       1000);
  }

  public startCountdown = () => {
    if (this.state.countdownTime <= 0 || this.timer) return;

    this.timer = setInterval(() => {
      if (this.state.countdownTime <= 1) {
        this.pauseCountdown();
        this.countdownFinishedHandler();
      }
      this.setState({
        countdownTime: this.state.countdownTime - 1,
        isCountdownRunning: true,
      });
    },                       1000);
  }

  public countdownFinishedHandler = () => {
    console.log('countdown finished');
  }

  public warmupFinishedHandler = () => {
    console.log('warmup finished');
  }

  public setCountdownInput = (time: number) => {
    this.countdownInput = time;
  }

  public endTimerEdit = () =>
    this.setState({ countdownTime: this.countdownInput, isEditing: false })

  private displayWarmupTime = () => {
    const displayTime = this.state.isSettingWarmupTime
      ? this.state.warmupTime
      : this.setWarmupTime;
    const { minutes, seconds } = secondsToMinutes(displayTime);
    return `${minutes}:${seconds}`;
  }
}
