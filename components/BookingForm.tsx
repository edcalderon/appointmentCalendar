import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  ChevronRight,
  CreditCard,
  Mail,
  Phone,
  User,
} from "lucide-react-native";

type BookingFormProps = {
  selectedService?: {
    id: string;
    name: string;
    duration: string;
    price: number | null;
    description: string;
  };
  selectedDateTime?: {
    date: string;
    time: string;
  };
  onSubmit?: (formData: any) => void;
  onBack?: () => void;
};

const BookingForm = ({
  selectedService = {
    id: "1",
    name: "Consultation",
    duration: "30 min",
    price: 0,
    description: "Initial consultation to discuss your needs",
  },
  selectedDateTime = {
    date: "2023-06-15",
    time: "10:00 AM",
  },
  onSubmit = () => {},
  onBack = () => {},
}: BookingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3); // Move to confirmation step
      onSubmit(formData);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderPersonalInfoStep = () => (
    <View className="space-y-4">
      <Text className="text-xl font-bold mb-4">Personal Information</Text>

      <View className="space-y-2">
        <Text className="text-sm font-medium">First Name</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
          <User size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData("firstName", text)}
          />
        </View>
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">Last Name</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
          <User size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData("lastName", text)}
          />
        </View>
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">Email</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
          <Mail size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => updateFormData("email", text)}
          />
        </View>
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">Phone</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
          <Phone size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => updateFormData("phone", text)}
          />
        </View>
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">Additional Notes (Optional)</Text>
        <View className="border border-gray-300 rounded-lg p-3 bg-white">
          <TextInput
            className="h-20"
            placeholder="Any special requests or information"
            multiline
            textAlignVertical="top"
            value={formData.notes}
            onChangeText={(text) => updateFormData("notes", text)}
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-3 px-4 rounded-lg mt-4"
        onPress={() =>
          selectedService.price ? setCurrentStep(2) : handleSubmit()
        }
      >
        <Text className="text-white text-center font-medium">
          {selectedService.price ? "Proceed to Payment" : "Confirm Booking"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3 px-4 rounded-lg border border-gray-300 mt-2"
        onPress={onBack}
      >
        <Text className="text-center font-medium">Back to Time Selection</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentStep = () => (
    <View className="space-y-4">
      <Text className="text-xl font-bold mb-4">Payment Information</Text>

      <View className="bg-gray-100 p-4 rounded-lg mb-4">
        <Text className="font-medium">Booking Summary</Text>
        <Text className="text-gray-600 mt-1">
          {selectedService.name} ({selectedService.duration})
        </Text>
        <Text className="text-gray-600">
          {formatDate(selectedDateTime.date)} at {selectedDateTime.time}
        </Text>
        <Text className="font-bold mt-2">
          ${selectedService.price?.toFixed(2)}
        </Text>
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">Card Number</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
          <CreditCard size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="1234 5678 9012 3456"
            keyboardType="number-pad"
            maxLength={19}
            value={formData.cardNumber}
            onChangeText={(text) => updateFormData("cardNumber", text)}
          />
        </View>
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-1 space-y-2">
          <Text className="text-sm font-medium">Expiry Date</Text>
          <View className="border border-gray-300 rounded-lg p-3 bg-white">
            <TextInput
              placeholder="MM/YY"
              keyboardType="number-pad"
              maxLength={5}
              value={formData.cardExpiry}
              onChangeText={(text) => updateFormData("cardExpiry", text)}
            />
          </View>
        </View>

        <View className="flex-1 space-y-2">
          <Text className="text-sm font-medium">CVC</Text>
          <View className="border border-gray-300 rounded-lg p-3 bg-white">
            <TextInput
              placeholder="123"
              keyboardType="number-pad"
              maxLength={3}
              secureTextEntry
              value={formData.cardCvc}
              onChangeText={(text) => updateFormData("cardCvc", text)}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-3 px-4 rounded-lg mt-4"
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-medium">
            Pay ${selectedService.price?.toFixed(2)} & Confirm
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3 px-4 rounded-lg border border-gray-300 mt-2"
        onPress={() => setCurrentStep(1)}
        disabled={isLoading}
      >
        <Text className="text-center font-medium">Back to Personal Info</Text>
      </TouchableOpacity>
    </View>
  );

  const renderConfirmationStep = () => (
    <View className="items-center justify-center py-8">
      <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
        <Text className="text-green-500 text-2xl">✓</Text>
      </View>
      <Text className="text-xl font-bold text-center">Booking Confirmed!</Text>
      <Text className="text-gray-600 text-center mt-2 mb-6">
        Your appointment has been successfully booked. A confirmation email has
        been sent to {formData.email}.
      </Text>

      <View className="bg-gray-100 p-4 rounded-lg w-full">
        <Text className="font-medium">Appointment Details</Text>
        <View className="mt-2 space-y-1">
          <Text className="text-gray-600">Service: {selectedService.name}</Text>
          <Text className="text-gray-600">
            Date: {formatDate(selectedDateTime.date)}
          </Text>
          <Text className="text-gray-600">Time: {selectedDateTime.time}</Text>
          <Text className="text-gray-600">
            Duration: {selectedService.duration}
          </Text>
          {selectedService.price ? (
            <Text className="text-gray-600">
              Price: ${selectedService.price.toFixed(2)}
            </Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-3 px-4 rounded-lg mt-6 w-full"
        onPress={() => {
          // Reset form and go back to service selection
          setCurrentStep(1);
          onBack();
        }}
      >
        <Text className="text-white text-center font-medium">
          Return to Home
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView className="bg-gray-50 p-4">
      <View className="bg-white rounded-xl p-5 shadow-sm">
        {/* Progress indicator */}
        {currentStep < 3 && (
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <View
                className={`h-2 rounded-full ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-200"}`}
              />
            </View>
            <View className="w-4" />
            <View className="flex-1">
              <View
                className={`h-2 rounded-full ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"}`}
              />
            </View>
          </View>
        )}

        {/* Form steps */}
        {currentStep === 1 && renderPersonalInfoStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderConfirmationStep()}
      </View>
    </ScrollView>
  );
};

export default BookingForm;
