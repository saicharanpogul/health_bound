import {
  Text,
  View,
  TextInput,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {scale, ScaledSheet} from 'react-native-size-matters';
import {Controller, Control} from 'react-hook-form';

import {colors, fontFamily} from '../../theme';
import ErrorText from '../ErrorText';

type Props = {
  name: string;
  label?: string;
  defaultValue?: string | number;
  style?: StyleProp<TextStyle>;
  labelStyles?: object;
  placeholder: string;
  placeholderTextColor?: string;
  control: Control<ControlFieldValues, any>;
  error?: string;
};

const Input: React.FC<Props & TextInputProps> = ({
  name,
  label,
  defaultValue,
  style,
  labelStyles,
  placeholder,
  placeholderTextColor,
  control,
  error,
  ...rest
}) => {
  const [_defaultValue, setDefaultValue] = useState(
    defaultValue as string | number,
  );
  const [height, setHeight] = useState(scale(38));

  useEffect(() => {
    if (defaultValue) {
      setDefaultValue(defaultValue);
    }
  }, [defaultValue]);

  const _placeholderTextColor = placeholderTextColor ?? colors.text.light;
  const _labelStyles = [labelStyles, inputStyles.label];
  const _styles = [
    style,
    inputStyles.input,
    rest.multiline
      ? {
          height: height > scale(38) ? height : scale(38),
          padding: scale(10),
        }
      : null,
  ];
  return (
    <View>
      <Text style={_labelStyles}>{label}</Text>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || ''}
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            style={_styles}
            placeholder={placeholder}
            placeholderTextColor={_placeholderTextColor}
            onChangeText={text => onChange(text)}
            onBlur={onBlur}
            value={value}
            onContentSizeChange={event => {
              const {contentSize} = event.nativeEvent;
              setHeight(contentSize.height);
            }}
            defaultValue={_defaultValue ? _defaultValue.toString() : ''}
            {...rest}
          />
        )}
      />
      <ErrorText
        message={error as string}
        style={{
          marginBottom: error && scale(8),
        }}
      />
    </View>
  );
};

export default Input;

const inputStyles = ScaledSheet.create({
  input: {
    height: '38@s',
    backgroundColor: colors.background.light,
    borderRadius: '6@s',
    paddingHorizontal: '10@s',
    fontFamily: fontFamily.normal.regular,
    fontSize: '12@s',
    color: colors.text.main,
  },
  label: {
    fontSize: '12@s',
    fontFamily: fontFamily.normal.regular,
    color: colors.text.main,
    marginBottom: '2@s',
  },
});
