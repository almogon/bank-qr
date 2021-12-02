import * as React from 'react';
import Input from '../../components/Input';
import { Text, View, ScrollView } from '../../components/Themed';
import { useForm } from "react-hook-form";
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import usePersonalData, { PersonalData } from '../../stores/personalData';


const Profile = () => {
  const { register, handleSubmit, setValue, formState: {errors} } = useForm({mode: 'onChange'});
  // const {updateName, updateIban, updateBic, name, iban, bic} = usePersonalData((state: PersonalData) => ({
  //   updateName: state.updateName,
  //   updateIban: state.updateIban,
  //   updateBic: state.updateBic,
  //   name: state.name,
  //   iban: state.iban,
  //   bic: state.bic
  // }));
  // const onSubmit: any = (data: any) => {
  //   console.log('LOOOOl', data);
  //   console.log('GUARDAR y NAVEGAR');
  //   updateName(data.name);
  //   updateIban(`${data.iban1}${data.iban2}${data.iban3}${data.iban4}`);
  //   updateBic(data.bic);
  // };
  const [ibanForm, setiban] = useState(['','','','']);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.title}>Personal Data</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.form}>
        <Input label='NAME' {...register('name', {required: true})} inputStyle={styles.inputBig} error={errors.name} onChangeText={(value: string) => {
          setValue('name', value);
        }} ></Input>

        <Text style={styles.label}>IBAN</Text>
        <View style={styles.ibanContainer}>
          <Input 
            {...register('iban1', {
              required: true,
              pattern: /^[A-Z]{2}[0-9]{2}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField} 
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[0] = value.toUpperCase();
              setiban(auxIban);
              setValue('iban1', value);
            }}
            textTransform="uppercase"
            maxLength={4}
            error={errors.iban1}
          >
          </Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input 
            {...register('iban2', {
              required: true,
              pattern: /^[0-9]{4}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField} 
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[1] = value;
              setiban(auxIban);
              setValue('iban2', value);
            }}
            keyboardType='numeric'
            maxLength={4}
            error={errors.iban2}
          >
          </Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input 
            {...register('iban3', {
              required: true,
              pattern: /^[0-9]{4}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField} 
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[2] = value;
              setiban(auxIban);
              setValue('iban3', value);
            }}
            keyboardType='numeric'
            maxLength={4}
            error={errors.iban3}
          >
          </Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input 
            {...register('iban4', {
              required: true,
              pattern: /^[0-9]{4}$/i,
              maxLength: 4
            })}
            inputStyle={styles.inputIbanField} 
            onChangeText={(value: string) => {
              const auxIban: string[] = ibanForm;
              auxIban[3] = value;
              setiban(auxIban);
              setValue('iban4', value);
            }}
            keyboardType='numeric'
            maxLength={4}
            error={errors.iban4}
          >
          </Input>
        </View>

        <Input label='BIC' {...register('bic')} inputStyle={styles.inputBig} onChangeText={(value: string) => {
          setValue('bic', value);
        }}></Input>

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


