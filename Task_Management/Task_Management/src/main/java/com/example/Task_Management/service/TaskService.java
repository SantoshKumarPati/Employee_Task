package com.example.Task_Management.service;

import com.example.Task_Management.entity.Task;
import com.example.Task_Management.repository.TaskRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {

        return taskRepository.findAll(
                Sort.by(Sort.Direction.ASC, "id")
        );
    }

    public Task getTaskById(Long id) {

        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));
    }

    public Task createTask(Task task) {

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task) {

        Task existingTask = getTaskById(id);

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setPriority(task.getPriority());
        existingTask.setStatus(task.getStatus());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setAssignedTo(task.getAssignedTo());

        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id) {

        Task task = getTaskById(id);

        taskRepository.delete(task);
    }
}