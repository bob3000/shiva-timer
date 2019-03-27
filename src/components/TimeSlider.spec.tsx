import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TimeSlider from './TimeSlider';

describe('TimeSlider', () => {
  it('snapshot test', () => {
    const tree = renderer
      .create(<TimeSlider intervals={[1, 2, 4]} value={4} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
