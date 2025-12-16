import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { List, Text, IconButton, useTheme, Checkbox } from 'react-native-paper';
import { Task } from '../utils/storage';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  const theme = useTheme();

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => onDeleteTask(id), 
          style: "destructive" 
        }
      ]
    );
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
        onPress={() => confirmDelete(id)}
      >
        <IconButton icon="delete" iconColor="white" />
      </TouchableOpacity>
    );
  };

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
          No tasks yet. Add one to get started!
        </Text>
      </View>
    );
  }

  return (
    <View>
      {tasks.map((task) => (
        <Swipeable key={task.id} renderRightActions={() => renderRightActions(task.id)}>
          <List.Item
            title={task.title}
            titleStyle={
              task.completed
                ? { textDecorationLine: 'line-through', color: theme.colors.outline }
                : {}
            }
            left={() => (
              <Checkbox
                status={task.completed ? 'checked' : 'unchecked'}
                onPress={() => onToggleTask(task.id)}
              />
            )}
            style={{ backgroundColor: theme.colors.background }}
          />
        </Swipeable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
});

export default TaskList;
