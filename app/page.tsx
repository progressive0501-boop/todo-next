import { getTodos } from "@/lib/storage";
import TodoInput from "@/components/TodoInput";
import TodoItem from "@/components/TodoItem";

export default async function Home() {
  const todos = getTodos();
  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-[600px]">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 tracking-wide text-center">
          ✅ TODOリスト
        </h1>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 space-y-6">
          <TodoInput />

          {todos.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-400 text-sm">タスクがありません</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )}

          {todos.length > 0 && (
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
              <span>
                残り{" "}
                <strong className="text-indigo-400">{remaining}</strong> 件
              </span>
              <span>
                {todos.filter((t) => t.completed).length} / {todos.length} 完了
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
