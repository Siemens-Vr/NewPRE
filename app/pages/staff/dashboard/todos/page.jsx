"use client";
import React, { useState } from "react";
import styles from "@/app/styles/staff/todo.module.css";
import style from "@/app/styles/staff/leave/leave.module.css";

const TodoPage = () => {
  const [todos, setTodos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  // Open modal for adding tasks
  const handleOpenModal = (date) => {
    setCurrentDate(date);
    setTasks(todos[date] || []);
    setShowModal(true);
  };

  // Add a new task to the list
  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, { text: taskInput, completed: false }]);
      setTaskInput("");
    }
  };

  // Save tasks to the selected date
  const handleSaveTasks = () => {
    setTodos({ ...todos, [currentDate]: tasks });
    setShowModal(false);
  };

  // Toggle task completion
  const toggleTask = (date, index) => {
    const updatedTasks = [...todos[date]];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTodos({ ...todos, [date]: updatedTasks });
  };

  return (
    <div className={style.pageContainer}>
      <div className="flex justify-end">
      <button className={style.applyButton} onClick={() => handleOpenModal(new Date().toISOString().split("T")[0])}>
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
                <li key={index} className={task.completed ? styles.completedTask : ""}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(date, index)}
                  />
                  {task.text}
                </li>
              ))}
            </ul>
            <button className={styles.editButton} onClick={() => handleOpenModal(date)}>Edit</button>
          </div>
        ))}
      </div>

      {/* Modal for Adding Tasks */}
      {showModal && (
        <div className={style.modalOverlay} onClick={() => setShowModal(false)}>
        <div className={style.modalContainer} onClick={(e) => e.stopPropagation()}>
          {/* Close (X) Button */}
          <button className={style.closeButton} onClick={() => setShowModal(false)}>
            &times;
          </button>
            <h2>Add Tasks for {currentDate}</h2>
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
            <button onClick={handleAddTask} className={styles.addTaskButton}>Add Task</button>
           
            <button onClick={handleSaveTasks} className={styles.saveButton}> Save</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
