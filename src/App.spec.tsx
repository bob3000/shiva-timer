import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { Text } from 'react-native';
import App, { ButtonsRow, Lap, LapsTable, RoundButton, Timer } from './App';

describe('App', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Timer', () => {
  it('renders', () => {
    const tree = renderer.create(<Timer interval={0} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('RoundButton', () => {
  it('snapshot test', () => {
    const tree = renderer
      .create(
        <RoundButton
          background={'#FFFFFF'}
          color={'#000000'}
          disabled={false}
          title={'Start'}
          onPress={() => undefined}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('ButtonsRow', () => {
  it('snapshot test', () => {
    const tree = renderer.create(
      <ButtonsRow>
        <Text>I'm a child</Text>
        <Text>I'm another child</Text>
      </ButtonsRow>,
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('LapsTable', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<LapsTable laps={[1, 2, 3]} timer={0} />);
    expect(tree).toMatchSnapshot();
  });
});

describe('Lap', () => {
  it('snapshot test', () => {
    const tree = renderer.create(
      <Lap count={1} fastest={false} interval={1} slowest={false} />,
    );
    expect(tree).toMatchSnapshot();
  });
});
