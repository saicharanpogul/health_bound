import {Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {scale, ScaledSheet} from 'react-native-size-matters';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {Button, Input} from './common';
import {colors, fontFamily, fontSizes} from '../theme';
import {useAppSelector} from '../hooks/useRedux';
import {getWalletLoading} from '../redux/reducers/wallet';

type Props = {
  title: string;
  onSubmit: (data: ControlFieldValues) => void;
};

const PasscodeBottomSheet = React.forwardRef<RBSheet, Props>(
  ({title, onSubmit}, ref) => {
    const schema = yup.object().shape({
      passcode: yup
        .string()
        .test('len', 'Must be exactly 6 characters', val => val!.length === 6)
        .required('Passcode is required'),
    });

    const loading = useAppSelector(getWalletLoading);

    const {
      control,
      handleSubmit,
      formState: {errors},
      reset,
    } = useForm<ControlFieldValues>({
      resolver: yupResolver(schema),
      defaultValues: {
        passcode: '',
      },
    });
    return (
      <View>
        <RBSheet
          height={scale(250)}
          ref={ref}
          closeOnDragDown={true}
          closeOnPressMask={true}
          closeOnPressBack
          onClose={() => reset()}
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
              <Input
                control={control}
                label="Passcode"
                name="passcode"
                error={errors.passcode?.message}
                placeholder="Enter passcode"
                keyboardType="number-pad"
                secureTextEntry
              />
              <Button
                onButtonPress={handleSubmit(onSubmit)}
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

export default PasscodeBottomSheet;

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
