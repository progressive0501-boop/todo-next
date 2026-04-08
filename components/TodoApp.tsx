"use client";

import { useState, useEffect } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 space-y-6">
      {/* 入力欄 */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="新しいタスクを入力..."
          className="flex-1 border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-400 transition-colors"
        />
        <button
          onClick={addTodo}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
        >
          追加
        </button>
      </div>

      {/* TODOリスト */}
      {todos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-400 text-sm">タスクがありません</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                todo.completed
                  ? "bg-gray-50 border-gray-100"
                  : "bg-indigo-50/40 border-indigo-100 hover:border-indigo-200"
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 accent-indigo-500 cursor-pointer shrink-0"
              />
              <span
                className={`flex-1 text-sm leading-relaxed ${
                  todo.completed ? "line-through text-gray-300" : "text-gray-700"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-200 hover:text-red-400 transition-colors text-xl leading-none shrink-0"
                aria-label="削除"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* フッター */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
          <span>残り <strong className="text-indigo-400">{remaining}</strong> 件</span>
          <span>{todos.filter((t) => t.completed).length} / {todos.length} 完了</span>
        </div>
      )}
    </div>
  );
}
