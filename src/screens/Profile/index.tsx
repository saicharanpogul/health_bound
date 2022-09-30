import {Image, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {colors, fontFamily, fontSizes} from '../../theme';
import {BottomSheet, Button, Header, Input} from '../../components/common';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {getFullName, setFullName} from '../../redux/reducers/profile';
import {getSBT} from '../../redux/reducers/wallet';
import RBSheet from 'react-native-raw-bottom-sheet';
import {isValidAddress, truncateAddress} from '../../utils';
import _ from 'lodash';
import {Placeholder} from '../../assets/images';

const Profile = () => {
  const sbtBottomSheetRef = useRef<RBSheet>();
  const dispatch = useAppDispatch();
  const fullName = useAppSelector(getFullName);
  const SBT = useAppSelector(getSBT);
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
      <View style={styles.container}>
        <Text style={styles.subTitle}>About You</Text>
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
        {SBT && (
          <View style={styles.sbtView}>
            <Text style={styles.subTitle}>Soul-bound token</Text>
            <BottomSheet
              ref={sbtBottomSheetRef}
              height={180}
              onPress={() => sbtBottomSheetRef.current?.open()}>
              <Image
                defaultSource={Placeholder}
                style={styles.sbtImage}
                source={{uri: SBT.offChain.image as string}}
              />
              <View>
                <Text style={styles.metadataTitle}>Metadata</Text>
                {SBT.offChain.attributes?.map(attribute => (
                  <View key={attribute.trait_type} style={styles.attributes}>
                    <Text style={styles.traitType}>
                      {_.capitalize(attribute.trait_type)}
                    </Text>
                    <Text style={styles.traitValue}>
                      {isValidAddress(attribute.value as string)
                        ? truncateAddress(attribute.value as string)
                        : attribute.value}
                    </Text>
                  </View>
                ))}
              </View>
            </BottomSheet>
          </View>
        )}
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
    marginTop: '16@s',
  },
  bottom: {
    marginBottom: '16@s',
  },
  sbtView: {},
  sbtImage: {
    width: '250@s',
    height: '250@s',
    borderRadius: '4@s',
    alignSelf: 'center',
    marginTop: '16@s',
  },
  metadataTitle: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    textAlign: 'center',
    marginTop: '8@s',
  },
  attributes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '16@s',
  },
  traitType: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
  },
  traitValue: {
    color: colors.primary.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
  },
});
