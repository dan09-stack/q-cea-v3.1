import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import { CustomButton, FormField } from "../../../components";

import { createUser } from "../../../lib/appwrite";
import { useGlobalContext } from "../../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    idNumber: "",
    course: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (Object.values(form).some((value) => value === "")) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createUser(
        form.email,
        form.password,
        form.username,
        form.idNumber,
        form.course,
        form.phoneNumber
      );
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2F4F2F" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Sign Up
          </Text>

          <FormField
            placeholder="Last Name, First Name MI."
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
          />
          <FormField
            placeholder="ID Number"
            value={form.idNumber}
            handleChangeText={(e) => setForm({ ...form, idNumber: e })}
            keyboardType="phone-pad"
          />
          <FormField
            placeholder="Select your course"
            value={form.course}
            handleChangeText={(e) => setForm({ ...form, course: e })}
          />
          <FormField
            placeholder="Phone Number"
            value={form.phoneNumber}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            keyboardType="phone-pad"
          />
          <FormField
            placeholder="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            placeholder="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
          />

          <CustomButton
            title="SIGN IN"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View className="text-center justify-center items-center flex-row">
            <Text>Already have an account? </Text>

            <Link href="/(studentAuth)/sign-in" className="text-primary">
              <Text>Sign in</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
