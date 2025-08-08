import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  CreditCard,
  BarChart2,
  ChevronRight,
  Filter,
} from "lucide-react-native";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard
  const upcomingAppointments = [
    {
      id: 1,
      customer: "John Doe",
      service: "Consultation",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "confirmed",
      isPaid: true,
    },
    {
      id: 2,
      customer: "Jane Smith",
      service: "Follow-up",
      date: "2023-06-15",
      time: "11:30 AM",
      status: "pending",
      isPaid: false,
    },
    {
      id: 3,
      customer: "Mike Johnson",
      service: "Initial Meeting",
      date: "2023-06-16",
      time: "2:00 PM",
      status: "confirmed",
      isPaid: true,
    },
  ];

  const stats = {
    totalAppointments: 24,
    confirmedAppointments: 18,
    pendingAppointments: 6,
    revenue: 1250,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <View className="space-y-6">
            <View className="flex-row flex-wrap justify-between">
              <StatCard
                title="Total Appointments"
                value={stats.totalAppointments}
                icon={<Calendar size={20} color="#4f46e5" />}
              />
              <StatCard
                title="Confirmed"
                value={stats.confirmedAppointments}
                icon={<Clock size={20} color="#10b981" />}
              />
              <StatCard
                title="Pending"
                value={stats.pendingAppointments}
                icon={<Clock size={20} color="#f59e0b" />}
              />
              <StatCard
                title="Revenue"
                value={`$${stats.revenue}`}
                icon={<CreditCard size={20} color="#6366f1" />}
              />
            </View>

            <View className="bg-white rounded-lg p-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold">Upcoming Appointments</Text>
                <TouchableOpacity className="flex-row items-center">
                  <Filter size={16} color="#6b7280" />
                  <Text className="text-sm text-gray-500 ml-1">Filter</Text>
                </TouchableOpacity>
              </View>

              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}

              <TouchableOpacity className="mt-4">
                <Text className="text-indigo-600 text-center">
                  View All Appointments
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case "appointments":
        return (
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold mb-4">All Appointments</Text>
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </View>
        );
      case "customers":
        return (
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold mb-4">Customer Management</Text>
            <Text className="text-gray-500">
              Manage your customer database here.
            </Text>
          </View>
        );
      case "services":
        return (
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold mb-4">Service Management</Text>
            <Text className="text-gray-500">
              Configure your services, pricing, and availability.
            </Text>
          </View>
        );
      case "settings":
        return (
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold mb-4">System Settings</Text>
            <Text className="text-gray-500">
              Configure booking rules, notifications, and Google Calendar sync.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      <View className="p-4 bg-indigo-600">
        <Text className="text-2xl font-bold text-white">Admin Dashboard</Text>
        <Text className="text-white opacity-80">
          Manage your booking system
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">{renderTabContent()}</ScrollView>

      <View className="flex-row justify-around bg-white border-t border-gray-200 py-2">
        <NavButton
          title="Overview"
          icon={
            <BarChart2
              size={24}
              color={activeTab === "overview" ? "#4f46e5" : "#6b7280"}
            />
          }
          active={activeTab === "overview"}
          onPress={() => setActiveTab("overview")}
        />
        <NavButton
          title="Appointments"
          icon={
            <Calendar
              size={24}
              color={activeTab === "appointments" ? "#4f46e5" : "#6b7280"}
            />
          }
          active={activeTab === "appointments"}
          onPress={() => setActiveTab("appointments")}
        />
        <NavButton
          title="Customers"
          icon={
            <Users
              size={24}
              color={activeTab === "customers" ? "#4f46e5" : "#6b7280"}
            />
          }
          active={activeTab === "customers"}
          onPress={() => setActiveTab("customers")}
        />
        <NavButton
          title="Services"
          icon={
            <CreditCard
              size={24}
              color={activeTab === "services" ? "#4f46e5" : "#6b7280"}
            />
          }
          active={activeTab === "services"}
          onPress={() => setActiveTab("services")}
        />
        <NavButton
          title="Settings"
          icon={
            <Settings
              size={24}
              color={activeTab === "settings" ? "#4f46e5" : "#6b7280"}
            />
          }
          active={activeTab === "settings"}
          onPress={() => setActiveTab("settings")}
        />
      </View>
    </SafeAreaView>
  );
}

const StatCard = ({ title = "", value = "0", icon = null }) => (
  <View className="bg-white p-4 rounded-lg shadow-sm w-[48%] mb-4">
    <View className="flex-row justify-between items-center">
      <Text className="text-gray-500 text-sm">{title}</Text>
      {icon}
    </View>
    <Text className="text-2xl font-bold mt-2">{value}</Text>
  </View>
);

const AppointmentCard = ({
  appointment = {
    id: 0,
    customer: "Customer Name",
    service: "Service",
    date: "2023-01-01",
    time: "00:00",
    status: "pending",
    isPaid: false,
  },
}) => (
  <Pressable className="border-b border-gray-100 py-3">
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="font-medium">{appointment.customer}</Text>
        <Text className="text-sm text-gray-500">{appointment.service}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-xs text-gray-500">
            {appointment.date} • {appointment.time}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <View
          className={`rounded-full px-2 py-1 mr-2 ${appointment.status === "confirmed" ? "bg-green-100" : "bg-yellow-100"}`}
        >
          <Text
            className={`text-xs ${appointment.status === "confirmed" ? "text-green-800" : "text-yellow-800"}`}
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </Text>
        </View>
        {appointment.isPaid && (
          <View className="rounded-full bg-blue-100 px-2 py-1">
            <Text className="text-xs text-blue-800">Paid</Text>
          </View>
        )}
        <ChevronRight size={16} color="#9ca3af" className="ml-2" />
      </View>
    </View>
  </Pressable>
);

const NavButton = ({
  title = "",
  icon = null,
  active = false,
  onPress = () => {},
}) => (
  <TouchableOpacity
    className={`items-center ${active ? "opacity-100" : "opacity-60"}`}
    onPress={onPress}
  >
    {icon}
    <Text
      className={`text-xs mt-1 ${active ? "text-indigo-600 font-medium" : "text-gray-500"}`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);
