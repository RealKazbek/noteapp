import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../styles/theme";

interface Task {
  id: number;
  title: string;
  description: string | null;
  is_done: boolean;
  user: string;
}

interface TaskItemProps {
  item: Task;
  onToggle: (id: number, newStatus: boolean) => void;
  onDelete: (id: number) => void;
}

const TaskItem = ({ item, onToggle, onDelete }: TaskItemProps) => {
  return (
    <View style={styles.taskItem}>
      <Link href={`/(main)/${item.id}`} asChild>
        <TouchableOpacity style={styles.taskContent}>
          
          <TouchableOpacity 
            style={styles.checkboxBase}
            onPress={() => onToggle(item.id, !item.is_done)}
          >
            <Ionicons
              name={item.is_done ? 'diamond' : 'diamond-outline'}
              size={28}
              color={item.is_done ? COLORS.ACCENT_PRIMARY : COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.taskTitle,
              item.is_done && styles.taskTitleDone,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color={COLORS.DANGER} />
      </TouchableOpacity>
    </View>
  );
};

export default function TaskListScreen() {
  const { setToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("-created_at");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  const fetchTasks = async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) {
      setIsLoading(true);
    }
    try {
      const params = {
        search: debouncedQuery,
        ordering: sortOrder,
      };
      const response = await api.get("/tasks/", { params });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      Alert.alert("Error", "Failed to load quest log.");
    } finally {
      if (showLoadingSpinner) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks(true);
  }, [debouncedQuery, sortOrder]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks(false);
    }, [debouncedQuery, sortOrder])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchTasks(false);
    setIsRefreshing(false);
  }, [debouncedQuery, sortOrder]);

  const handleToggleTask = async (id: number, newStatus: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, is_done: newStatus } : task
      )
    );
    try {
      await api.patch(`/tasks/${id}/`, { is_done: newStatus });
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, is_done: !newStatus } : task
        )
      );
      Alert.alert("Error", "Failed to update quest status.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    Alert.alert("Delete Quest", "Are you sure you want to delete this quest?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
          try {
            await api.delete(`/tasks/${id}/`);
          } catch (error) {
            Alert.alert("Error", "Failed to delete quest.");
            fetchTasks(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      item={item}
      onToggle={handleToggleTask}
      onDelete={handleDeleteTask}
    />
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={COLORS.ACCENT_PRIMARY}
          style={styles.loader}
        />
      );
    }
    if (tasks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {debouncedQuery ? "No quests found" : "Your quest log is empty"}
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.ACCENT_PRIMARY}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search quests..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sortOrder}
            onValueChange={(itemValue) => setSortOrder(itemValue)}
            style={styles.picker}
            dropdownIconColor={COLORS.ACCENT_PRIMARY}
            mode="dropdown"
          >
            <Picker.Item
              label="Sort: Newest"
              value="-created_at"
              color={Platform.OS === "ios" ? COLORS.TEXT_PRIMARY : undefined}
            />
            <Picker.Item
              label="Sort: Oldest"
              value="created_at"
              color={Platform.OS === "ios" ? COLORS.TEXT_PRIMARY : undefined}
            />
            <Picker.Item
              label="Sort: A-Z"
              value="title"
              color={Platform.OS === "ios" ? COLORS.TEXT_PRIMARY : undefined}
            />
            <Picker.Item
              label="Sort: Completed"
              value="-is_done"
              color={Platform.OS === "ios" ? COLORS.TEXT_PRIMARY : undefined}
            />
            <Picker.Item
              label="Sort: Active"
              value="is_done"
              color={Platform.OS === "ios" ? COLORS.TEXT_PRIMARY : undefined}
            />
          </Picker>
        </View>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setToken(null)}
      >
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "monospace",
  },
  list: {
    flex: 1,
    paddingTop: 10,
  },
  filtersContainer: {
    padding: 10,
    backgroundColor: COLORS.BG_SECONDARY,
    borderBottomWidth: 1,
    borderColor: COLORS.BG_TERTIARY,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.BG_TERTIARY,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
    backgroundColor: COLORS.BG_TERTIARY,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
    fontSize: 16,
  },
  pickerContainer: {
    height: 50,
    borderColor: COLORS.BG_TERTIARY,
    borderWidth: 1,
    borderRadius: 0,
    backgroundColor: COLORS.BG_TERTIARY,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: COLORS.BG_TERTIARY,
    color: COLORS.TEXT_PRIMARY,
  },
  taskItem: {
    backgroundColor: COLORS.BG_SECONDARY,
    padding: 15,
    borderRadius: 0,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ACCENT_PRIMARY,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  checkboxBase: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 10,
    flex: 1,
    color: COLORS.TEXT_PRIMARY,
  },
  taskTitleDone: {
    color: COLORS.TEXT_SECONDARY,
    textDecorationLine: "line-through",
  },
  deleteButton: {
    padding: 5,
  },
  logoutButton: {
    backgroundColor: COLORS.ACCENT_SECONDARY,
    padding: 15,
    alignItems: "center",
    margin: 10,
  },
  logoutButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "monospace",
  },
});
