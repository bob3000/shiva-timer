import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';

interface IDropdownMenuOption {
  onPress: () => void;
  title: string;
}

export interface IDropdownMenuProps {
  isVisible: boolean;
  options: IDropdownMenuOption[];
}

export const DropdownMenu: React.FunctionComponent<IDropdownMenuProps> = (
  props,
) => {
  if (!props.isVisible) return null;
  return (
    <View style={styles.pickerList}>
      <FlatList
        data={props.options}
        keyExtractor={(item) => {
          return item.title;
        }}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={item.onPress}>
            <View>
              <Text style={styles.listItem}>{item.title}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

interface IDropdownMenuStyles {
  listItem: TextStyle;
  pickerList: ViewStyle;
}

const styles = StyleSheet.create<IDropdownMenuStyles>({
  listItem: {
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'right',
  },
  pickerList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    opacity: 1,
    position: 'absolute',
    right: 5,
    top: 70,
    width: 100,
  },
});
