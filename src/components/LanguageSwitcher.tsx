import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLingui } from "@lingui/react";
import { activateLocale } from "../i18n";

const LanguageSwitcher = () => {
  const { i18n } = useLingui();
  const currentLocale = i18n.locale;

  const switchLanguage = async (locale: string) => {
    await activateLocale(locale);
  };

  return (
    <View className="flex-row justify-center space-x-2 p-4">
      <TouchableOpacity
        className={`px-4 py-2 rounded-lg ${
          currentLocale === "en" ? "bg-blue-500" : "bg-gray-200"
        }`}
        onPress={() => switchLanguage("en")}
      >
        <Text
          className={`${
            currentLocale === "en" ? "text-white" : "text-gray-700"
          }`}
        >
          English
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`px-4 py-2 rounded-lg ${
          currentLocale === "es" ? "bg-blue-500" : "bg-gray-200"
        }`}
        onPress={() => switchLanguage("es")}
      >
        <Text
          className={`${
            currentLocale === "es" ? "text-white" : "text-gray-700"
          }`}
        >
          Español
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSwitcher;
