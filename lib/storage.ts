import fs from "fs";
import path from "path";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const FILE_PATH =
  process.env.NODE_ENV === "production"
    ? "/tmp/todos.json"
    : path.join(process.cwd(), "todos.json");

export function getTodos(): Todo[] {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(raw) as Todo[];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), "utf-8");
}
