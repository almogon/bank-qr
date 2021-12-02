import * as React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { FieldError } from 'react-hook-form';
import { onChange } from 'react-native-reanimated';

interface Props extends TextInputProps {
  name: string;
  label?: string;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  error?: FieldError | undefined;
  textTransform?: any;
}

export default React.forwardRef<any, Props>(
  (props, ref): React.ReactElement => {
    const { label, labelStyle, error, autoCapitalize='none', textTransform='none', inputStyle, ...inputProps } = props;

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <TextInput
          autoCapitalize={autoCapitalize}
          ref={ref}
          style={[styles.input, inputStyle, { borderColor: error ? '#fc6d47' : '#c0cbd3' }, { textTransform: textTransform }]}
          {...inputProps}
        />
        {error && <Text style={styles.textError}>{error.message}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 40,
    color: 'grey',
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  textError: {
    color: '#fc6d47',
    fontSize: 14,
  },
});
