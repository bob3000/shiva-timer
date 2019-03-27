import * as React from 'react';
import * as renderer from 'react-test-renderer';
import LifeButton from './LifeButton';

describe('LifeButton', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<LifeButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
