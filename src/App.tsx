import { Audio } from 'expo';
import * as React from 'react';
import {
  Button,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import Timer, { secondsToMinutes } from './components/Timer';
import TimeSlider from './components/TimeSlider';

const warmupIntervals = [0, 10, 30, 60, 120, 300, 600];

interface IAppProps {}

interface IAppState {
  countdownTime: number;
  isCountdownRunning: boolean;
  isEditing: boolean;
  isSettingWarmupTime: boolean;
  warmupCounter: number;
  warmupTime: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private countdownInput = 60;
  private timer?: number;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      countdownTime: 60,
      isCountdownRunning: false,
      isEditing: false,
      isSettingWarmupTime: false,
      warmupCounter: 10,
      warmupTime: 10,
    };
  }

  public componentWillUnmount() {
    this.pauseCountdown();
  }

  public render() {
    let displayTime = 0;
    if (this.isWarmupRunning()) {
      displayTime = this.state.warmupCounter;
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
            displayTimeStyle={
              this.isWarmupRunning() ? styles.timerDisplayTime : undefined
            }
            isEditMode={this.state.isEditing}
          />
        </TouchableOpacity>

        <TimeSlider
          disabled={this.isCountdownInProgress() || this.isWarmupRunning()}
          intervals={warmupIntervals}
          onSlidingComplete={() =>
            this.setState({
              isSettingWarmupTime: false,
              warmupTime: this.state.warmupCounter,
            })
          }
          onValueChange={(value: number) =>
            this.setState({
              isSettingWarmupTime: true,
              warmupCounter: value,
            })
          }
          value={
            (this.state.isSettingWarmupTime && this.state.warmupCounter) ||
            this.state.warmupTime
          }
        />

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
    this.setState({ countdownTime: 0, warmupCounter: this.state.warmupTime });
  }

  public startWarmup = () => {
    if (this.state.countdownTime <= 0 || this.timer) return;
    if (this.state.warmupCounter <= 0) {
      if (this.timer) clearInterval(this.timer);
      this.startCountdown();
      return;
    }

    this.timer = setInterval(() => {
      if (this.state.warmupCounter <= 0) {
        this.pauseCountdown();
        this.warmupFinishedHandler();
        this.startCountdown();
        return;
      }
      this.setState({
        isCountdownRunning: true,
        warmupCounter: this.state.warmupCounter - 1,
      });
    },                       1000);
  }

  public startCountdown = () => {
    if (this.state.countdownTime <= 0 || this.timer) return;

    this.timer = setInterval(() => {
      if (this.state.countdownTime <= 0) {
        this.pauseCountdown();
        this.countdownFinishedHandler();
        this.setState({
          countdownTime: this.countdownInput,
          warmupCounter: this.state.warmupTime,
        });
        return;
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

  private isWarmupRunning = () => {
    return Boolean(
      this.state.warmupCounter > 0 &&
        this.state.warmupCounter < this.state.warmupTime &&
        !this.state.isSettingWarmupTime,
    );
  }

  private isCountdownInProgress = () => {
    return this.state.countdownTime < this.countdownInput;
  }

  private countdownFinishedHandler = () => {
    this.playBellSound();
  }

  private warmupFinishedHandler = () => {
    this.playBellSound();
  }

  private async playBellSound() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../assets/sounds/signal_tone.mp3'));
      await soundObject.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  private displayWarmupTime = () => {
    const displayTime = this.state.isSettingWarmupTime
      ? this.state.warmupCounter
      : this.state.warmupTime;
    const { minutes, seconds } = secondsToMinutes(displayTime);
    return `${minutes}:${seconds}`;
  }
}

interface IAppStyle {
  timerDisplayTime: TextStyle;
}

const styles = StyleSheet.create<IAppStyle>({
  timerDisplayTime: {
    color: '#D4D422',
  },
});
