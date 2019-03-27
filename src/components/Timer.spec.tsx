import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Timer from './Timer';

describe('Timer', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<Timer displayTime={1} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
