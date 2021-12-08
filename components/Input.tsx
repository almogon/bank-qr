import * as React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { FieldError } from 'react-hook-form';

interface Props extends TextInputProps {
  label?: string;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  error?: FieldError | undefined;
  textTransform?: "capitalize" | "uppercase" | "lowercase" | "none";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default React.forwardRef<any, Props>(
  (props: any, ref: any): React.ReactElement => {
    const { label, labelStyle, error, autoCapitalize='none', 
    textTransform='none', inputStyle, ...inputProps } = props;

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <TextInput
          autoCapitalize={autoCapitalize}
          ref={ref}
          style={StyleSheet.flatten([styles.input, inputStyle, { borderColor: error ? '#fc6d47' : '#c0cbd3' }, { textTransform: textTransform }])}
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
    textTransform: "uppercase"
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
