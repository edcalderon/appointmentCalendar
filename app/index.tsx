import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { Stack } from "expo-router";
import ServiceSelection from "../components/ServiceSelection";
import AppointmentCalendar from "../components/AppointmentCalendar";
import BookingForm from "../components/BookingForm";

// Mock data for services
const mockServices = [
  {
    id: "1",
    name: "Initial Consultation",
    duration: "30 min",
    price: 0,
    description: "Free introductory meeting to discuss your needs",
    type: "free",
  },
  {
    id: "2",
    name: "Standard Session",
    duration: "60 min",
    price: 75,
    description: "Regular appointment session",
    type: "paid",
  },
  {
    id: "3",
    name: "Extended Session",
    duration: "90 min",
    price: 120,
    description: "In-depth consultation for complex issues",
    type: "paid",
  },
  {
    id: "4",
    name: "Quick Follow-up",
    duration: "15 min",
    price: 0,
    description: "Brief check-in after previous appointment",
    type: "free",
  },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentStep(3);
  };

  const handleBookingComplete = () => {
    // Reset the booking flow
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedTimeSlot(null);
    // Show success message or navigate to confirmation page
    alert("Booking successful! Check your email for confirmation.");
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: "Book Appointment",
          headerShown: true,
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-6 text-center">
            Book Your Appointment
          </Text>

          {/* Progress indicator */}
          <View className="flex-row justify-between mb-8">
            <View className="items-center">
              <View
                className={`w-8 h-8 rounded-full ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-300"} items-center justify-center`}
              >
                <Text className="text-white font-bold">1</Text>
              </View>
              <Text className="text-xs mt-1">Select Service</Text>
            </View>
            <View className="flex-1 h-1 self-center mx-1 bg-gray-300">
              <View
                className={`h-full ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"}`}
                style={{ width: "100%" }}
              />
            </View>
            <View className="items-center">
              <View
                className={`w-8 h-8 rounded-full ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"} items-center justify-center`}
              >
                <Text className="text-white font-bold">2</Text>
              </View>
              <Text className="text-xs mt-1">Choose Time</Text>
            </View>
            <View className="flex-1 h-1 self-center mx-1 bg-gray-300">
              <View
                className={`h-full ${currentStep >= 3 ? "bg-blue-500" : "bg-gray-300"}`}
                style={{ width: "100%" }}
              />
            </View>
            <View className="items-center">
              <View
                className={`w-8 h-8 rounded-full ${currentStep >= 3 ? "bg-blue-500" : "bg-gray-300"} items-center justify-center`}
              >
                <Text className="text-white font-bold">3</Text>
              </View>
              <Text className="text-xs mt-1">Your Details</Text>
            </View>
          </View>

          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <ServiceSelection
              services={mockServices}
              onSelectService={handleServiceSelect}
            />
          )}

          {/* Step 2: Appointment Calendar */}
          {currentStep === 2 && (
            <View>
              <Text className="text-lg font-semibold mb-4">
                Selected Service: {selectedService?.name} (
                {selectedService?.duration})
              </Text>
              <AppointmentCalendar
                serviceId={selectedService?.id}
                onSelectTimeSlot={handleTimeSlotSelect}
                onBack={handleBack}
              />
            </View>
          )}

          {/* Step 3: Booking Form */}
          {currentStep === 3 && (
            <View>
              <Text className="text-lg font-semibold mb-2">
                Selected Service: {selectedService?.name} (
                {selectedService?.duration})
              </Text>
              <Text className="text-md mb-4">
                Selected Time: {selectedTimeSlot?.date} at{" "}
                {selectedTimeSlot?.time}
              </Text>
              <BookingForm
                service={selectedService}
                timeSlot={selectedTimeSlot}
                onComplete={handleBookingComplete}
                onBack={handleBack}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
