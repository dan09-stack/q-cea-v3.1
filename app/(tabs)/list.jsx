import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { getTicketNumber } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const List = () => {
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
    }, 10); // Refreshes every .5 second

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row justify-between items-center px-4 py-6">
        <Text className="font-psemibold text-2xl text-white">
          Current Number:
        </Text>
        <Text className="font-psemibold text-2xl text-white">
          {currentNumber}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default List;
