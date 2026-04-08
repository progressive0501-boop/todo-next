"use client";

import { useRef, useTransition } from "react";
import { addTodo } from "@/app/actions";

export default function TodoInput() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    startTransition(async () => {
      await addTodo(formData);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleAction} className="flex gap-3">
      <input
        type="text"
        name="text"
        placeholder="新しいタスクを入力..."
        required
        className="flex-1 border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-400 transition-colors"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 disabled:opacity-50 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
      >
        {isPending ? "追加中…" : "追加"}
      </button>
    </form>
  );
}
