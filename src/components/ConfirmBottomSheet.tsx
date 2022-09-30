import {Text, View} from 'react-native';
import React from 'react';
import {scale, ScaledSheet} from 'react-native-size-matters';
import RBSheet from 'react-native-raw-bottom-sheet';

import {Button} from './common';
import {colors, fontFamily, fontSizes} from '../theme';
import {useAppSelector} from '../hooks/useRedux';
import {getProfileLoading} from '../redux/reducers/profile';

type Props = {
  title: string;
  onSubmit: () => void;
};

const ConfirmBottomSheet = React.forwardRef<RBSheet, Props>(
  ({title, onSubmit}, ref) => {
    const loading = useAppSelector(getProfileLoading);

    return (
      <View>
        <RBSheet
          height={scale(250)}
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
            <View>
              <Text style={styles.title}>{title}</Text>
              <Button
                onButtonPress={() => onSubmit()}
                title={'Submit'}
                style={{marginTop: scale(10)}}
                loading={loading}
              />
            </View>
          </View>
        </RBSheet>
      </View>
    );
  },
);

export default ConfirmBottomSheet;

const styles = ScaledSheet.create({
  container: {
    marginHorizontal: '16@s',
  },
  title: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.semiBold,
    fontSize: fontSizes[2],
    marginTop: '4@s',
    textAlign: 'center',
    marginBottom: '16@s',
  },
});
