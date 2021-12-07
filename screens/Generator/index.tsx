import { Feather } from '@expo/vector-icons';
import * as React from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as routes from '@app/navigation/routes';
import styles from './styles';
import { getItem } from '@app/stores/async-storage';
import SvgQRCode from 'react-native-qrcode-svg';

export default async function Generator({ navigation }: any) {
  
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

  useEffect(() => {
    const localData = getItem('personalData');
    if (!localData) {
      navigation.navigate(routes.SETTINGS);
    }
  }, []);

  const valueQR = 'BCD'+'\n'+'001'+'\n'+'1'+'\n'+'SCT'+'\n'+'ABCDATWW'+'\n'+'Example with fictive data'+'\n'+'AT611904300234573201'+'\n'+'EUR12.5'+'\n'+'reference'+'\n'+'\n'+'message';

  const functionSEPA = 'BCD'+'\n'+'001';
  const dataEncodeUTF8 = '1';
  const extrainfoQR = 'SCT';
  
  const personalData = await getItem('personalData');
  const bic = personalData.bic;
  const creditor = personalData.name;
  const iban = personalData.iban;
  const ammount = 'EUR'; // TODO add ammount from input
  const reason = ''; // not provide add directly break line
  const reference = ''; // TODO add reference from input
  const text = ''; // Only text or reference can be provide, replace with a jump place
  const message = ''; // Create input or let empty

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <SvgQRCode value={valueQR}></SvgQRCode>
    </View>
  );
}

