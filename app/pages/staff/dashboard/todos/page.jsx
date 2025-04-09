"use client";
import React, { useState } from "react";
import styles from "@/app/styles/staff/todo.module.css";
import style from "@/app/styles/staff/leave/leave.module.css";
import { config } from "/config";

const TodoPage = () => {
  const [todos, setTodos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  
  const handleOpenModal = async (date) => {
    setCurrentDate(date);
    try {
      const response = await fetch(`${config.baseURL}/todos/${date}`);
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
    setShowModal(true);
  };

  
  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, { text: taskInput, completed: false }]);
      setTaskInput("");
    }
  };


  const handleSaveTasks = async () => {
    try {
      const response = await fetch(`${config.baseURL}/todos/${currentDate}`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const saved = await response.json();
      setTodos({ ...todos, [currentDate]: saved.tasks });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };


  const toggleTask = async (date, index) => {
    const updatedTasks = [...todos[date]];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTodos({ ...todos, [date]: updatedTasks });

    try {
      await fetch(`${config.baseURL}/todos/${date}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks }),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

 
  const loadAllTodos = async () => {
    try {
      const res =await fetch(`${config.baseURL}/todos/`);
      const data = await res.json();
      const mapped = {};
      data.forEach((entry) => {
        mapped[entry.date] = entry.tasks;
      });
      setTodos(mapped);
    } catch (error) {
      console.error("Error loading all todos:", error);
    }
  };


  React.useEffect(() => {
    loadAllTodos();
  }, []);

  return (
    <div className={style.pageContainer}>
      <div className="flex justify-end">
        <button
          className={style.applyButton}
          onClick={() =>
            handleOpenModal(new Date().toISOString().split("T")[0])
          }
        >
          Add To-Do
        </button>
      </div>
      <h1 className={styles.title}>My To-Do List</h1>

      {/* Display To-Do Cards */}
      <div className={styles.todoContainer}>
        {Object.keys(todos).map((date) => (
          <div key={date} className={styles.todoCard}>
            <h3>{date}</h3>
            <ul>
              {todos[date].map((task, index) => (
                <li
                  key={index}
                  className={task.completed ? styles.completedTask : ""}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(date, index)}
                  />
                  {task.text}
                </li>
              ))}
            </ul>
            <button
              className={styles.editButton}
              onClick={() => handleOpenModal(date)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={style.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            className={style.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={style.closeButton}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className={styles.h2}>Add Tasks for {currentDate}</h2>
            <input
              type="text"
              placeholder="Enter task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className={styles.inputField}
            />
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>{task.text}</li>
              ))}
            </ul>
            <div className={styles.buttonContainer}>
              <button onClick={handleAddTask} className={styles.addTaskButton}>
                Add Task
              </button>
              <button onClick={handleSaveTasks} className={styles.saveButton}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
