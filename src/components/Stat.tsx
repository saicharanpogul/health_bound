import {Text, View} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {colors, fontFamily, fontSizes} from '../theme';

type Props = {
  label: string;
  value: string | number | undefined;
};

const Stat: React.FC<Props> = ({label, value}) => {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default Stat;

const styles = ScaledSheet.create({
  stat: {
    backgroundColor: colors.background.light,
    padding: '10@s',
    width: '140@s',
    alignItems: 'center',
    margin: '2@s',
    borderRadius: '10@s',
  },
  label: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    paddingHorizontal: '16@s',
  },
  value: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.medium,
    fontSize: fontSizes[2],
    paddingHorizontal: '16@s',
    marginTop: '2@s',
  },
});
