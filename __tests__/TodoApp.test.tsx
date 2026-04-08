import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import TodoApp from "@/components/TodoApp";

describe("TodoApp", () => {
  const user = userEvent.setup();

  // -------------------------------------------------------
  // 初期表示
  // -------------------------------------------------------
  describe("初期表示", () => {
    it("タスクが0件のとき「タスクがありません」を表示する", () => {
      render(<TodoApp />);
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("タスクが0件のとき、フッター（件数表示）は表示されない", () => {
      render(<TodoApp />);
      expect(screen.queryByText(/完了/)).not.toBeInTheDocument();
    });

    it("localStorageに保存済みタスクがある場合、復元して表示する", () => {
      localStorage.setItem(
        "todos",
        JSON.stringify([{ id: 1, text: "復元タスク", completed: false }])
      );
      render(<TodoApp />);
      expect(screen.getByText("復元タスク")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------
  // タスク追加
  // -------------------------------------------------------
  describe("タスク追加", () => {
    it("テキストを入力して追加ボタンを押すとタスクが一覧に追加される", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "買い物に行く");
      await user.click(screen.getByRole("button", { name: "追加" }));
      expect(screen.getByText("買い物に行く")).toBeInTheDocument();
    });

    it("Enterキーを押してもタスクを追加できる", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "運動する{Enter}");
      expect(screen.getByText("運動する")).toBeInTheDocument();
    });

    it("追加後に入力欄がクリアされる", async () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスクA");
      await user.click(screen.getByRole("button", { name: "追加" }));
      expect(input).toHaveValue("");
    });

    it("空文字・空白のみの入力はタスクに追加されない", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "   ");
      await user.click(screen.getByRole("button", { name: "追加" }));
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("複数のタスクをそれぞれ追加できる", async () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスクA");
      await user.click(addButton);
      await user.type(input, "タスクB");
      await user.click(addButton);

      expect(screen.getByText("タスクA")).toBeInTheDocument();
      expect(screen.getByText("タスクB")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------
  // 完了・未完了の切り替え
  // -------------------------------------------------------
  describe("完了・未完了の切り替え", () => {
    beforeEach(async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "テストタスク");
      await user.click(screen.getByRole("button", { name: "追加" }));
    });

    it("チェックボックスをオンにするとタスクが完了状態になり打ち消し線が付く", async () => {
      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(screen.getByText("テストタスク")).toHaveClass("line-through");
    });

    it("完了状態のチェックボックスをオフにすると未完了に戻る", async () => {
      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox); // 完了に
      await user.click(checkbox); // 未完了に戻す
      expect(checkbox).not.toBeChecked();
      expect(screen.getByText("テストタスク")).not.toHaveClass("line-through");
    });
  });

  // -------------------------------------------------------
  // タスク削除
  // -------------------------------------------------------
  describe("タスク削除", () => {
    it("削除ボタンを押すと該当タスクが一覧から消える", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "削除対象");
      await user.click(screen.getByRole("button", { name: "追加" }));

      await user.click(screen.getByRole("button", { name: "削除" }));

      expect(screen.queryByText("削除対象")).not.toBeInTheDocument();
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("複数タスクのうち特定のタスクだけを削除できる", async () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "残すタスク");
      await user.click(addButton);
      await user.type(input, "削除するタスク");
      await user.click(addButton);

      const deleteButtons = screen.getAllByRole("button", { name: "削除" });
      await user.click(deleteButtons[1]); // 2番目（削除するタスク）を削除

      expect(screen.getByText("残すタスク")).toBeInTheDocument();
      expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------
  // フッターの件数表示
  // -------------------------------------------------------
  describe("フッターの件数表示", () => {
    it("タスクが1件・未完了のとき「残り 1 件」「0 / 1 完了」を表示する", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "タスク");
      await user.click(screen.getByRole("button", { name: "追加" }));

      expect(screen.getByText(/残り/)).toHaveTextContent("残り 1 件");
      expect(screen.getByText(/完了/)).toHaveTextContent("0 / 1 完了");
    });

    it("タスクを完了にすると完了数が増え、残り件数が減る", async () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスクA");
      await user.click(addButton);
      await user.type(input, "タスクB");
      await user.click(addButton);

      await user.click(screen.getAllByRole("checkbox")[0]);

      expect(screen.getByText(/残り/)).toHaveTextContent("残り 1 件");
      expect(screen.getByText(/完了/)).toHaveTextContent("1 / 2 完了");
    });
  });

  // -------------------------------------------------------
  // localStorageへの保存
  // -------------------------------------------------------
  describe("localStorageへの保存", () => {
    it("タスク追加後にlocalStorageへ保存される", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "保存テスト");
      await user.click(screen.getByRole("button", { name: "追加" }));

      const saved = JSON.parse(localStorage.getItem("todos") ?? "[]");
      expect(saved).toHaveLength(1);
      expect(saved[0].text).toBe("保存テスト");
      expect(saved[0].completed).toBe(false);
    });

    it("タスク削除後にlocalStorageの内容も更新される", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "削除確認");
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.click(screen.getByRole("button", { name: "削除" }));

      const saved = JSON.parse(localStorage.getItem("todos") ?? "[]");
      expect(saved).toHaveLength(0);
    });

    it("完了状態の変更がlocalStorageに反映される", async () => {
      render(<TodoApp />);
      await user.type(screen.getByPlaceholderText("新しいタスクを入力..."), "完了テスト");
      await user.click(screen.getByRole("button", { name: "追加" }));
      await user.click(screen.getByRole("checkbox"));

      const saved = JSON.parse(localStorage.getItem("todos") ?? "[]");
      expect(saved[0].completed).toBe(true);
    });
  });
});
