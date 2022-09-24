/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-clipboard/clipboard';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import SimpleToast from 'react-native-simple-toast';
import {scale} from 'react-native-size-matters';
import base58 from 'bs58';

import {ExportMnemonicOrPrivateKeyStyles as styles} from './styles';
import {Button, Header, Input} from '../../components/common';
import {
  getEncryptedWalletInfo,
  getHashedPasscode,
} from '../../redux/reducers/wallet';
import {useAppSelector} from '../../hooks/useRedux';
import {CopyLightIcon} from '../../assets/icons';
import {Cryptography, Mnemonic, PrivateKey} from '../../utils/web3';
import {KeyboardAvoidingViewWrapper} from '../../components';

const copyToClipboard = async (text: string | undefined) => {
  Clipboard.setString(text!.toString());
  Toast.show('Copied to clipboard');
};

const privateKeyInfo =
  'Please back up your private key properly to restore your Health Bound Wallet! Health Bound Wallet will not save your private key.';

const mnemonicInfo =
  'Please back up your mnemonic properly to restore your Health Bound Wallet! Health Bound Wallet will not save your mnemonic.';

type Props = NativeStackScreenProps<TabParamList, 'ExportMnemonicOrPrivateKey'>;

const ExportMnemonicOrPrivateKey = ({navigation, route}: Props) => {
  const [passcode, setPasscode] = useState('');
  const [walletInfo, setWalletInfo] = useState<{
    mnemonic?: string;
    privateKey?: string;
  }>({
    mnemonic: '',
    privateKey: '',
  });
  const {mnemonic, privateKey} = useAppSelector(getEncryptedWalletInfo);
  const hashedPasscode = useAppSelector(getHashedPasscode);
  const {type} = route.params;

  const validationSchema = yup.object().shape({
    passcode: yup
      .string()
      .test('len', 'Must be exactly 6 characters', val => val!.length === 6)
      .required('Passcode is required'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ControlFieldValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {},
  });
  const onSubmit = (data: ControlFieldValues) => {
    const _hashedPasscode = Cryptography.hash(data.passcode);
    if (_hashedPasscode === hashedPasscode) {
      setPasscode(data.passcode);
      if (type === 'mnemonic' && mnemonic) {
        const _walletInfo = Mnemonic.decryptMnemonic(mnemonic, _hashedPasscode);
        setWalletInfo({
          mnemonic: _walletInfo.mnemonic,
        });
      } else if (type === 'privateKey' && privateKey) {
        const _walletInfo = PrivateKey.decryptPrivateKey(
          privateKey,
          _hashedPasscode,
        );
        setWalletInfo({
          privateKey: _walletInfo.privateKey,
        });
      } else {
        const {mnemonic: _mnemonic} = Mnemonic.decryptMnemonic(
          mnemonic,
          _hashedPasscode,
        );
        const _walletInfo = Mnemonic.restoreWalletFromMnemonic(_mnemonic);
        setWalletInfo({
          privateKey: base58.encode(_walletInfo.secretKey),
        });
      }
    } else {
      SimpleToast.show('Incorrect Passcode');
    }
  };
  return (
    <KeyboardAvoidingViewWrapper
      showsVerticalScrollIndicator={false}
      header={
        <Header
          title={type === 'mnemonic' ? 'Export Mnemonic' : 'Export Private Key'}
        />
      }>
      <View style={styles.backgroundStyle}>
        {!passcode ? (
          <View style={{marginHorizontal: scale(15), marginTop: scale(40)}}>
            <Input
              control={control}
              name="passcode"
              label="Passcode"
              placeholder="Enter your passcode"
              error={errors.passcode?.message}
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>
        ) : (
          <View style={styles.backupView}>
            <Text style={styles.header}>
              {type === 'mnemonic' ? 'Mnemonic' : 'Private Key'}
            </Text>
            <Text style={styles.info}>
              {type === 'mnemonic' ? mnemonicInfo : privateKeyInfo}
            </Text>
            <View>
              {type === 'mnemonic' ? (
                <View style={styles.privateKeyView}>
                  <Text style={styles.privateKey}>{walletInfo!.mnemonic}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(walletInfo!.mnemonic)}>
                    <Image style={styles.icon} source={CopyLightIcon} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.privateKeyView}>
                  <Text style={styles.privateKey}>
                    {walletInfo!.privateKey}
                  </Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(walletInfo!.privateKey)}>
                    <Image style={styles.icon} source={CopyLightIcon} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: scale(-20),
          }}>
          {!passcode ? (
            <Button title="Verify" onButtonPress={handleSubmit(onSubmit)} />
          ) : (
            <Button
              title="Done"
              onButtonPress={() => {
                navigation.navigate({name: 'Home', params: {}});
              }}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};

export default ExportMnemonicOrPrivateKey;
