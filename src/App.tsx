import { Audio } from 'expo';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LifeButton from './components/LifeButton';
import Timer from './components/Timer';
import TimeSlider from './components/TimeSlider';

const initialState = {
  countdownTime: 600,
  warmupCounter: 10,
  warmupTime: 10,
};

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
  private countdownInput = initialState.countdownTime;
  private timer?: number;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      isCountdownRunning: false,
      isEditing: false,
      isSettingWarmupTime: false,
      ...initialState,
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
      <View style={styles.mainContainer}>
        <View style={styles.timerContainer}>
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
              digitSpace={86}
              displayTime={displayTime}
              displayTimeStyle={
                this.isWarmupRunning() ? styles.timerWarmupText : undefined
              }
              isEditMode={this.state.isEditing}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sliderContainer}>
          <Text>Warmup Time</Text>
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
        </View>

        <View style={styles.buttonContainer}>
          {this.timer ? (
            <LifeButton
              size={200}
              textSize={50}
              title={'Pause'}
              onPress={this.pauseCountdown}
            />
          ) : this.isCountdownInProgress() || this.isWarmupRunning() ? (
            <LifeButton
              size={200}
              textSize={50}
              title={'Resume'}
              onPress={this.startWarmup}
            />
          ) : (
            <LifeButton
              size={200}
              textSize={50}
              title={'Start'}
              onPress={this.startWarmup}
            />
          )}
        </View>
        <View style={styles.footerContainer}>
          <LifeButton
            size={60}
            textSize={15}
            title={'Reset'}
            onPress={this.resetCountdown}
          />
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
    this.countdownInput = initialState.countdownTime;
    this.setState({ ...initialState });
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
}

interface IAppStyle {
  buttonContainer: ViewStyle;
  footerContainer: ViewStyle;
  mainContainer: TextStyle;
  sliderContainer: ViewStyle;
  timerContainer: ViewStyle;
  timerWarmupText: TextStyle;
}

const styles = StyleSheet.create<IAppStyle>({
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  footerContainer: {
    bottom: 0,
    padding: 10,
    position: 'absolute',
    width: '100%',
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: '100%',
  },
  sliderContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 50,
  },
  timerContainer: {
    marginTop: 160,
  },
  timerWarmupText: {
    color: '#D4D422',
  },
});
