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
  const [mode, setMode] = useState("add"); // "add" or "update"
  const [currentDate, setCurrentDate] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState({});

  const openModal = (type, date = new Date().toISOString().split("T")[0]) => {
    setMode(type);
    setCurrentDate(date);
    setTaskInput("");
    setTasks([]);
    setShowModal(true);

    if (type === "update") {
      fetch(`${config.baseURL}/todos/${uuid}`)
        .then((res) => res.json())
        .then((data) => {
          const filtered = (data[date] || []).map((task) => ({
            task: task.todo,
            status: task.status,
            uuid: task.uuid,
            date,
          }));
          setTasks(filtered);
        })
        .catch((err) => {
          console.error("Error fetching tasks:", err);
          setTasks([]);
        });
    }
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
        <button className={style.applyButton} onClick={() => openModal("add")}>
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
                onClick={() => openModal("update", date)}
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

      {showModal && (
        <div className={style.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={style.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeButton} onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 className={styles.h2}>
              {mode === "add" ? "Add Tasks" : `Update Tasks for ${currentDate}`}
            </h2>

            {mode === "add" && (
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className={styles.inputField}
              />
            )}

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
                !task.markedForDeletion && (
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
                )
              ))}
            </ul>

            {tasks.some((t) => t.markedForDeletion) && (
              <>
                <h4 className="text-sm mt-4 text-red-600">Tasks marked for deletion:</h4>
                <ul>
                  {tasks.filter((t) => t.markedForDeletion).map((task, index) => (
                    <li key={index} className="flex justify-between items-center mb-2 text-red-500">
                      <span className="line-through">{task.task}</span>
                      <button
                        onClick={() => {
                          const updated = [...tasks];
                          const i = tasks.findIndex((t) => t.uuid === task.uuid);
                          updated[i].markedForDeletion = false;
                          setTasks(updated);
                        }}
                        className="text-green-500 font-bold ml-2"
                      >
                        Undo
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

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
