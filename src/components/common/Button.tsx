import React from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {colors, fontFamily} from '../../theme';
import {ScaledSheet} from 'react-native-size-matters';

type Props = {
  title: string;
  onButtonPress: () => void;
  loading?: boolean;
  style?: object;
  textStyle?: object;
  variant?: 'outline' | 'solid';
  disabled?: boolean;
};

const Button = ({
  title,
  onButtonPress,
  style,
  textStyle,
  loading,
  variant,
  disabled,
}: Props) => {
  const buttonStyle = [
    styles.button,
    disabled && styles.disabledButton,
    variant === 'outline' && styles.outlineButtonStyle,
    style,
  ];
  const textStyles =
    title.length < 10
      ? [
          styles.buttonText,
          disabled && styles.disabledText,
          variant === 'outline' && styles.outlineTextStyle,
          textStyle,
        ]
      : [
          styles.smallButtonText,
          disabled && styles.disabledText,
          variant === 'outline' && styles.outlineTextStyle,
          textStyle,
        ];
  return (
    <TouchableOpacity
      style={buttonStyle}
      activeOpacity={loading || disabled ? 1 : 0.5}
      onPress={() => (loading || disabled ? {} : onButtonPress())}>
      {loading ? (
        <ActivityIndicator color={colors.primary.light} size="small" />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  button: {
    width: '80%',
    backgroundColor: colors.primary.main,
    height: '38@s',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 28,
    borderRadius: '6@s',
  },
  outlineButtonStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  buttonText: {
    color: colors.primary.dark,
    fontFamily: fontFamily.normal.medium,
    fontSize: '14@s',
    textAlign: 'center',
  },
  smallButtonText: {
    color: colors.primary.dark,
    fontFamily: fontFamily.normal.medium,
    fontSize: '11@s',
    textAlign: 'center',
  },
  outlineTextStyle: {
    color: colors.text.main,
  },
  disabledButton: {
    backgroundColor: colors.primary.dark,
  },
  disabledText: {
    color: colors.text.main,
  },
});

export default Button;
