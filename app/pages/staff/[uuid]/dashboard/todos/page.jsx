"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/styles/staff/todo.module.css";
import style from "@/app/styles/staff/leave/leave.module.css";
import { useParams } from "next/navigation";
import { config } from "/config";

const TodoPage = () => {
  const params = useParams();
  const { uuid } = params;
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState({});

  const handleOpenModal = () => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
    setTasks([]);
    setShowModal(true);
  };

  const handleOpenUpdateModal = async (date) => {
    setCurrentDate(date);
    try {
      const response = await fetch(`${config.baseURL}/todos/${uuid}`);
      const data = await response.json();
      const filteredTasks = (data[date] || []).map((task) => ({
        task: task.todo,
        status: task.status,
        uuid: task.uuid,
        date,
      }));
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
    setShowUpdateModal(true);
  };

  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([
        ...tasks,
        { task: taskInput, status: false, date: currentDate, isNew: true },
      ]);
      setTaskInput("");
    }
  };

  const handleSaveTasks = async () => {
    const newTasks = tasks.filter((t) => t.isNew && !t.markedForDeletion);
    const updatedTasks = tasks.filter((t) => t.uuid && !t.markedForDeletion);
    const deletedTasks = tasks.filter((t) => t.markedForDeletion && t.uuid);

    try {
      if (newTasks.length > 0) {
        await fetch(`${config.baseURL}/todos/${uuid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: newTasks }),
        });
      }

      for (let task of updatedTasks) {
        await fetch(`${config.baseURL}/todos/task/${task.uuid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: task.task, status: task.status }),
        });
      }

      for (let task of deletedTasks) {
        await fetch(`${config.baseURL}/todos/task/${task.uuid}`, {
          method: "DELETE",
        });
      }

      await loadAllTodos();
      setShowModal(false);
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error processing tasks:", error);
    }
  };

  const toggleTask = async (date, index) => {
    const updatedTodos = [...todos[date]];
    const task = updatedTodos[index];
    task.status = !task.status;

    setTodos({ ...todos, [date]: updatedTodos });

    try {
      await fetch(`${config.baseURL}/todos/task/${task.uuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: task.status }),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const loadAllTodos = async () => {
    try {
      const res = await fetch(`${config.baseURL}/todos/${uuid}`);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error loading all todos:", error);
    }
  };

  useEffect(() => {
    loadAllTodos();
  }, [uuid]);

  return (
    <div className={style.pageContainer}>
      <div className="flex justify-end">
        <button className={style.applyButton} onClick={handleOpenModal}>
          Add To-Do
        </button>
      </div>

      <h1 className={styles.title}>My To-Do List</h1>

      <div className={styles.todoContainer}>
        {Object.keys(todos).map((date) => (
          <div key={date} className={styles.todoCard}>
            <div className="flex items-center justify-between">
              <h3>{date}</h3>
              <button
                className={styles.editButton}
                onClick={() => handleOpenUpdateModal(date)}
              >
                Update
              </button>
            </div>

            <ul>
              {todos[date].map((task, index) => (
                <li
                  key={index}
                  className={
                    task.status === "true" || task.status === true
                      ? styles.completedTask
                      : ""
                  }
                >
                  <input
                    type="checkbox"
                    checked={task.status === "true" || task.status === true}
                    onChange={() => toggleTask(date, index)}
                  />
                  {task.todo}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className={style.modalOverlay} onClick={() => setShowUpdateModal(false)}>
          <div className={style.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button
              className={style.closeButton}
              onClick={() => setShowUpdateModal(false)}
            >
              &times;
            </button>
            <h2 className={styles.h2}>Update Tasks for {currentDate}</h2>

            <input
              type="text"
              placeholder="Enter task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className={styles.inputField}
            />

            <ul>
              {tasks.map((task, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={task.task}
                    onChange={(e) => {
                      const updated = [...tasks];
                      updated[index].task = e.target.value;
                      setTasks(updated);
                    }}
                    className="border p-1 rounded w-4/5"
                  />
                  <button
                    onClick={() => {
                      const updated = [...tasks];
                      if (updated[index].uuid) {
                        updated[index].markedForDeletion = true;
                      } else {
                        updated.splice(index, 1);
                      }
                      setTasks(updated);
                    }}
                    className="text-red-500 font-bold ml-2"
                  >
                    X
                  </button>
                </li>
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

      {/* Add Modal */}
      {showModal && (
        <div className={style.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={style.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeButton} onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 className={styles.h2}>Add Tasks</h2>

            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="Enter task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className={styles.inputField}
              disabled={!currentDate}
            />

            <ul>
              {tasks.map((task, index) => (
                <li key={index}>{task.task}</li>
              ))}
            </ul>

            <div className={styles.buttonContainer}>
              <button
                onClick={handleAddTask}
                className={styles.addTaskButton}
                disabled={!currentDate}
              >
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
