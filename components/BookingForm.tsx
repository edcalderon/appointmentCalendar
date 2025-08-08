import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { Trans } from "@lingui/react/macro";
import {
  ChevronRight,
  CreditCard,
  Mail,
  Phone,
  User,
  AlertCircle,
  ChevronDown,
  Search,
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

// Country codes data
const countryCodes = [
  { code: "+1", country: "US", name: "United States" },
  { code: "+1", country: "CA", name: "Canada" },
  { code: "+44", country: "GB", name: "United Kingdom" },
  { code: "+33", country: "FR", name: "France" },
  { code: "+49", country: "DE", name: "Germany" },
  { code: "+39", country: "IT", name: "Italy" },
  { code: "+34", country: "ES", name: "Spain" },
  { code: "+31", country: "NL", name: "Netherlands" },
  { code: "+32", country: "BE", name: "Belgium" },
  { code: "+41", country: "CH", name: "Switzerland" },
  { code: "+43", country: "AT", name: "Austria" },
  { code: "+45", country: "DK", name: "Denmark" },
  { code: "+46", country: "SE", name: "Sweden" },
  { code: "+47", country: "NO", name: "Norway" },
  { code: "+358", country: "FI", name: "Finland" },
  { code: "+351", country: "PT", name: "Portugal" },
  { code: "+30", country: "GR", name: "Greece" },
  { code: "+48", country: "PL", name: "Poland" },
  { code: "+420", country: "CZ", name: "Czech Republic" },
  { code: "+36", country: "HU", name: "Hungary" },
  { code: "+7", country: "RU", name: "Russia" },
  { code: "+86", country: "CN", name: "China" },
  { code: "+81", country: "JP", name: "Japan" },
  { code: "+82", country: "KR", name: "South Korea" },
  { code: "+91", country: "IN", name: "India" },
  { code: "+61", country: "AU", name: "Australia" },
  { code: "+64", country: "NZ", name: "New Zealand" },
  { code: "+55", country: "BR", name: "Brazil" },
  { code: "+52", country: "MX", name: "Mexico" },
  { code: "+54", country: "AR", name: "Argentina" },
  { code: "+56", country: "CL", name: "Chile" },
  { code: "+57", country: "CO", name: "Colombia" },
  { code: "+51", country: "PE", name: "Peru" },
  { code: "+58", country: "VE", name: "Venezuela" },
  { code: "+27", country: "ZA", name: "South Africa" },
  { code: "+20", country: "EG", name: "Egypt" },
  { code: "+234", country: "NG", name: "Nigeria" },
  { code: "+254", country: "KE", name: "Kenya" },
  { code: "+971", country: "AE", name: "UAE" },
  { code: "+966", country: "SA", name: "Saudi Arabia" },
  { code: "+972", country: "IL", name: "Israel" },
  { code: "+90", country: "TR", name: "Turkey" },
  { code: "+98", country: "IR", name: "Iran" },
  { code: "+92", country: "PK", name: "Pakistan" },
  { code: "+880", country: "BD", name: "Bangladesh" },
  { code: "+94", country: "LK", name: "Sri Lanka" },
  { code: "+60", country: "MY", name: "Malaysia" },
  { code: "+65", country: "SG", name: "Singapore" },
  { code: "+66", country: "TH", name: "Thailand" },
  { code: "+84", country: "VN", name: "Vietnam" },
  { code: "+63", country: "PH", name: "Philippines" },
  { code: "+62", country: "ID", name: "Indonesia" },
];

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
    countryCode: "+1",
    notes: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    // Check if it has at least 7 digits (minimum for most countries)
    const digitCount = cleanPhone.replace(/[^\d]/g, "").length;
    return digitCount >= 7 && digitCount <= 15;
  };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    };

    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(formData.countryCode + formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Validate payment fields if it's a paid service
    if (selectedService.price && selectedService.price > 0) {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
        isValid = false;
      } else if (formData.cardNumber.replace(/\s/g, "").length < 13) {
        newErrors.cardNumber = "Please enter a valid card number";
        isValid = false;
      }

      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = "Expiry date is required";
        isValid = false;
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "Please enter MM/YY format";
        isValid = false;
      }

      if (!formData.cardCvc.trim()) {
        newErrors.cardCvc = "CVC is required";
        isValid = false;
      } else if (formData.cardCvc.length < 3) {
        newErrors.cardCvc = "Please enter a valid CVC";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call with random success/failure
    setTimeout(() => {
      setIsLoading(false);
      const random = Math.random();
      if (random > 0.8) {
        // 20% chance of failure
        setCurrentStep(4); // Error step
      } else {
        setCurrentStep(3); // Success step
      }
      onSubmit({ ...formData, status: random > 0.8 ? "error" : "success" });
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
      <Text className="text-xl font-bold mb-4">
        <Trans>Personal Information</Trans>
      </Text>

      <View className="space-y-2">
        <Text className="text-sm font-medium">
          <Trans>First Name</Trans>
        </Text>
        <View
          className={`flex-row items-center border rounded-lg p-3 bg-white ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
        >
          <User size={20} color={errors.firstName ? "#ef4444" : "#6b7280"} />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData("firstName", text)}
          />
        </View>
        {errors.firstName ? (
          <View className="flex-row items-center mt-1">
            <AlertCircle size={16} color="#ef4444" />
            <Text className="text-red-500 text-sm ml-1">
              {errors.firstName}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">
          <Trans>Last Name</Trans>
        </Text>
        <View
          className={`flex-row items-center border rounded-lg p-3 bg-white ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
        >
          <User size={20} color={errors.lastName ? "#ef4444" : "#6b7280"} />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData("lastName", text)}
          />
        </View>
        {errors.lastName ? (
          <View className="flex-row items-center mt-1">
            <AlertCircle size={16} color="#ef4444" />
            <Text className="text-red-500 text-sm ml-1">{errors.lastName}</Text>
          </View>
        ) : null}
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">
          <Trans>Email</Trans>
        </Text>
        <View
          className={`flex-row items-center border rounded-lg p-3 bg-white ${errors.email ? "border-red-500" : "border-gray-300"}`}
        >
          <Mail size={20} color={errors.email ? "#ef4444" : "#6b7280"} />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateFormData("email", text)}
          />
        </View>
        {errors.email ? (
          <View className="flex-row items-center mt-1">
            <AlertCircle size={16} color="#ef4444" />
            <Text className="text-red-500 text-sm ml-1">{errors.email}</Text>
          </View>
        ) : null}
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">
          <Trans>Phone</Trans>
        </Text>
        <View
          className={`flex-row items-center border rounded-lg bg-white ${errors.phone ? "border-red-500" : "border-gray-300"}`}
        >
          <TouchableOpacity
            className="flex-row items-center px-3 py-3 border-r border-gray-300"
            onPress={() => setShowCountryPicker(true)}
          >
            <Text className="text-gray-700 mr-1">{formData.countryCode}</Text>
            <ChevronDown size={16} color="#6b7280" />
          </TouchableOpacity>
          <Phone
            size={20}
            color={errors.phone ? "#ef4444" : "#6b7280"}
            className="ml-3"
          />
          <TextInput
            className="flex-1 ml-2 mr-3"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => updateFormData("phone", text)}
          />
        </View>
        {errors.phone ? (
          <View className="flex-row items-center mt-1">
            <AlertCircle size={16} color="#ef4444" />
            <Text className="text-red-500 text-sm ml-1">{errors.phone}</Text>
          </View>
        ) : null}
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium">
          <Trans>Additional Notes (Optional)</Trans>
        </Text>
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
        onPress={() => {
          if (selectedService.price && selectedService.price > 0) {
            if (validateForm()) {
              setCurrentStep(2);
            }
          } else {
            handleSubmit();
          }
        }}
      >
        <Text className="text-white text-center font-medium">
          {selectedService.price && selectedService.price > 0 ? (
            <Trans>Proceed to Payment</Trans>
          ) : (
            <Trans>Confirm Booking</Trans>
          )}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3 px-4 rounded-lg border border-gray-300 mt-2"
        onPress={onBack}
      >
        <Text className="text-center font-medium">
          <Trans>Back to Time Selection</Trans>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentStep = () => (
    <View className="space-y-4">
      <Text className="text-xl font-bold mb-4">
        <Trans>Payment Information</Trans>
      </Text>

      <View className="bg-gray-100 p-4 rounded-lg mb-4">
        <Text className="font-medium">
          <Trans>Booking Summary</Trans>
        </Text>
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
        <Text className="text-sm font-medium">
          <Trans>Card Number</Trans>
        </Text>
        <View
          className={`flex-row items-center border rounded-lg p-3 bg-white ${errors.cardNumber ? "border-red-500" : "border-gray-300"}`}
        >
          <CreditCard
            size={20}
            color={errors.cardNumber ? "#ef4444" : "#6b7280"}
          />
          <TextInput
            className="flex-1 ml-2"
            placeholder="1234 5678 9012 3456"
            keyboardType="number-pad"
            maxLength={19}
            value={formData.cardNumber}
            onChangeText={(text) => updateFormData("cardNumber", text)}
          />
        </View>
        {errors.cardNumber ? (
          <View className="flex-row items-center mt-1">
            <AlertCircle size={16} color="#ef4444" />
            <Text className="text-red-500 text-sm ml-1">
              {errors.cardNumber}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-1 space-y-2">
          <Text className="text-sm font-medium">
            <Trans>Expiry Date</Trans>
          </Text>
          <View
            className={`border rounded-lg p-3 bg-white ${errors.cardExpiry ? "border-red-500" : "border-gray-300"}`}
          >
            <TextInput
              placeholder="MM/YY"
              keyboardType="number-pad"
              maxLength={5}
              value={formData.cardExpiry}
              onChangeText={(text) => updateFormData("cardExpiry", text)}
            />
          </View>
          {errors.cardExpiry ? (
            <View className="flex-row items-center mt-1">
              <AlertCircle size={12} color="#ef4444" />
              <Text className="text-red-500 text-xs ml-1">
                {errors.cardExpiry}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="flex-1 space-y-2">
          <Text className="text-sm font-medium">
            <Trans>CVC</Trans>
          </Text>
          <View
            className={`border rounded-lg p-3 bg-white ${errors.cardCvc ? "border-red-500" : "border-gray-300"}`}
          >
            <TextInput
              placeholder="123"
              keyboardType="number-pad"
              maxLength={3}
              secureTextEntry
              value={formData.cardCvc}
              onChangeText={(text) => updateFormData("cardCvc", text)}
            />
          </View>
          {errors.cardCvc ? (
            <View className="flex-row items-center mt-1">
              <AlertCircle size={12} color="#ef4444" />
              <Text className="text-red-500 text-xs ml-1">
                {errors.cardCvc}
              </Text>
            </View>
          ) : null}
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
            <Trans>Pay</Trans> ${selectedService.price?.toFixed(2)}{" "}
            <Trans>& Confirm</Trans>
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3 px-4 rounded-lg border border-gray-300 mt-2"
        onPress={() => setCurrentStep(1)}
        disabled={isLoading}
      >
        <Text className="text-center font-medium">
          <Trans>Back to Personal Info</Trans>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderConfirmationStep = () => (
    <View className="items-center justify-center py-8">
      <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
        <Text className="text-green-500 text-3xl font-bold">✓</Text>
      </View>
      <Text className="text-2xl font-bold text-center text-green-600 mb-2">
        <Trans>Booking Confirmed!</Trans>
      </Text>
      <Text className="text-gray-600 text-center mb-6 px-4">
        <Trans>
          Your appointment has been successfully booked. A confirmation email
          with all details has been sent to
        </Trans>{" "}
        {formData.email}.
      </Text>

      <View className="bg-green-50 border border-green-200 p-4 rounded-lg w-full mb-4">
        <Text className="font-bold text-green-800 mb-3">
          <Trans>Appointment Details</Trans>
        </Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">
              <Trans>Service:</Trans>
            </Text>
            <Text className="font-medium">{selectedService.name}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">
              <Trans>Date:</Trans>
            </Text>
            <Text className="font-medium">
              {formatDate(selectedDateTime.date)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">
              <Trans>Time:</Trans>
            </Text>
            <Text className="font-medium">{selectedDateTime.time}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">
              <Trans>Duration:</Trans>
            </Text>
            <Text className="font-medium">{selectedService.duration}</Text>
          </View>
          {selectedService.price ? (
            <View className="flex-row justify-between border-t border-green-200 pt-2 mt-2">
              <Text className="text-gray-600 font-medium">
                <Trans>Total Paid:</Trans>
              </Text>
              <Text className="font-bold text-green-600">
                ${selectedService.price.toFixed(2)}
              </Text>
            </View>
          ) : (
            <View className="flex-row justify-between border-t border-green-200 pt-2 mt-2">
              <Text className="text-gray-600 font-medium">
                <Trans>Price:</Trans>
              </Text>
              <Text className="font-bold text-green-600">Free</Text>
            </View>
          )}
        </View>
      </View>

      <View className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full mb-6">
        <Text className="font-medium text-blue-800 mb-2">
          <Trans>What's Next?</Trans>
        </Text>
        <Text className="text-blue-700 text-sm mb-2">
          • <Trans>You'll receive a calendar invite shortly</Trans>
        </Text>
        <Text className="text-blue-700 text-sm mb-2">
          •{" "}
          <Trans>We'll send a reminder 24 hours before your appointment</Trans>
        </Text>
        <Text className="text-blue-700 text-sm">
          •{" "}
          <Trans>
            Need to reschedule? Contact us at least 24 hours in advance
          </Trans>
        </Text>
      </View>

      <View className="flex-row space-x-3 w-full">
        <TouchableOpacity
          className="flex-1 bg-blue-600 py-3 px-4 rounded-lg"
          onPress={() => {
            setCurrentStep(1);
            onBack();
          }}
        >
          <Text className="text-white text-center font-medium">
            <Trans>Book Another</Trans>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-gray-600 py-3 px-4 rounded-lg"
          onPress={() => {
            setCurrentStep(1);
            onBack();
          }}
        >
          <Text className="text-white text-center font-medium">
            <Trans>Return Home</Trans>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderErrorStep = () => (
    <View className="items-center justify-center py-8">
      <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-6">
        <Text className="text-red-500 text-3xl font-bold">✕</Text>
      </View>
      <Text className="text-2xl font-bold text-center text-red-600 mb-2">
        <Trans>Booking Failed</Trans>
      </Text>
      <Text className="text-gray-600 text-center mb-6 px-4">
        <Trans>
          We're sorry, but there was an issue processing your booking. This
          could be due to a payment problem or a technical error.
        </Trans>
      </Text>

      <View className="bg-red-50 border border-red-200 p-4 rounded-lg w-full mb-4">
        <Text className="font-bold text-red-800 mb-3">
          <Trans>Attempted Booking</Trans>
        </Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Service:</Text>
            <Text className="font-medium">{selectedService.name}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Date:</Text>
            <Text className="font-medium">
              {formatDate(selectedDateTime.date)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Time:</Text>
            <Text className="font-medium">{selectedDateTime.time}</Text>
          </View>
        </View>
      </View>

      <View className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg w-full mb-6">
        <Text className="font-medium text-yellow-800 mb-2">
          <Trans>What You Can Do:</Trans>
        </Text>
        <Text className="text-yellow-700 text-sm mb-2">
          • <Trans>Check your payment method and try again</Trans>
        </Text>
        <Text className="text-yellow-700 text-sm mb-2">
          • <Trans>Try selecting a different time slot</Trans>
        </Text>
        <Text className="text-yellow-700 text-sm mb-2">
          • <Trans>Contact our support team for assistance</Trans>
        </Text>
        <Text className="text-yellow-700 text-sm">
          •{" "}
          <Trans>
            Your time slot is still available for the next 10 minutes
          </Trans>
        </Text>
      </View>

      <View className="flex-row space-x-3 w-full">
        <TouchableOpacity
          className="flex-1 bg-blue-600 py-3 px-4 rounded-lg"
          onPress={() => setCurrentStep(1)}
        >
          <Text className="text-white text-center font-medium">
            <Trans>Try Again</Trans>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-gray-600 py-3 px-4 rounded-lg"
          onPress={() => {
            setCurrentStep(1);
            onBack();
          }}
        >
          <Text className="text-white text-center font-medium">
            <Trans>Start Over</Trans>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-4 py-2 px-4"
        onPress={() => {
          // In a real app, this would open a support chat or email
          alert(
            "Support contact: support@bookingapp.com or call (555) 123-4567",
          );
        }}
      >
        <Text className="text-blue-600 text-center font-medium underline">
          <Trans>Contact Support</Trans>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.code.includes(countrySearchQuery),
  );

  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold">
            <Trans>Select Country</Trans>
          </Text>
          <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
            <Text className="text-blue-600 font-medium">
              <Trans>Done</Trans>
            </Text>
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
            <Search size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Search countries..."
              value={countrySearchQuery}
              onChangeText={setCountrySearchQuery}
            />
          </View>
        </View>

        <FlatList
          data={filteredCountries}
          keyExtractor={(item, index) =>
            `${item.code}-${item.country}-${index}`
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-gray-100"
              onPress={() => {
                updateFormData("countryCode", item.code);
                setShowCountryPicker(false);
                setCountrySearchQuery("");
              }}
            >
              <View>
                <Text className="font-medium">{item.name}</Text>
                <Text className="text-gray-500 text-sm">{item.code}</Text>
              </View>
              {formData.countryCode === item.code && (
                <Text className="text-blue-600 font-bold">✓</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
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
        {currentStep === 4 && renderErrorStep()}
      </View>
      {renderCountryPicker()}
    </ScrollView>
  );
};

export default BookingForm;
