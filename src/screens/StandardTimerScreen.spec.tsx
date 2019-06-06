import * as React from 'react';
import * as renderer from 'react-test-renderer';
import StandardTimerScreen from './StandardTimerScreen';

jest.useFakeTimers();

describe('StandardTimerScreen', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<StandardTimerScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
