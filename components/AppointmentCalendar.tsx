import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Calendar } from "expo-atlas";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react-native";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface AppointmentCalendarProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onTimeSlotSelect?: (timeSlot: TimeSlot) => void;
  availableDates?: Date[];
  timeSlots?: TimeSlot[];
  minDate?: Date;
  maxDate?: Date;
}

const AppointmentCalendar = ({
  selectedDate = new Date(),
  onDateChange = () => {},
  onTimeSlotSelect = () => {},
  availableDates = [],
  timeSlots = generateDefaultTimeSlots(),
  minDate = new Date(),
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3)),
}: AppointmentCalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null,
  );

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    onDateChange(date);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      setSelectedTimeSlot(timeSlot);
      onTimeSlotSelect(timeSlot);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-xl font-bold mb-4 text-center">
        Select Date & Time
      </Text>

      {/* Calendar Component */}
      <View className="mb-6">
        <Calendar
          selectedDate={currentDate}
          onSelectDate={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          markedDates={availableDates}
        />
      </View>

      {/* Selected Date Display */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          className="p-2"
          onPress={() => {
            const prevDay = new Date(currentDate);
            prevDay.setDate(prevDay.getDate() - 1);
            if (prevDay >= minDate) handleDateChange(prevDay);
          }}
        >
          <ChevronLeft size={24} color="#0284c7" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-center">
          {formatDate(currentDate)}
        </Text>

        <TouchableOpacity
          className="p-2"
          onPress={() => {
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);
            if (nextDay <= maxDate) handleDateChange(nextDay);
          }}
        >
          <ChevronRight size={24} color="#0284c7" />
        </TouchableOpacity>
      </View>

      {/* Time Slots */}
      <Text className="text-lg font-semibold mb-2">Available Time Slots</Text>
      <ScrollView className="max-h-48">
        <View className="flex-row flex-wrap justify-between">
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              className={`m-1 p-3 rounded-md flex-row items-center ${slot.available ? "bg-sky-100" : "bg-gray-100"} ${selectedTimeSlot?.id === slot.id ? "border-2 border-sky-500" : ""}`}
              onPress={() => handleTimeSlotSelect(slot)}
              disabled={!slot.available}
            >
              <Clock size={16} color={slot.available ? "#0284c7" : "#9ca3af"} />
              <Text
                className={`ml-2 ${slot.available ? "text-sky-700" : "text-gray-400"} ${selectedTimeSlot?.id === slot.id ? "font-bold" : ""}`}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="mt-4 flex-row justify-between">
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded-full bg-sky-100 mr-2" />
          <Text className="text-sm text-gray-600">Available</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded-full bg-gray-100 mr-2" />
          <Text className="text-sm text-gray-600">Unavailable</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded-full border-2 border-sky-500 mr-2" />
          <Text className="text-sm text-gray-600">Selected</Text>
        </View>
      </View>
    </View>
  );
};

// Helper function to generate default time slots
function generateDefaultTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    // Add :00 slot
    slots.push({
      id: `slot-${hour}-00`,
      time: `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`,
      available: Math.random() > 0.3, // Randomly make some slots unavailable
    });

    // Add :30 slot
    if (hour < endHour) {
      slots.push({
        id: `slot-${hour}-30`,
        time: `${hour % 12 === 0 ? 12 : hour % 12}:30 ${hour < 12 ? "AM" : "PM"}`,
        available: Math.random() > 0.3, // Randomly make some slots unavailable
      });
    }
  }

  return slots;
}

export default AppointmentCalendar;
