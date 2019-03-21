import * as Moment from 'moment';
import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface IAppState {
  now: number;
  start: number;
  laps: number[];
}

interface IAppProps {}

export default class App extends React.Component<IAppProps, IAppState> {
  private timer?: number;

  public constructor(props: IAppProps) {
    super(props);
    this.state = {
      laps: [],
      now: 0,
      start: 0,
    };
  }

  public componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  public render(): React.ReactNode {
    const { now, start, laps } = this.state;
    const timer = now - start;
    return (
      <View style={styles.container}>
        <Timer
          interval={laps.reduce((acc, cur) => acc + cur, 0) + timer}
          style={styles.timer}
        />
        {laps.length === 0 && (
          <ButtonsRow>
            <RoundButton
              disabled={true}
              onPress={this.reset}
              title="Reset"
              color="#8B8B90"
              background="#151515"
            />
            <RoundButton
              disabled={false}
              onPress={this.start}
              title="Start"
              color="#50D167"
              background="#1B361F"
            />
          </ButtonsRow>
        )}
        {start > 0 && (
          <ButtonsRow>
            <RoundButton
              disabled={false}
              onPress={this.lap}
              title="Lap"
              color="#FFFFFF"
              background="#3D3D3D"
            />
            <RoundButton
              disabled={false}
              onPress={this.stop}
              title="Stop"
              color="#E33935"
              background="#3C1715"
            />
          </ButtonsRow>
        )}
        {laps.length > 0 && start === 0 && (
          <ButtonsRow>
            <RoundButton
              disabled={false}
              onPress={this.reset}
              title="Reset"
              color="#FFFFFF"
              background="#3D3D3D"
            />
            <RoundButton
              disabled={false}
              onPress={this.resume}
              title="Start"
              color="#50D167"
              background="#3C1715"
            />
          </ButtonsRow>
        )}
        <LapsTable timer={timer} laps={this.state.laps} />
      </View>
    );
  }

  private start = () => {
    const now = new Date().getTime();
    this.setState({
      now,
      laps: [0],
      start: now,
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    },                       1000);
  }

  private reset = () => {
    this.setState({
      laps: [],
      now: 0,
      start: 0,
    });
  }

  private resume = () => {
    const now = new Date().getTime();
    this.setState({
      now,
      start: now,
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    },                       1000);
  }

  private lap = () => {
    const timestamp = new Date().getTime();
    const { laps, now, start } = this.state;
    const [firstLap, ...others] = laps;
    this.setState({
      laps: [0, firstLap + now - start, ...others],
      now: timestamp,
      start: timestamp,
    });
  }

  private stop = () => {
    if (this.timer) clearInterval(this.timer);
    const { laps, now, start } = this.state;
    const [firstLap, ...others] = laps;
    this.setState({
      laps: [0, firstLap + now - start, ...others],
      now: 0,
      start: 0,
    });
  }
}

interface ITimerProps {
  interval: number;
  style?: TextStyle;
}

const Timer: React.FunctionComponent<ITimerProps> = (props) => {
  const duration = Moment.duration(props.interval);
  return (
    <View style={styles.timerContainer}>
      <Text style={props.style}>
        {duration
          .minutes()
          .toString()
          .padStart(2, '0')}
        :
      </Text>
      <Text style={props.style}>
        {duration
          .seconds()
          .toString()
          .padStart(2, '0')}
      </Text>
    </View>
  );
};

interface IButtonRowProps {
  children: Element[];
}
const ButtonsRow: React.FunctionComponent<IButtonRowProps> = (props) => {
  return <View style={styles.buttonsRow}>{props.children}</View>;
};

interface IRoundButtonProps {
  background: string;
  color: string;
  disabled: boolean;
  onPress: () => void;
  title: string;
}

const RoundButton: React.FunctionComponent<IRoundButtonProps> = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: props.background }]}
      onPress={() => !props.disabled && props.onPress()}
      activeOpacity={props.disabled ? 1.0 : 0.7}
    >
      <View style={[styles.buttonBorder]}>
        <Text style={[styles.buttonTitle, { color: props.color }]}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface ILapsTableProps {
  laps: number[];
  timer: number;
}

const LapsTable: React.FunctionComponent<ILapsTableProps> = (props) => {
  const finishedLaps = props.laps.slice(1);
  let slowestLap = Number.MAX_SAFE_INTEGER;
  let fastestLap = Number.MIN_SAFE_INTEGER;

  if (finishedLaps.length >= 2) {
    fastestLap = Math.min(...finishedLaps);
    slowestLap = Math.max(...finishedLaps);
  }

  return (
    <ScrollView style={styles.scrollView}>
      {props.laps.map((lap: number, index: number) => {
        return (
          <Lap
            key={props.laps.length - index}
            count={props.laps.length - index}
            interval={index === 0 ? props.timer + lap : lap}
            slowest={lap === slowestLap}
            fastest={lap === fastestLap}
          />
        );
      })}
    </ScrollView>
  );
};

interface ILapProps {
  count: number;
  fastest: boolean;
  interval: number;
  slowest: boolean;
}

const Lap: React.FunctionComponent<ILapProps> = (props) => {
  const lapStyle = [
    styles.lapText,
    (props.fastest && styles.fastestLap) || undefined,
    (props.slowest && styles.slowestLap) || undefined,
  ];
  return (
    <View style={styles.lap}>
      <Text style={[lapStyle, styles.lapTimer]}>Lap {props.count}</Text>
      <Timer style={styles.lapText} interval={props.interval} />
    </View>
  );
};

interface IStyles {
  button: ViewStyle;
  buttonBorder: ViewStyle;
  buttonsRow: ViewStyle;
  buttonTitle: TextStyle;
  container: ViewStyle;
  fastestLap: TextStyle;
  lap: ViewStyle;
  lapText: TextStyle;
  lapTimer: ViewStyle;
  scrollView: ViewStyle;
  slowestLap: TextStyle;
  timer: TextStyle;
  timerContainer: ViewStyle;
}

const styles = StyleSheet.create<IStyles>({
  button: {
    alignItems: 'center',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  buttonBorder: {
    alignItems: 'center',
    borderRadius: 38,
    borderWidth: 2,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonsRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 80,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 130,
  },
  fastestLap: {
    color: '#4BC05F',
  },
  lap: {
    borderColor: '#151515',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  lapText: {
    color: '#FFFFFF',
    fontSize: 18,
    width: 27,
  },
  lapTimer: {
    width: 100,
  },
  scrollView: {
    alignSelf: 'stretch',
  },
  slowestLap: {
    color: '#CC3531',
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 76,
    fontWeight: '200',
    width: 108,
  },
  timerContainer: {
    flexDirection: 'row',
  },
});
