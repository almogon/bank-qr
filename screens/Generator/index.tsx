import { Feather } from "@expo/vector-icons";
import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  useColorScheme,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as routes from "@app/navigation/routes";
import { getItem } from "@app/stores/async-storage";
import SvgQRCode from "react-native-qrcode-svg";
import Input from "@app/components/Input";
import { useIsFocused } from "@react-navigation/native";
import i18n from "@app/i18n";

const CURRENCY = "EUR";
const SEPA = "BCD" + "\n" + "002" + "\n";
const DATA_CODE_UTF_8 = "1";
const EXTRA_INFO = "SCT";
const LINE_BREAK = "\n";
const WIDTH = Dimensions.get("screen").width;

const Generator = ({ navigation }: any) => {
  const [bic, setbic] = useState(null);
  const [creditor, setcreditor] = useState(null);
  const [iban, setiban] = useState(null);
  const [amount, setamount] = useState(0);
  const [reference, setreference] = useState(null);
  const [isKeyboardOpen, setisKeyboardOpen] = useState(false);
  const [showQR, setshowQR] = useState(false);

  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => navigation.navigate(routes.SETTINGS)}
        >
          <Feather
            size={25}
            style={[
              styles.icon,
              { color: colorScheme === "dark" ? "white" : "black" },
            ]}
            name="settings"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colorScheme]);

  const generateQRString = (): string => {
    /**
     * 
BCD
002
1
SCT

Deutsches Rotes Kreuz e. V.
AT351921080380040917
EUR10.00


Internationale Soforthilfe
     */

    const payload =
      SEPA +
      DATA_CODE_UTF_8 +
      LINE_BREAK +
      EXTRA_INFO +
      LINE_BREAK +
      LINE_BREAK +
      creditor +
      LINE_BREAK +
      iban +
      LINE_BREAK +
      CURRENCY +
      amount +
      LINE_BREAK +
      LINE_BREAK +
      LINE_BREAK +
      reference;
    console.log(payload);
    return payload;
  };

  useEffect(() => {
    let keyboardShown = Keyboard.addListener("keyboardDidShow", () => {
      setisKeyboardOpen(true);
    });

    let keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      setisKeyboardOpen(false);
    });

    return () => {
      keyboardShown = null;
      keyboardHide = null;
    };
  }, []);

  useEffect(() => {
    getItem("personalData")
      .then((value) => {
        // console.log("Promise", value);
        setbic(value.bic);
        setcreditor(value.name);
        setiban(value.iban);
      })
      .catch((error) => navigation.navigate(routes.SETTINGS));
  }, [isFocused]);

  useEffect(() => {
    setshowQR(amount !== null && amount !== 0 && !isKeyboardOpen);
  }, [amount, isKeyboardOpen]);

  useEffect(() => {
    showQR ? fadeIn() : fadeOut();
  }, [showQR]);

  if (!bic || !creditor || !iban) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t("noData")}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.full}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {!isKeyboardOpen && (
              <SvgQRCode
                value={generateQRString()}
                size={WIDTH / 1.5}
              ></SvgQRCode>
            )}
          </Animated.View>

          <Animated.View
            style={{
              flex: showQR ? 0.5 : 1,
              paddingTop: showQR ? 0 : isKeyboardOpen ? 50 : 0,
            }}
          >
            <Text style={styles.label}>{i18n.t("amount").toUpperCase()}</Text>
            <View style={styles.amountGroup}>
              <TextInput
                style={styles.inputAmount}
                keyboardType="numeric"
                autoFocus={true}
                onChangeText={(value: string) => {
                  setamount(Number(value.replace(",", ".")));
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
              label={i18n.t("reference").toUpperCase()}
              onChangeText={(value: string) => {
                setreference(value.trim());
              }}
              multiline={true}
              style={styles.input}
            ></Input>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Generator;

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
  container2: {
    flex: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    width: WIDTH * 0.8,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 50,
    color: "grey",
    borderColor: "#c0cbd3",
  },
  inputAmount: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 50,
    color: "grey",
    borderColor: "#c0cbd3",
  },
  amountGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: WIDTH * 0.8,
  },
  currency: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderStyle: "solid",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: "#c0cbd3",
    textAlignVertical: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyInput: {
    flex: 1,
    fontSize: 40,
    color: "grey",
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});
