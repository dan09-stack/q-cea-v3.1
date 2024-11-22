import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full ">
          <Image
            source={images.building}
            className="w-full h-[250px] mb-8"
            resizeMode="cover"
          />

          <View className="bg-white w-full h-3/4 max-w-[400px] p-6 rounded-3xl shadow-lg">
            <Text className="text-5xl text-center font-bold text-primary my-6">
              Welcome to Q-CEA APP
            </Text>

            <View className="mt-10 space-y-4 flex flex-col justify-center items-center">
              <CustomButton
                title="Student"
                handlePress={() => router.push("/(studentAuth)/sign-in")}
                containerStyles="bg-green-800 "
                textStyles="text-white text-lg"
              />
              <CustomButton
                title="Faculty"
                className="bg-green-800 w-full"
                handlePress={() => router.push("/(facultyAuth)/sign-in")}
                containerStyles="bg-green-800 "
                textStyles="text-white text-lg"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
