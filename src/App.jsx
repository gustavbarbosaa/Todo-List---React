import React from "react";
import "./style/styleGlobal.css";
import "./style/App.css";

import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000/";

export default () => {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "todos")
        .then((response) => response.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);
      setTodos(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      done: false,
    };

    await fetch(API + "todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);

    setTitle("");
  };

  const handleDelete = async (id) => {
    await fetch(API + "todos/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>Todo List</h1>
      </div>
      <div className="form-todo">
        <h2>Insira sua tarefa: </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="assignment">O que você vai fazer?</label>
          <input
            type="text"
            name="assignment"
            id="assignment"
            placeholder="Informe sua tarefa"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title || ""}
            required
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
      <div className="list-todo">
        <p className="title-list-todo">Lista de tarefas</p>
        {todos.length != 0 ? (
          todos.map((todo) => {
            return (
              <div className="todo" key={todo.id}>
                <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
                <div className="actions">
                  <span className="BookMark" onClick={() => handleEdit(todo)}>
                    {todo.done ? <BsBookmarkCheckFill /> : <BsBookmarkCheck />}
                  </span>
                  <BsTrash
                    className="BsTrash"
                    onClick={() => handleDelete(todo.id)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p>Não há tarefas</p>
        )}
      </div>
    </div>
  );
};
