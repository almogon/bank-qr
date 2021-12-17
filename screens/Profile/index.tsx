import * as React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Clipboard, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ScrollView, View, Text } from "@app/components/Themed";
import Input from "@app/components/Input";
import { getItem, setItem, removeItem } from "@app/stores/async-storage";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import i18n from "@app/i18n";

type PersonalData = {
  name: string;
  iban: string;
  bic: string;
};

const NAME = "name";
const IBAN = "iban";
const BIC = "bic";
const IBAN_PATTERN =
  /^\b([a-zA-Z]{2}[0-9]{2})(?:[ ]?[0-9]{4}){4,5}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?\b$/gm;

const Profile = ({ navigation }: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({ mode: "onChange" });
  const colorScheme = useColorScheme();

  const onSubmit: any = (data: any) => {
    setItem("personalData", {
      name: data.name.toUpperCase(),
      iban: data.iban.toUpperCase(),
      bic: data.bic.toUpperCase(),
    });
    console.log("GUARDAR y NAVEGAR");
    navigation.goBack();
  };
  const [iban, setiban] = useState("");
  const [name, setName] = useState("");
  const [bic, setBic] = useState("");

  useEffect(() => {
    const fnct = async () => {
      const personalData: PersonalData = await getItem("personalData");
      if (personalData != null) {
        if (personalData.name) {
          setName(personalData.name);
          setValue(NAME, personalData.name);
        }
        if (personalData.iban) {
          setiban(formatIbanWithSpaces(personalData.iban));
          setValue(IBAN, personalData.iban);
        }
        if (personalData.bic) {
          setBic(personalData.bic);
          setValue(BIC, personalData.bic);
        }
      } else {
        const copyText = await Clipboard.getString();
        if (IBAN_PATTERN.test(copyText)) {
          console.debug("TODO - Add copy text after ask with a modal");
        }
      }
    };

    fnct();
  }, []);

  const formatIbanWithSpaces = (iban: string): string => {
    if (!iban.length) {
      console.error("Empty iban");
      return;
    }
    iban = iban.replace(/\s/g, "");
    let ibanAux = "";
    iban.split("").map((char: string, idx: number) => {
      if (idx != 0 && idx % 4 === 0) {
        ibanAux += " ";
      }
      ibanAux += char;
    });

    return ibanAux;
  };

  const removeData = () => {
    setName("");
    setValue(NAME, "");
    setiban("");
    setValue(IBAN, "");
    setBic("");
    setValue(BIC, "");
    removeItem("personalData");
  };

  const scanCard = () => {
    console.log("TODO");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <Text style={styles.title}>{i18n.t("personalData")}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.form}>
        <Input
          label={i18n.t("name").toUpperCase()}
          {...register(NAME, {
            required: { value: true, message: i18n.t("mandatory") },
          })}
          defaultValue={name}
          inputStyle={styles.inputBig}
          error={errors.name}
          onChangeText={(value: string) => {
            setValue(NAME, value);
            if (value.length) {
              clearErrors(NAME);
            }
          }}
        ></Input>

        <Input
          label={i18n.t("iban").toUpperCase()}
          {...register(IBAN, {
            required: { value: true, message: i18n.t("mandatory") },
            pattern: {
              value: IBAN_PATTERN,
              message: i18n.t("incorrectFormat"),
            },
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
        ></Input>

        <Input
          label={i18n.t("bic").toUpperCase()}
          {...register(BIC, {
            required: { value: true, message: i18n.t("mandatory") },
          })}
          defaultValue={bic}
          inputStyle={styles.inputBig}
          error={errors.bic}
          onChangeText={(value: string) => {
            setValue(BIC, value.toUpperCase());
            if (value.length) {
              clearErrors(BIC);
            }
          }}
        ></Input>
      </View>
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity
          onPress={scanCard}
          style={[styles.button, styles.buttonScan]}
        >
          <MaterialIcons
            size={25}
            name="credit-card"
            style={{ color: "white" }}
          ></MaterialIcons>
          <Text style={styles.buttonText}>{i18n.t("scan")}</Text>
        </TouchableOpacity> */}

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={removeData}
            style={[
              styles.button,
              {
                backgroundColor: colorScheme === "dark" ? "#CC0000" : "#FF0000",
              },
            ]}
          >
            <MaterialIcons
              size={25}
              name="delete-forever"
              style={{ color: "white" }}
            ></MaterialIcons>
            <Text style={styles.buttonText}>{i18n.t("delete")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={[
              styles.button,
              {
                backgroundColor: colorScheme === "dark" ? "#009900" : "#00CC00",
              },
            ]}
          >
            <Feather size={25} name="save" style={{ color: "white" }}></Feather>
            <Text style={styles.buttonText}>{i18n.t("save")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 30,
  },
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  form: {
    width: "80%",
  },
  inputBig: {
    width: "100%",
  },
  ibanContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 8,
  },
  ibanSeparator: {
    marginHorizontal: 10,
    textAlignVertical: "center",
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    minWidth: 120,
    borderRadius: 100,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 15,
  },
  buttonScan: {
    backgroundColor: "grey",
    flexDirection: "row",
    justifyContent: "center",
    width: 270,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  buttonGroup: {
    flex: 1,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    marginTop: 40,
    alignSelf: "stretch",
  },
});
