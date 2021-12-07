import { Feather } from '@expo/vector-icons';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as routes from '@app/navigation/routes';
import { getItem } from '@app/stores/async-storage';
import SvgQRCode from 'react-native-qrcode-svg';
import Input from '@app/components/Input';
import { StyleSheet, Dimensions } from 'react-native';

const CURRENCY = 'EUR';
const SEPA = 'BCD'+'\n'+'001';
const DATA_CODE_UTF_8 = '1';
const EXTRA_INFO = 'SCT';
const LINE_BREAK = '\n';
const WIDTH = Dimensions.get('screen').width;

const Generator = ({ navigation }: any) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => navigation.navigate(routes.SETTINGS)}>
          <Feather size={25} style={styles.icon} name="settings" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const valueQR = 'BCD'+'\n'+'001'+'\n'+'1'+'\n'+'SCT'+'\n'+'ABCDATWW'+'\n'+'Example with fictive data'+'\n'+'AT611904300234573201'+'\n'+'EUR12.5'+'\n'+'reference'+'\n'+'\n'+'message';


  const [bic, setbic] = useState(null);
  const [creditor, setcreditor] = useState(null);
  const [iban, setiban] = useState(null);
  const [amount, setamount] = useState(0);
  const [reference, setreference] = useState(null);
  const [message, setmessage] = useState(null);

  const generateQRString = (): string => {
    return SEPA + LINE_BREAK + 
      DATA_CODE_UTF_8 + LINE_BREAK + 
      EXTRA_INFO + LINE_BREAK +
      bic + LINE_BREAK + 
      creditor + LINE_BREAK + 
      iban + LINE_BREAK +
      CURRENCY + amount + LINE_BREAK +
      reference;
  }
  
  useEffect(() => {
    getItem('personalData').then(value => {
      setbic(value.bic);
      setcreditor(value.name);
      setiban(value.iban);
    }).catch(error => navigation.navigate(routes.SETTINGS));
  }, []);


  if (!bic || !creditor || !iban) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please add your personal data that we can generate your QR</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.full}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SvgQRCode value={generateQRString()} size={WIDTH / 1.5}></SvgQRCode>
          <View style={styles.container2}>
            <Input
              label='AMOUNT'
              name='AMOUNT'
              keyboardType='numeric'
              onChangeText={(value: string) => {
                setamount(Number(value));
              }}
              onBlur={() => {
                // Add amount validation
                /** Check si hay punto y coma, si se utilizan de manera correcta
                 * Si solo hay 1 punto, logica para mirar si es decimal o si es de miles
                 * si solo hay 1 coma, mirar si es decimal o si es de miles
                 */
              }}
              style={styles.inputAmount}
            >
              <Text>€</Text>
            </Input>

            <Input
              label='REFERENCE'
              name='REFERENCE'
              onChangeText={(value: string) => {
                setreference(value);
              }}
              multiline={true}
            ></Input>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  );
}

export default Generator;

const styles = StyleSheet.create({
  full: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  container2: {
    flex: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: 10
  },
  inputAmount: {
    width: WIDTH * 0.6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 40,
    color: 'grey',
    borderColor: '#c0cbd3'
  },
});

