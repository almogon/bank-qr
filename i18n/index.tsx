import * as Localisation from "expo-localization";
import i18n from "i18n-js";
import en from "./locales/en";
import es from "./locales/es";
import de from "./locales/de";

i18n.translations = {
  en,
  de,
  es,
};

i18n.locale = Localisation.locale;
i18n.fallbacks = true;
i18n.defaultLocale = "de";

export default i18n;
