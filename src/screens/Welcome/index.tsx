import {Image, Text, View} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {colors, fontFamily, fontSizes} from '../../theme';
import {Illustration} from '../../assets/images';
import {Button} from '../../components/common';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const Welcome: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={Illustration} style={styles.illustration} />
      <Text style={styles.title}>Health Bound</Text>
      <Text style={styles.info}>
        Create your soulbound token associated to your health and clam “Health
        Bound Tokens” every day.
      </Text>
      <View style={styles.buttons}>
        <Button
          title="Create Wallet"
          onButtonPress={() => navigation.navigate('BackupMnemonicInfo', {})}
        />
        <Button
          title="Restore Wallet"
          onButtonPress={() => navigation.navigate('ImportWallet', {})}
          variant="outline"
        />
      </View>
    </View>
  );
};

export default Welcome;

const styles = ScaledSheet.create({
  container: {
    backgroundColor: colors.background.main,
    flex: 1,
  },
  illustration: {
    height: '250@s',
    width: '250@s',
    alignSelf: 'center',
    marginTop: '80@s',
  },
  title: {
    color: colors.text.main,
    fontSize: fontSizes[6],
    fontFamily: fontFamily.normal.bold,
    textAlign: 'center',
    marginTop: '60@s',
  },
  info: {
    color: colors.text.main,
    fontSize: fontSizes[2],
    fontFamily: fontFamily.normal.medium,
    textAlign: 'center',
    marginTop: '10@s',
    paddingHorizontal: '16@s',
  },
  buttons: {
    marginTop: '20@s',
  },
});
