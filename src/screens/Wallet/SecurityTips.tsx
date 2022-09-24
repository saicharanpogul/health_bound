import {Text, View} from 'react-native';
import React from 'react';

import {SecurityTipsStyles as styles} from './styles';
import {Button, Header} from '../../components/common';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<TabParamList, 'SecurityTips'>;

const SecurityTips = ({navigation, route}: Props) => {
  const {type} = route.params;
  const mnemonicSecurityTips = [
    'Mnemonic has the same value as your bank card number & password, obtaining the mnemonic is equivalent to obtaining your Health Bound wallet assets.',
    'Make sure backup in a safe environment with no cameras and no one around.',
    'Do not send your mnemonic to anyone, include the staff member.',
    'If your phone got loss, damage, or uninstall App, you can use mnemonic to restore your Health Bound Wallet.',
  ];
  const privateKeySecurityTips = [
    'Obtaining the private key is equivalent to owning the wallet asset ownership.',
    'Copy the Private Key with paper & pen, and keep it safe.',
    'IF you loss the private key, it cannot be retrieved. Please keep it properly.',
  ];
  return (
    <View style={styles.background}>
      <Header
        title={
          type === 'mnemonic'
            ? 'Mnemonic Security Tips'
            : 'Private Key Security Tips'
        }
      />
      <View style={styles.tips}>
        <Text style={styles.header}>Important Information</Text>
        {type === 'mnemonic'
          ? mnemonicSecurityTips.map((item, index) => (
              <Text key={index} style={styles.tip}>
                • {item}
              </Text>
            ))
          : privateKeySecurityTips.map((item, index) => (
              <Text key={index} style={styles.tip}>
                • {item}
              </Text>
            ))}
      </View>
      <View style={styles.buttons}>
        <Button
          title="Next"
          onButtonPress={() =>
            navigation.navigate({
              name: 'ExportMnemonicOrPrivateKey',
              params: {type},
            })
          }
        />
        <Button
          title="Later"
          variant={'outline'}
          onButtonPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export default SecurityTips;
