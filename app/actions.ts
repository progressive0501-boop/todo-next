"use server";

import { revalidatePath } from "next/cache";
import { getTodos, saveTodos } from "@/lib/storage";

export async function addTodo(formData: FormData) {
  const text = (formData.get("text") as string | null)?.trim();
  if (!text) return;

  const todos = getTodos();
  todos.push({
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now(),
  });
  saveTodos(todos);
  revalidatePath("/");
}

export async function toggleTodo(id: string) {
  const todos = getTodos();
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
  saveTodos(todos);
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const todos = getTodos();
  saveTodos(todos.filter((t) => t.id !== id));
  revalidatePath("/");
}
