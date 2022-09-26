import {Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {colors, fontFamily, fontSizes} from '../../theme';
import {Button, Header, Input} from '../../components/common';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {getFullName, setFullName} from '../../redux/reducers/profile';

const Profile = () => {
  const dispatch = useAppDispatch();
  const fullName = useAppSelector(getFullName);
  const schema = yup.object().shape({
    fullName: yup.string().required('Full Name is required.'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ControlFieldValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: fullName ? fullName : 'Unnamed',
    },
  });
  useEffect(() => {}, [fullName]);
  const onSubmit = (data: ControlFieldValues) => {
    dispatch(
      setFullName({
        fullName: data.fullName,
      }),
    );
  };
  return (
    <View style={styles.background}>
      <Header title="Profile" />
      <Text style={styles.subTitle}>About You</Text>
      <View style={styles.container}>
        <View style={styles.form}>
          <Input
            control={control}
            name="fullName"
            placeholder="Unnamed"
            autoCorrect={false}
            autoCapitalize="words"
            error={errors.fullName?.message}
            label="Full Name"
          />
        </View>
      </View>
      <View style={styles.bottom}>
        <Button onButtonPress={handleSubmit(onSubmit)} title="Save" />
      </View>
    </View>
  );
};

export default Profile;

const styles = ScaledSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  container: {
    paddingHorizontal: '16@s',
    flex: 1,
  },
  form: {
    marginTop: '16@s',
  },
  subTitle: {
    color: colors.primary.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    paddingHorizontal: '16@s',
    marginTop: '16@s',
  },
  bottom: {
    marginBottom: '16@s',
  },
});
