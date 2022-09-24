import {Image, Text, View} from 'react-native';
import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {scale} from 'react-native-size-matters';

import {backupMnemonicStyles as styles} from './styles';
import {Button, Header} from '../../components/common';
import {WarningIcon} from '../../assets/icons';

type Props = NativeStackScreenProps<RootStackParamList, 'BackupMnemonicInfo'>;

const Rule = ({info}: {info: string}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: scale(15),
        width: '85%',
      }}>
      <Text style={styles.info}>{'-  '}</Text>
      <Text style={styles.info}>{info}</Text>
    </View>
  );
};

const rules = [
  'Health Bound Wallet does not save mnemonic words for you.',
  'If your device is damaged, lost, stolen, or inaccessible.',
  'Mnemonic are the only way to help you recover your wallet.',
];

const BackupMnemonicInfo = ({navigation}: Props) => {
  return (
    <View style={styles.backgroundStyle}>
      <Header
        title="Wallet Creation Info"
        onBackPress={() => navigation.goBack()}
      />
      <Text style={styles.header}>Backup Your Mnemonic</Text>
      <View style={styles.warningView}>
        <Image source={WarningIcon} style={styles.warningIcon} />
        <Text style={styles.warning}>
          We Strongly recommend backing up your Mnemonic.
        </Text>
      </View>
      {rules.map((info, index) => (
        <Rule key={index} info={info} />
      ))}
      <View style={styles.buttonView}>
        <Button
          title="Next"
          onButtonPress={() =>
            navigation.navigate({
              name: 'NewWallet',
              params: {},
            })
          }
        />
      </View>
    </View>
  );
};

export default BackupMnemonicInfo;
