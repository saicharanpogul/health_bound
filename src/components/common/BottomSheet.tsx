import React from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {scale, ScaledSheet} from 'react-native-size-matters';

import {colors} from '../../theme';

type Props = {
  children: React.ReactNode[];
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  height?: number;
};

const BottomSheet = React.forwardRef<RBSheet, Props>(
  ({children, style, height, onPress}, ref) => {
    return (
      <TouchableOpacity style={[styles.background, style]} onPress={onPress}>
        {children[0]}
        <RBSheet
          height={scale(height as number)}
          ref={ref}
          closeOnDragDown={true}
          closeOnPressMask={true}
          closeOnPressBack
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: colors.background.light,
            },
            container: {
              backgroundColor: colors.background.dark,
            },
          }}>
          <View style={styles.container}>
            {children.slice(1, children.length)}
          </View>
        </RBSheet>
      </TouchableOpacity>
    );
  },
);

export default BottomSheet;

const styles = ScaledSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: '16@s',
  },
});
