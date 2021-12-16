import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key: string, value: any) => {
  try {
    if (typeof value === "object") {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (e) {
    console.error("Error SET key into storage", key, JSON.stringify(e));
  }
};

export const getItem = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error GET key into storage", key, JSON.stringify(e));
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error remove key from storage", key, JSON.stringify(e));
    return null;
  }
};
