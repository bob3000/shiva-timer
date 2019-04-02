import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AboutAlert from './AboutAlert';

describe('AboutAlert', () => {
  it('snapshot test', () => {
    const tree = renderer
      .create(<AboutAlert okHandler={() => null} visible={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
