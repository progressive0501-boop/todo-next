import { toggleTodo, deleteTodo } from "@/app/actions";
import type { Todo } from "@/lib/storage";

export default function TodoItem({ todo }: { todo: Todo }) {
  const toggleAction = toggleTodo.bind(null, todo.id);
  const deleteAction = deleteTodo.bind(null, todo.id);

  return (
    <li
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        todo.completed
          ? "bg-gray-50 border-gray-100"
          : "bg-indigo-50/40 border-indigo-100 hover:border-indigo-200"
      }`}
    >
      {/* 完了トグル */}
      <form action={toggleAction}>
        <button
          type="submit"
          aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            todo.completed
              ? "bg-indigo-400 border-indigo-400 text-white"
              : "border-indigo-300 hover:border-indigo-500"
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </form>

      {/* テキスト */}
      <span
        className={`flex-1 text-sm leading-relaxed ${
          todo.completed ? "line-through text-gray-300" : "text-gray-700"
        }`}
      >
        {todo.text}
      </span>

      {/* 削除ボタン */}
      <form action={deleteAction}>
        <button
          type="submit"
          aria-label="削除"
          className="text-gray-200 hover:text-red-400 transition-colors text-xl leading-none shrink-0"
        >
          ×
        </button>
      </form>
    </li>
  );
}
