import {Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import Clipboard from '@react-native-clipboard/clipboard';

import {truncateAddress} from '../utils';
import {colors, fontFamily} from '../theme';
import {CopyLightIcon} from '../assets/icons';
import SimpleToast from 'react-native-simple-toast';

type Props = {
  address: string;
};

const AddressBar = ({address}: Props) => {
  const copyToClipboard = () => {
    Clipboard.setString(address);
    SimpleToast.show('Copied to clipboard');
  };
  return (
    <TouchableOpacity onPress={copyToClipboard} style={styles.addressBar}>
      <Text style={styles.address}>{truncateAddress(address)}</Text>
      <Image style={styles.icon} source={CopyLightIcon} />
    </TouchableOpacity>
  );
};

export default AddressBar;

const styles = ScaledSheet.create({
  addressBar: {
    height: '36@s',
    backgroundColor: colors.text.dark,
    padding: '6@s',
    borderRadius: '6@s',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10@s',
    width: '130@s',
    flexDirection: 'row',
    paddingStart: '8@s',
    alignSelf: 'flex-end',
  },
  address: {
    fontFamily: fontFamily.normal.semiBold,
    fontSize: '12@s',
    color: colors.text.main,
  },
  icon: {
    width: '20@s',
    height: '20@s',
    marginLeft: '4@s',
  },
});
