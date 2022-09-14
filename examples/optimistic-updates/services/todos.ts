import axios from "axios";
import { createMutation, createQuery } from "react-query-kit";

export type Todos = {
  items: readonly {
    id: string;
    text: string;
  }[];
  ts: number;
};

export const useTodos = createQuery<Todos>("/api/data", ({ queryKey: [url] }) =>
  axios.get(url).then((res) => res.data)
);

export const useAddTodo = createMutation((newTodo: string) =>
  axios.post("/api/data", { text: newTodo })
);
