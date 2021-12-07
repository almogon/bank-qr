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
const IBAN1 = 'iban1';
const IBAN2 = 'iban2';
const IBAN3 = 'iban3';
const IBAN4 = 'iban4';
const BIC = 'bic';

const Profile = ({ navigation }: any) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onChange' });

  const onSubmit: any = (data: any) => {
    console.log('to save', data);

    setItem('personalData', {
      name: data.name.toUpperCase(),
      iban: `${data.iban1}${data.iban2}${data.iban3}${data.iban4}`.toUpperCase(),
      bic: data.bic.toUpperCase()
    });
    console.log('GUARDAR y NAVEGAR');
    // navigation.goBack();
  };
  const [ibanForm, setiban] = useState(['', '', '', '']);
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
          // split iban
          const iban1 = personalData.iban.slice(0, 4);
          const iban2 = personalData.iban.slice(4, 8);
          const iban3 = personalData.iban.slice(8, 12);
          const iban4 = personalData.iban.slice(12, 16);
          console.log(iban1, iban2, iban3, iban4);
          setiban([iban1, iban2, iban3, iban4]);
          setValue(IBAN1, iban1);
          setValue(IBAN2, iban2);
          setValue(IBAN3, iban3);
          setValue(IBAN4, iban4);
        }
        if (personalData.bic) {
          setBic(personalData.bic);
          setValue(BIC, personalData.bic);
        }
      }
    }

    fnct();
  }, [])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.title}>Personal Data</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.form}>
        <Input
          label='NAME'
          {...register(NAME, { required: true })}
          defaultValue={name}
          inputStyle={styles.inputBig}
          error={errors.name}
          onChangeText={(value: string) => {
            setValue(NAME, value);
          }}>  
        </Input>

        <Text style={styles.label}>IBAN</Text>
        <View style={styles.ibanContainer}>
          <Input
            {...register(IBAN1, {
              required: true,
              pattern: /^[A-Z]{2}[0-9]{2}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField}
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[0] = value.toUpperCase();
              setiban(auxIban);
              setValue(IBAN1, value.toUpperCase());
            }}
            textTransform="uppercase"
            maxLength={4}
            error={errors.iban1}
            defaultValue={ibanForm[0]}
          >
          </Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input
            {...register(IBAN2, {
              required: true,
              pattern: /^[0-9]{4}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField}
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[1] = value;
              setiban(auxIban);
              setValue(IBAN2, value);
            }}
            keyboardType='numeric'
            maxLength={4}
            error={errors.iban2}
            defaultValue={ibanForm[1]}
          >
          </Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input
            {...register(IBAN3, {
              required: true,
              pattern: /^[0-9]{4}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField}
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[2] = value;
              setiban(auxIban);
              setValue(IBAN3, value);
            }}
            keyboardType='numeric'
            maxLength={4}
            error={errors.iban3}
            defaultValue={ibanForm[2]}
          >
          </Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input
            {...register(IBAN4, {
              required: true,
              pattern: /^[0-9]{4}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField}
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[3] = value;
              setiban(auxIban);
              setValue(IBAN4, value);
            }}
            keyboardType='numeric'
            maxLength={4}
            error={errors.iban4}
            defaultValue={ibanForm[3]}
          >
          </Input>
        </View>

        <Input
          label='BIC'
          {...register(BIC)}
          defaultValue={bic}
          inputStyle={styles.inputBig}
          onChangeText={(value: string) => {
            setValue(BIC, value);
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
  inputIbanField: {
    width: 60,
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


