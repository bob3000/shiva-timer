import * as React from 'react';
import * as renderer from 'react-test-renderer';
import StandardTimerScreen from './App';

jest.useFakeTimers();

describe('App', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<StandardTimerScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
