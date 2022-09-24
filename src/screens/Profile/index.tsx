import {Text, View} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';

import {colors} from '../../theme';
import {Header} from '../../components/common';

const Profile = () => {
  return (
    <View style={styles.container}>
      <Header title="Profile" />
    </View>
  );
};

export default Profile;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
});
