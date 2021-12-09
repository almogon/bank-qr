import * as React from 'react';
import { useForm } from "react-hook-form";
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView, View, Text } from '@app/components/Themed';
import Input from '@app/components/Input';
import { getItem, setItem } from '@app/stores/async-storage';

type PersonalData = {
  name: string;
  iban: string;
  bic: string;
}

const NAME = 'name';
const IBAN = 'iban';
const BIC = 'bic';
const IBAN_PATTERN = /^\b([a-zA-Z]{2}[0-9]{2})(?:[ ]?[0-9]{4}){4,5}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?\b$/gm

const Profile = ({ navigation }: any) => {
  const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm({ mode: 'onChange' });

  const onSubmit: any = (data: any) => {
    setItem('personalData', {
      name: data.name.toUpperCase(),
      iban: data.iban.toUpperCase(),
      bic: data.bic.toUpperCase()
    });
    console.log('GUARDAR y NAVEGAR');
    navigation.goBack();
  };
  const [iban, setiban] = useState('');
  const [name, setName] = useState('');
  const [bic, setBic] = useState('');

  useEffect(() => {
    const fnct = async () => {
      const personalData: PersonalData = await getItem('personalData');
      if (personalData != null) {
        if (personalData.name) {
          setName(personalData.name);
          setValue(NAME, personalData.name);
        }
        if (personalData.iban) {
          // TODO Format add spaces
          setiban(formatIbanWithSpaces(personalData.iban));
          setValue(IBAN, personalData.iban);
        }
        if (personalData.bic) {
          setBic(personalData.bic);
          setValue(BIC, personalData.bic);
        }
      }
    }

    fnct();
  }, [])

  const formatIbanWithSpaces = (iban: string): string => {
    if (!iban.length) {
      console.error('Empty iban');
      return;
    }
    iban = iban.replace( /\s/g , '');
    let ibanAux = '';
    iban.split('').map((char: string, idx: number) => {
      if (idx != 0 && idx % 4 === 0) {
        ibanAux += ' '
      }
      ibanAux += char;
    });

    return ibanAux;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.title}>Personal Data</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.form}>
        <Input
          label='NAME'
          {...register(NAME, { required: { value: true, message: 'Mandatory'} })}
          defaultValue={name}
          inputStyle={styles.inputBig}
          error={errors.name}
          onChangeText={(value: string) => {
            setValue(NAME, value);
            if (value.length) {
              clearErrors(NAME);
            }
          }}>  
        </Input>

        <Input
          label='IBAN'
          {...register(IBAN, {
            required: { value: true, message: 'Mandatory'},
            pattern: { value: IBAN_PATTERN, message: 'Incorrect format'},
          })}
          inputStyle={styles.inputBig}
          onChangeText={(value: string) => {
            var formattedValue = value.toUpperCase().trim();
            setiban(formattedValue);
            setValue(IBAN, formattedValue);
          }}
          onBlur={() => {
            if (IBAN_PATTERN.test(iban)) {
              clearErrors(IBAN);
            }
            setiban(formatIbanWithSpaces(iban));
          }}
          textTransform="uppercase"
          error={errors.iban}
          defaultValue={iban}
        >
        </Input>

        <Input
          label='BIC'
          {...register(BIC, { required: { value: true, message: 'Mandatory'} })}
          defaultValue={bic}
          inputStyle={styles.inputBig}
          error={errors.bic}
          onChangeText={(value: string) => {
            setValue(BIC, value.toUpperCase());
            if (value.length) {
              clearErrors(BIC);
            }
          }}>
        </Input>

        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 30
  },
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  form: {
    width: '80%',
  },
  inputBig: {
    width: '100%'
  },
  ibanContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: '100%',
    marginBottom: 8
  },
  ibanSeparator: {
    marginHorizontal: 10,
    textAlignVertical: 'center',
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'green',
    borderRadius: 40,
    width: '60%',
    alignItems: 'center',
    marginTop: 50,
    paddingVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});


