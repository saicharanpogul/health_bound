import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

import {BackIcon, MoreIcon} from '../../assets/icons';
import {colors} from '../../theme';

type Props = {
  title: string;
  titleStyle?: object;
  onBackPress?: () => void;
  onMorePress?: () => void;
  other?: JSX.Element;
};

const Header = ({
  title,
  titleStyle,
  onBackPress,
  onMorePress,
  other,
}: Props) => {
  return (
    <View style={styles.headerStyle}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress}>
          <Image source={BackIcon} style={styles.icon} />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      {onMorePress && (
        <TouchableOpacity onPress={onMorePress} style={styles.more}>
          <Image source={MoreIcon} style={styles.icon} />
        </TouchableOpacity>
      )}
      {other ? other : null}
    </View>
  );
};

export default Header;

const styles = ScaledSheet.create({
  headerStyle: {
    height: '48@s',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '6@s',
    paddingVertical: '10@s',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.text.main,
    marginStart: '8@s',
  },
  icon: {
    width: 30,
    height: 30,
  },
  more: {
    position: 'absolute',
    right: '4@s',
  },
});
