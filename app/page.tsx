import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-[600px]">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 tracking-wide text-center">
          ✅ TODOリスト
        </h1>
        <TodoApp />
      </div>
    </main>
  );
}
