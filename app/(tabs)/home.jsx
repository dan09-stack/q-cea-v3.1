import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import useAppwrite from "../../lib/useAppwrite";
import {
  getTicketNumber,
  incrementTicketNumber,
  updateUserFacultyAndConcerns,
} from "../../lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [otherConcern, setOtherConcern] = useState("");
  const [isRequested, setIsRequested] = useState(false);
  const [persistentView, setPersistentView] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [userTicketNum, setUserTicketNum] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const faculties = [
    "Faculty A",
    "Faculty B",
    "Faculty C",
    "Faculty D",
    "Faculty E",
    "Faculty F",
  ];
  const concerns = [
    "Concern 1",
    "Concern 2",
    "Concern 3",
    "Concern 4",
    "Concern 5",
  ];
  useEffect(() => {
    loadSavedState();
  }, []);

  const loadSavedState = async () => {
    try {
      const savedTicket = await AsyncStorage.getItem("userTicket");
      const savedView = await AsyncStorage.getItem("persistentView");
      if (savedTicket) {
        setUserTicketNum(JSON.parse(savedTicket));
      }
      if (savedView) {
        setPersistentView(JSON.parse(savedView));
        setIsRequested(JSON.parse(savedView));
      }
    } catch (error) {
      console.log("Error loading saved state:", error);
    }
  };

  const handleRequest = async () => {
    // Validate required selections
    if (!selectedFaculty || !selectedConcern) {
      alert("Please select both Faculty and Concern before proceeding");
      return;
    }
    setIsLoading(true);
    const newNumber = currentNumber + 1;
    await incrementTicketNumber(newNumber);
    setUserTicketNum(newNumber);
    setIsRequested(true);

    // Save state to AsyncStorage
    try {
      const response = await updateUserFacultyAndConcerns(
        selectedFaculty, // Your selected faculty value
        selectedConcern, // Your selected concern value
        otherConcern // Your other concern text
      );
      await AsyncStorage.setItem("userTicket", JSON.stringify(newNumber));
      await AsyncStorage.setItem("persistentView", JSON.stringify(true));
    } catch (error) {
      console.log("Error saving state:", error);
    } finally {
      setIsLoading(false);
    }

    refetch();
  };

  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancel = async (confirm) => {
    if (confirm) {
      setIsRequested(false);
      // Clear saved state
      try {
        await AsyncStorage.removeItem("userTicket");
        await AsyncStorage.removeItem("persistentView");
      } catch (error) {
        console.log("Error clearing saved state:", error);
      }
    }
    setShowCancelConfirmation(false);
  };

  //getting data
  const { data: ticket, refetch } = useAppwrite(getTicketNumber);
  const [currentNumber, setCurrentNumber] = useState(null);

  useEffect(() => {
    if (ticket && ticket.length > 0) {
      setCurrentNumber(ticket[0].firstTable);
    }
  }, [ticket]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000); // Refreshes every .5 second

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Progress Stepper */}
      <View className="flex-row items-center justify-center py-5">
        <View className="items-center">
          <View className="w-4 h-4 rounded-full bg-white" />
          <Text className="text-white text-xs text-center mt-1">
            Create your
          </Text>
          <Text className="text-white text-xs text-center ">virtual queue</Text>
        </View>
        <View className="w-8 h-0.5 bg-white mx-1.5" />
        <View className="items-center">
          <View className="w-4 h-4 rounded-full bg-white" />
          <Text className="text-white text-xs text-center mt-1">
            Relax and wait
          </Text>
          <Text className="text-white text-xs text-center mt-1">
            for your turn
          </Text>
        </View>
        <View className="w-8 h-0.5 bg-white mx-1.5" />
        <View className="items-center">
          <View className="w-4 h-4 rounded-full bg-white" />
          <Text className="text-white text-xs text-center mt-1">
            Your turn is up!
          </Text>
          <Text></Text>
        </View>
      </View>
      {/* Current Number */}
      <View className="flex-row justify-between items-center px-4 py-6">
        <Text className="font-psemibold text-2xl text-white">
          Current Number:
        </Text>
        <Text className="font-psemibold text-2xl text-white">
          {currentNumber}
        </Text>
      </View>
      {/*User Number */}
      <View className="flex-row justify-between items-center px-4 py-6">
        <Text className="font-psemibold text-2xl text-white">User Number:</Text>
        <Text className="font-psemibold text-2xl text-white">
          {" "}
          {userTicketNum || "-"}
        </Text>
      </View>
      {/* Main Card */}
      <View className="flex-1 items-center justify-center position-absolute bottom-0 w-full">
        {showCancelConfirmation ? (
          <View className="bg-gray-200 p-5 rounded-lg shadow-lg w-3/4 items-center">
            <Text className="text-center text-lg font-bold mb-5">
              You want to Cancel?
            </Text>
            <View className="flex-row justify-between w-full px-10">
              <TouchableOpacity
                className="bg-green-800 py-2 px-4 rounded"
                onPress={() => confirmCancel(false)}
              >
                <Text className="text-white font-bold">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-500 py-2 px-4 rounded"
                onPress={() => confirmCancel(true)}
              >
                <Text className="text-white font-bold">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isRequested ? (
          <View className="bg-gray-200 p-5 rounded-lg shadow-lg w-3/4">
            <Text className="text-center text-sm font-bold mb-2">
              Thank You For Waiting
            </Text>
            <Text className="text-center text-xs mb-4">
              People in front of you: 2
            </Text>
            <Text className="text-center text-lg font-bold mb-2">
              YOUR TICKET NUMBER
            </Text>
            <Text className="text-center text-2xl font-bold mb-4">
              {`CPE-${userTicketNum?.toString().padStart(4, "0")}`}
            </Text>
            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <Text className="text-sm">NEXT SERVING</Text>
                <Text className="text-xl font-bold">ECE-0009</Text>
              </View>
              <View className="items-center">
                <Text className="text-sm">NOW SERVING</Text>
                <Text className="text-xl font-bold">ARC-0008</Text>
              </View>
            </View>
            <Text className="text-center text-xl font-bold mb-4">
              PLEASE WAIT
            </Text>
            <TouchableOpacity
              className="bg-green-800 py-3 rounded items-center"
              onPress={handleCancel}
            >
              <Text className="text-white font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-gray-200 p-5 rounded-lg shadow-lg w-3/4">
            {/* Faculty Dropdown */}
            <Picker
              selectedValue={selectedFaculty}
              onValueChange={(itemValue) => setSelectedFaculty(itemValue)}
            >
              <Picker.Item label="Select Faculty" value={null} />
              {faculties.map((faculty, index) => (
                <Picker.Item key={index} label={faculty} value={faculty} />
              ))}
            </Picker>

            {/* Concern Dropdown */}
            <Picker
              selectedValue={selectedConcern}
              onValueChange={(itemValue) => setSelectedConcern(itemValue)}
              className="bg-green-800 text-white mb-4 rounded"
            >
              <Picker.Item label="Select your concern" value={null} />
              {concerns.map((concern, index) => (
                <Picker.Item key={index} label={concern} value={concern} />
              ))}
            </Picker>

            {/* Text input for other concerns */}
            <TextInput
              className="bg-white p-3 rounded mb-5"
              placeholder="Other:"
              value={otherConcern}
              onChangeText={setOtherConcern}
            />

            {/* Request Button */}
            <TouchableOpacity
              className="bg-green-800 py-3 rounded items-center"
              onPress={handleRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold">Request</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
