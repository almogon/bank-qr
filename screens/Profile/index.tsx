import * as React from 'react';
import Input from '../../components/Input';
import { Text, View, ScrollView } from '../../components/Themed';
import { useForm } from "react-hook-form";
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function Profile() {
  const { register, handleSubmit, setValue, formState: {errors} } = useForm();
  const onSubmit: any = (data:any) => console.log(data);
  const [iban, setiban] = useState(['','','',''])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.title}>Personal Data</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.form}>
        <Input label='NAME' {...register('name', {required: true})} inputStyle={styles.inputBig} error={errors.name} onChange={(value) => {
          setValue('name', value);
        }} ></Input>

        <Text style={styles.label}>IBAN</Text>
        <View style={styles.ibanContainer}>
          <Input {...register('iban1', {required: true})} inputStyle={styles.inputIbanField} onChangeText={(value: string) => {
            const auxIban: string[] = iban;
            auxIban[0] = value;
            setiban(auxIban);
          }}></Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input {...register('iban2', {required: true})} inputStyle={styles.inputIbanField} onChangeText={(value) => {
           const auxIban: string[] = iban;
           auxIban[1] = value;
           setiban(auxIban);
          }}></Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input {...register('iban3', {required: true})} inputStyle={styles.inputIbanField} onChangeText={(value) => {
            const auxIban: string[] = iban;
            auxIban[2] = value;
            setiban(auxIban);
          }}></Input>
          <Text style={styles.ibanSeparator}>-</Text>

          <Input {...register('iban4', {required: true})} inputStyle={styles.inputIbanField} onChangeText={(value) => {
            const auxIban: string[] = iban;
            auxIban[4] = value;
            setiban(auxIban);
          }}></Input>
        </View>

        <Input label='BIC' {...register('bic')} inputStyle={styles.inputBig} onChange={(value) => {
          setValue('bic', value);
        }}></Input>

        <TouchableOpacity onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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


