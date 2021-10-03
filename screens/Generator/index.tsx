import { Feather, FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import styles from './styles';

export default function Generator({ navigation }: any) {
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => navigation.navigate('Config')}>
          <Feather size={25} style={styles.icon} name="settings" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

