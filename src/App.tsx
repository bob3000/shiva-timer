import * as React from 'react';
import StandardTimerScreen from './components/StandardTimerScreen';

export interface IAppProps {}

export interface IAppState {
  // tslint:disable-next-line: no-any
  [key: string]: any;
}

export default class App extends React.Component<IAppProps, IAppState> {
  public render() {
    return <StandardTimerScreen />;
  }
}
