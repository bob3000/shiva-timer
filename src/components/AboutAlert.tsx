import * as React from 'react';
import { Alert, Linking, Text } from 'react-native';

interface IAboutAlertProps {
  okHandler: () => void;
  visible: boolean;
}

// tslint:disable-next-line: no-var-requires
const packageJson = require('../../package.json');
const alertText = `by Robin Kautz

Version ${packageJson.version}
`;
const website = 'http://github.com/bob3000/shiva-timer';

const AboutAlert: React.FunctionComponent<IAboutAlertProps> = (props) => {
  if (!props.visible) return null;
  return (
    <Text style={{ height: 0 }}>
      {Alert.alert('Shiva Timer', alertText, [
        { text: 'Go to Website', onPress: () => Linking.openURL(website) },
        { text: 'Close', onPress: props.okHandler },
      ])}
      ;
    </Text>
  );
};

export default AboutAlert;
