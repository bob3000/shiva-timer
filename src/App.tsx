import { Audio, KeepAwake } from 'expo';
import * as React from 'react';
import {
  AsyncStorage,
  ImageBackground,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FadeInView from './components/FadeInView';
import LifeButton from './components/LifeButton';
import Timer from './components/Timer';
import TimeSlider from './components/TimeSlider';

const persistentState = ['countdownTime', 'warmupTime'];
const initialState = {
  countdownTime: 600,
  warmupCounter: 30,
  warmupTime: 30,
};

const warmupIntervals = [0, 10, 30, 60, 120, 300, 600];

export interface IAppProps {}

export interface IAppState {
  // tslint:disable-next-line: no-any
  [key: string]: any;
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
  private sounds = {
    bell: require('../assets/sounds/signal_tone.mp3'),
    om: require('../assets/sounds/om_chant.mp3'),
  };

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      isCountdownRunning: false,
      isEditing: false,
      isSettingWarmupTime: false,
      ...initialState,
    };
  }

  public componentDidMount() {
    this.playSound(this.sounds.om);
    this.loadState();
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
    if (this.isCountdownInProgress() || this.isWarmupRunning()) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }

    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/backgrounds/lord_shiva.jpg')}
      >
        <FadeInView style={styles.mainContainer}>
          <View style={styles.timerContainer}>
            <TouchableOpacity
              onPress={() => {
                if (this.state.isCountdownRunning) return;
                !this.state.isEditing
                  ? this.setState({ isEditing: true })
                  : this.endTimerEdit();
              }}
            >
              <Timer
                changeHandler={this.setCountdownInput}
                endEditingHandler={this.endTimerEdit}
                digitSpace={95}
                displayTime={displayTime}
                isEditMode={this.state.isEditing}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderContainerTitle}>Warmup Time</Text>
            <TimeSlider
              disabled={this.isCountdownInProgress() || this.isWarmupRunning()}
              intervals={warmupIntervals}
              onSlidingComplete={() => {
                new Promise((resolve, _) => {
                  this.setState({
                    isSettingWarmupTime: false,
                    warmupTime: this.state.warmupCounter,
                  });
                  resolve();
                }).then(this.persistState.bind(this));
              }}
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
                background={
                  this.isWarmupRunning()
                    ? { backgroundColor: '#F6CEF5' }
                    : { backgroundColor: '#AC58FA' }
                }
                size={200}
                textSize={50}
                title={''} // Pause
                onPress={this.pauseCountdown}
              />
            ) : this.isCountdownInProgress() || this.isWarmupRunning() ? (
              <LifeButton
                background={{ backgroundColor: '#31B404' }}
                size={200}
                textSize={50}
                title={''} // Resume
                onPress={this.startWarmup}
              />
            ) : (
              <LifeButton
                background={{ backgroundColor: '#FFFFFF' }}
                size={200}
                textSize={50}
                title={''} // Start
                onPress={this.startWarmup}
              />
            )}
          </View>
          <View style={styles.footerContainer}>
            <LifeButton
              background={{ backgroundColor: '#FFFFFF' }}
              size={60}
              textSize={15}
              title={'Reset'}
              onPress={this.resetCountdown}
            />
          </View>
        </FadeInView>
      </ImageBackground>
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
    new Promise((resolve, _) => {
      this.setState({ ...initialState });
      resolve();
    }).then(this.persistState.bind(this));
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

  public endTimerEdit = () => {
    new Promise((resolve, _) => {
      this.setState({ countdownTime: this.countdownInput, isEditing: false });
      resolve();
    }).then(this.persistState.bind(this));
  }

  private filterState(state: IAppProps): IAppState {
    const filteredState = Object.entries(state).filter(
      (entry: [string, string]) =>
        persistentState.includes(entry[0]) ? entry : null,
    );
    // use Object.fromEntries when possible
    const newState = {} as IAppState;
    for (const [key, value] of filteredState) {
      newState[key] = value;
    }
    return newState;
  }

  private async persistState() {
    const toPersist = this.filterState(this.state);
    await AsyncStorage.setItem(
      'state',
      JSON.stringify({
        ...toPersist,
      }),
    );
  }

  private loadState() {
    AsyncStorage.getItem('state').then((state) => {
      if (state) {
        const myState = { ...JSON.parse(state) } as IAppState;
        const newState = this.filterState(myState);
        this.countdownInput = newState.countdownTime;
        this.setState({ ...newState, warmupCounter: newState.warmupTime });
      }
    });
  }

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
    this.playSound(this.sounds.bell);
  }

  private warmupFinishedHandler = () => {
    this.playSound(this.sounds.bell);
  }

  // tslint:disable-next-line: no-any
  private async playSound(sound: any) {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(sound);
      await soundObject.playAsync();
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  }
}

interface IAppStyle {
  backgroundImage: ViewStyle;
  buttonContainer: ViewStyle;
  footerContainer: ViewStyle;
  mainContainer: TextStyle;
  sliderContainer: ViewStyle;
  sliderContainerTitle: TextStyle;
  timerContainer: ViewStyle;
}

const styles = StyleSheet.create<IAppStyle>({
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  footerContainer: {
    alignItems: 'flex-start',
    bottom: 0,
    padding: 10,
    position: 'absolute',
    width: '100%',
  },
  mainContainer: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  sliderContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 50,
    opacity: 0.8,
  },
  sliderContainerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  timerContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 40,
    borderWidth: 1,
    marginTop: 100,
    opacity: 0.8,
    width: 280,
  },
});
