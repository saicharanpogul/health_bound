/* eslint-disable react-native/no-inline-styles */
import {ScrollView, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';

import {importWalletStyles as styles} from './styles';
import {Header, ButtonSwitch, Button, Input} from '../../components/common';
import {Bip39, Cryptography} from '../../utils/web3';
import {scale} from 'react-native-size-matters';
import {useAppDispatch} from '../../hooks/useRedux';
import {setEncryptedWalletInfo, setPasscode} from '../../redux/reducers/wallet';

type Props = NativeStackScreenProps<RootStackParamList, 'ImportWallet'>;

type FormProps = {
  privateKey?: string;
  mnemonic?: string;
  passcode: string;
};

const ImportWallet = ({navigation}: Props) => {
  const dispatch = useAppDispatch();
  const [switchState, changeSwitchState] = useState(false);
  const mnemonicValidationSchema = yup.object().shape({
    mnemonic: yup.string().test({
      name: 'mnemonic',
      message: 'Mnemonic is not valid',
      test: value => Bip39.validateMnemonic(value as string),
    }),
    passcode: yup
      .string()
      .test('len', 'Must be exactly 6 characters', val => val!.length === 6)
      .required('Passcode is required'),
  });
  const privateKeyValidationSchema = yup.object().shape({
    privateKey: yup.string().test({
      name: 'privateKey',
      message: 'Private key is not valid',
      test: value => Bip39.validatePrivateKey(value as string),
    }),
    passcode: yup
      .string()
      .test('len', 'Must be exactly 6 characters', val => val!.length === 6)
      .required('Passcode is required'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<FormProps>({
    resolver: yupResolver(
      switchState ? privateKeyValidationSchema : mnemonicValidationSchema,
    ),
    defaultValues: {},
  });

  useEffect(() => {}, [watch]);

  const onSubmit = (data: {
    mnemonic?: string;
    privateKey?: string;
    passcode: string;
  }) => {
    const hashedPasscode = Cryptography.hash(data.passcode);
    if (switchState) {
      dispatch(
        setEncryptedWalletInfo({
          hashedPasscode,
          privateKey: data.privateKey,
        }),
      );
    } else {
      dispatch(
        setEncryptedWalletInfo({
          hashedPasscode,
          mnemonic: data.mnemonic,
        }),
      );
    }
    dispatch(
      setPasscode({
        passcode: data.passcode,
      }),
    );
  };
  return (
    <View style={styles.backgroundStyle}>
      <Header title="Import Wallet" onBackPress={() => navigation.goBack()} />
      <ScrollView keyboardShouldPersistTaps={'never'}>
        <ButtonSwitch
          button1={'Private Key'}
          button2={'Mnemonic'}
          state={switchState}
          setState={changeSwitchState}
        />
        <Controller
          control={control}
          name={switchState ? 'privateKey' : 'mnemonic'}
          render={({field: {onChange, value}}) => (
            <TextInput
              style={[
                styles.input,
                errors?.[switchState ? 'privateKey' : 'mnemonic']
                  ? styles.inputError
                  : {},
              ]}
              onChangeText={val => onChange(val)}
              value={value}
              placeholder={
                switchState
                  ? 'Enter your Private key'
                  : 'Enter your Mnemonic words'
              }
              placeholderTextColor={'grey'}
              autoCapitalize={'none'}
              multiline={true}
            />
          )}
        />
        <Text style={styles.errorMessage}>
          {errors?.[switchState ? 'privateKey' : 'mnemonic']?.message}
        </Text>
        <View
          style={{
            marginHorizontal: scale(16),
          }}>
          <Input
            control={control}
            name="passcode"
            placeholder="Enter passcode"
            label="Passcode"
            error={errors?.passcode?.message}
            keyboardType="number-pad"
            secureTextEntry
          />
        </View>
      </ScrollView>
      <View
        style={{
          marginBottom: 30,
        }}>
        <Button title={'Import'} onButtonPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default ImportWallet;
