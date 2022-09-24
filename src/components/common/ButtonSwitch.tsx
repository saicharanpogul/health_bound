import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, fontFamily} from '../../theme';
import {ScaledSheet} from 'react-native-size-matters';

type Props = {
  button1: string;
  button2: string;
  state: boolean;
  setState: (state: boolean) => void;
};

const ButtonSwitch = ({button1, button2, state, setState}: Props) => {
  // true - button1, false - button2
  let buttonStyle = {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  };
  return (
    <View style={styles.switchView}>
      <TouchableOpacity
        style={[styles.switch, {marginEnd: 8}, state ? buttonStyle : {}]}
        onPress={() => setState(true)}>
        <Text style={!state ? styles.outlineSwitchText : styles.switchText}>
          {button1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.switch, {marginStart: 8}, !state ? buttonStyle : {}]}
        onPress={() => setState(false)}>
        <Text style={state ? styles.outlineSwitchText : styles.switchText}>
          {button2}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonSwitch;

const styles = ScaledSheet.create({
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: '10@s',
    marginTop: '20@s',
  },
  switch: {
    width: '50%',
    height: '40@s',
    borderRadius: '6@s',
    borderWidth: 1,
    borderColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10@s',
  },
  switchText: {
    textAlign: 'center',
    color: colors.primary.dark,
    fontFamily: fontFamily.normal.regular,
  },
  outlineSwitchText: {
    textAlign: 'center',
    color: colors.text.main,
    fontFamily: fontFamily.normal.regular,
  },
});
