import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Trans } from "@lingui/react/macro";
import { Clock, DollarSign, Info } from "lucide-react-native";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number | null;
  type: "free" | "paid";
}

interface ServiceSelectionProps {
  onSelectService?: (service: Service) => void;
  services?: Service[];
}

export default function ServiceSelection({
  onSelectService = () => {},
  services = [
    {
      id: "1",
      name: "Initial Consultation",
      description: "A free 15-minute consultation to discuss your needs",
      duration: "15 min",
      price: null,
      type: "free",
    },
    {
      id: "2",
      name: "Standard Appointment",
      description: "Regular 30-minute appointment session",
      duration: "30 min",
      price: 50,
      type: "paid",
    },
    {
      id: "3",
      name: "Extended Session",
      description: "In-depth 60-minute appointment session",
      duration: "60 min",
      price: 90,
      type: "paid",
    },
    {
      id: "4",
      name: "Quick Follow-up",
      description: "Brief follow-up session for existing clients",
      duration: "15 min",
      price: null,
      type: "free",
    },
  ],
}: ServiceSelectionProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "free" | "paid">(
    "all",
  );

  const filteredServices = services.filter((service) => {
    if (activeFilter === "all") return true;
    return service.type === activeFilter;
  });

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-2xl font-bold mb-4 text-center">
        <Trans>Select a Service</Trans>
      </Text>

      {/* Filter Tabs */}
      <View className="flex-row justify-center mb-6">
        <TouchableOpacity
          className={`px-4 py-2 rounded-l-lg ${activeFilter === "all" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            className={`${activeFilter === "all" ? "text-white" : "text-gray-700"}`}
          >
            <Trans>All</Trans>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 ${activeFilter === "free" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => setActiveFilter("free")}
        >
          <Text
            className={`${activeFilter === "free" ? "text-white" : "text-gray-700"}`}
          >
            <Trans>Free</Trans>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-r-lg ${activeFilter === "paid" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => setActiveFilter("paid")}
        >
          <Text
            className={`${activeFilter === "paid" ? "text-white" : "text-gray-700"}`}
          >
            <Trans>Paid</Trans>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Service Cards */}
      <ScrollView className="max-h-64">
        {filteredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            onPress={() => onSelectService(service)}
            className="mb-4"
          >
            <View className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">{service.name}</Text>
                {service.type === "free" ? (
                  <View className="bg-green-100 px-2 py-1 rounded">
                    <Text className="text-green-700 text-xs font-medium">
                      <Trans>FREE</Trans>
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <DollarSign size={16} color="#4B5563" />
                    <Text className="text-gray-600 ml-1">{service.price}</Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-600 mb-3">
                <Trans>{service.description}</Trans>
              </Text>

              <View className="flex-row items-center">
                <Clock size={16} color="#4B5563" />
                <Text className="text-gray-600 ml-1">{service.duration}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info Text */}
      <View className="flex-row items-center justify-center mt-4 bg-blue-50 p-3 rounded-lg">
        <Info size={16} color="#3B82F6" />
        <Text className="text-blue-600 ml-2 text-sm">
          <Trans>Select a service to continue booking</Trans>
        </Text>
      </View>
    </View>
  );
}
