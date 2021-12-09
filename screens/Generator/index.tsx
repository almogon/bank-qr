import { Feather } from '@expo/vector-icons';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, TextInput, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as routes from '@app/navigation/routes';
import { getItem } from '@app/stores/async-storage';
import SvgQRCode from 'react-native-qrcode-svg';
import Input from '@app/components/Input';

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
  const [isKeyboardOpen, setisKeyboardOpen] = useState(false);

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

    Keyboard.addListener('keyboardDidShow', () => {
      console.log('Keyzboard show');
      setisKeyboardOpen(true);
    });

    Keyboard.addListener('keyboardDidHide', () => {
      console.log('Keyzboard hide');
      setisKeyboardOpen(false);
    });
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
          {!isKeyboardOpen && <SvgQRCode value={generateQRString()} size={WIDTH / 1.5}></SvgQRCode>}
          
          <View style={styles.container2}>
            <Text style={styles.label}>AMOUNT</Text>
            <View style={[, styles.amountGroup]}>
              <TextInput
                style={styles.inputAmount}
                keyboardType='numeric'
                onChangeText={(value: string) => {
                  setamount(Number(value.replace(',', '.')));
                }}
                onBlur={() => {
                  // Add amount validation
                  /** Check si hay punto y coma, si se utilizan de manera correcta
                   * Si solo hay 1 punto, logica para mirar si es decimal o si es de miles
                   * si solo hay 1 coma, mirar si es decimal o si es de miles
                   */
                }}
                />
              <View style={styles.currency}>
              <Text style={styles.currencyInput}>€</Text>
              </View>
            </View>
            

            <Input
              label='REFERENCE'
              onChangeText={(value: string) => {
                setreference(value.trim());
              }}
              multiline={true}
              style={styles.input}
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
  input: {
    width: WIDTH * 0.8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 50,
    color: 'grey',
    borderColor: '#c0cbd3'
  },
  inputAmount: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 50,
    color: 'grey',
    borderColor: '#c0cbd3',
  },
  amountGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: WIDTH * 0.8,
  },
  currency: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderStyle: 'solid',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: '#c0cbd3',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  currencyInput: {
    flex: 1,
    fontSize: 40,
    color: 'grey',
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

