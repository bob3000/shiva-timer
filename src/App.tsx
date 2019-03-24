import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Timer from './components/Timer';

interface IAppProps {}

interface IAppState {
  countdownTime: number;
  isEditing: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private countdownInput = 0;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      countdownTime: 0,
      isEditing: false,
    };
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
      </View>
    );
  }

  private setCountdownInput = (time: number) => {
    this.countdownInput = time;
  }

  private endTimerEdit = () =>
    this.setState({ countdownTime: this.countdownInput, isEditing: false })
}
