import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FadeInView from './FadeInView';

jest.useFakeTimers();

describe('FadeInView', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<FadeInView />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
