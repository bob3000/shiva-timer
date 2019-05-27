import { Audio, KeepAwake } from 'expo';
import * as React from 'react';
import {
  AsyncStorage,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import AboutAlert from './components/AboutAlert';
import { DropdownMenu } from './components/DropDownMenu';
import FadeInView from './components/FadeInView';
import LifeButton from './components/LifeButton';
import Timer, { ITimerState, TimerType } from './components/Timer';
import TimeSlider from './components/TimeSlider';

const initialState = {};

export interface IAppProps {}

export interface IAppState {
  // tslint:disable-next-line: no-any
  [key: string]: any;
  isAboutVisible: boolean;
  isDropdownVisible: boolean;
  isTimerRunning: boolean;
  timers: ITimerState[];
  toolbarMenuVisible: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private intervalId: number | null;
  private sounds = {
    bell: require('../assets/sounds/signal_tone.mp3'),
    om: require('../assets/sounds/om_chant.mp3'),
  };

  constructor(props: IAppProps) {
    super(props);
    this.intervalId = null;
    this.state = {
      isAboutVisible: false,
      isDropdownVisible: false,
      isTimerRunning: false,
      timers: [
        {
          intervals: [10, 30, 60, 120, 300, 600],
          timeCurrent: 60,
          timeTotal: 60,
          timerType: TimerType.slider,
        },
        {
          isEditing: false,
          timeCurrent: 900,
          timeTotal: 900,
          timerType: TimerType.digit,
        },
      ],
      toolbarMenuVisible: false,
      ...initialState,
    };
  }

  public componentDidMount() {
    this.playSound(this.sounds.om);
    this.loadState();
  }

  public componentWillUnmount() {
    this.pauseCountdown();
    this.persistState();
  }

  public render() {
    if (this.state.isTimerRunning) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }

    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/backgrounds/lord_shiva.jpg')}
      >
        <View style={styles.mainContainer}>
          <View style={styles.aboutLink}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                this.setState({
                  isDropdownVisible: !this.state.isDropdownVisible,
                })
              }
            >
              <Text style={styles.aboutLinkText}>⋮</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timerContainer}>
            <FlatList
              data={this.state.timers}
              keyExtractor={(_, index) => `${index}`}
              renderItem={(li) =>
                li.item.timerType === TimerType.digit ? (
                  <TouchableOpacity
                    onPress={() => {
                      const timers = [...this.state.timers];
                      timers[li.index].isEditing = true;
                      this.setState({ timers });
                    }}
                    disabled={this.state.isTimerRunning}
                  >
                    <Timer
                      displayTime={li.item.timeCurrent}
                      isEditMode={li.item.isEditing}
                      changeHandler={(newTime) => {
                        this.onTimerValueChange(li.index, newTime);
                      }}
                      endEditingHandler={() => {
                        this.onTimerValueChangeComplete(li.index);
                      }}
                      title={'Meditation Time'}
                    />
                  </TouchableOpacity>
                ) : (
                  <TimeSlider
                    intervals={li.item.intervals || [0]}
                    value={li.item.timeCurrent}
                    onValueChange={(newTime) => {
                      const timers = this.onTimerValueChange(li.index, newTime);
                      this.setState({ timers });
                    }}
                    onSlidingComplete={() => {
                      this.onTimerValueChangeComplete(li.index);
                    }}
                    disabled={this.state.isTimerRunning}
                    title={'Warmup Time'}
                  />
                )
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            {this.state.isTimerRunning ? (
              <LifeButton
                background={{ backgroundColor: '#FFFFFF' }}
                size={200}
                textSize={50}
                title={'Pause'}
                onPress={this.pauseCountdown}
              />
            ) : (
              <LifeButton
                background={{ backgroundColor: '#FFFFFF' }}
                size={200}
                textSize={50}
                title={'Start'}
                disabled={this.state.isTimerRunning}
                onPress={() => this.startCountdown()}
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
          <DropdownMenu
            isVisible={this.state.isDropdownVisible}
            options={[
              {
                onPress: () =>
                  this.setState({
                    isAboutVisible: true,
                    isDropdownVisible: false,
                  }),
                title: 'about',
              },
              {
                onPress: () => null,
                title: 'settings',
              },
            ]}
          />
          <AboutAlert
            visible={this.state.isAboutVisible}
            okHandler={() => this.setState({ isAboutVisible: false })}
          />
        </View>
      </ImageBackground>
    );
  }

  public startCountdown = () => {
    if (this.nextTimer()) {
      this.intervalId = setInterval(() => {
        const timers = [...this.state.timers];
        const targetTimer = this.nextTimer();
        targetTimer.timeCurrent -= 1;
        this.setState({
          timers,
          isTimerRunning: true,
        });
        if (targetTimer.timeCurrent <= 0) {
          this.pauseCountdown();
          this.countdownFinishedHandler();
          if (this.nextTimer()) {
            this.startCountdown();
          } else {
            this.resetCountdown();
          }
        }
      },                            1000);
    }
  }

  public pauseCountdown = () => {
    if (this.state.isTimerRunning && this.intervalId != null) {
      clearInterval(this.intervalId);
    }
    this.setState({
      isTimerRunning: false,
    });
  }

  public resetCountdown = () => {
    this.pauseCountdown();
    const timers = [...this.state.timers];
    for (const i in timers) {
      if (timers[i]) {
        timers[i].timeCurrent = timers[i].timeTotal;
      }
    }
    this.setState({
      timers,
    });
  }

  private onTimerValueChange = (timerIndex: number, newVal: number) => {
    const timers = [...this.state.timers];
    timers[timerIndex].timeCurrent = newVal;
    timers[timerIndex].timeTotal = newVal;
    return timers;
  }

  private onTimerValueChangeComplete = (timerIndex: number) => {
    const timers = [...this.state.timers];
    timers[timerIndex].isEditing = false;
    this.setState({ timers });
  }

  private nextTimer = () => {
    return this.state.timers.filter(
      (timer) => timer.timeCurrent > 0 && timer.timeCurrent <= timer.timeTotal,
    )[0];
  }

  private filterState(state: IAppState): IAppState {
    return state;
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
        this.setState({ ...newState });
      }
    });
  }

  private countdownFinishedHandler = () => {
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
  aboutLink: TextStyle;
  aboutLinkText: TextStyle;
  backgroundImage: ViewStyle;
  buttonContainer: ViewStyle;
  footerContainer: ViewStyle;
  mainContainer: TextStyle;
  timerContainer: ViewStyle;
}

const styles = StyleSheet.create<IAppStyle>({
  aboutLink: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    borderWidth: 1,
    color: '#000000',
    marginRight: 5,
    marginTop: 30,
    opacity: 0.8,
    paddingHorizontal: 15,
  },
  aboutLinkText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  footerContainer: {
    alignItems: 'flex-end',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    position: 'absolute',
    width: '100%',
  },
  mainContainer: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  timerContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 40,
    borderWidth: 1,
    marginTop: 10,
    opacity: 0.8,
    width: 280,
  },
});
