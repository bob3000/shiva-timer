import * as React from 'react';
import * as renderer from 'react-test-renderer';
import App from './App';

jest.useFakeTimers();

describe('App', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
