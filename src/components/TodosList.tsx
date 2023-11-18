import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Todo } from "@prisma/client";

type Inputs = {
  title: string;
};

const TodosList = ({}) => {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);
  const [filteredTodos, setFilteredTodos] = useState<Todo[] | undefined>(
    undefined,
  );

  const width = window.innerWidth;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    if (mq.matches) {
      setIsDark(true);
    }

    mq.addEventListener("change", (evt) => setIsDark(evt.matches));
  }, []);

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const { mutate } = api.todo.create.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: toggleActive } = api.todo.toggleActive.useMutation({
    onSuccess: () => refetch(),
  });
  const { mutate: toggleCompleted } = api.todo.toggleComplete.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: clearComplete } = api.todo.deleteCompleted.useMutation({
    onSuccess: () => refetch(),
  });

  const { data: todos, isLoading, refetch } = api.todo.getAll.useQuery();

  function filter(type: "all" | "active" | "completed") {
    if (type === "all") {
      setFilteredTodos(undefined);
    } else if (type === "active") {
      setFilteredTodos(todos?.filter((todo) => todo.active));
    } else if (type === "completed") {
      setFilteredTodos(todos?.filter((todo) => todo.completed));
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate({ title: data.title });
    reset();
  };

  const todosLeft = todos?.filter((todo) => !todo.completed).length;

  const getImageUrl = () => {
    const theme = isDark ? "dark" : "light";
    let size = "desktop";
    if (width < 640) {
      size = "mobile";
    }
    return `/images/bg-${size}-${theme}`;
  };

  console.log(getImageUrl());

  return (
    <div className="mt-[48px] flex w-[540px] flex-col items-center px-[24px] sm:mt-[70px]  sm:px-0">
      {isDark ? (
        <picture className="absolute top-0 -z-10 h-[200px] w-screen">
          <source
            srcSet={"/images/bg-desktop-dark.jpg"}
            media="(max-width: 640px)"
          />
          <source
            srcSet="/images/bg-mobile-dark.jpg"
            media="(min-width: 600px)"
          />
          <Image
            src="/images/bg-mobile-dark"
            alt="assa"
            className="h-[200px] w-full origin-center object-cover sm:h-[300px]"
            width={375}
            height={200}
          />
        </picture>
      ) : (
        <picture className="absolute top-0 -z-10 h-[200px] w-screen">
          <source
            srcSet={"/images/bg-desktop-light.jpg"}
            media="(max-width: 640px)"
          />
          <source
            srcSet="/images/bg-mobile-light.jpg"
            media="(min-width: 600px)"
          />
          <Image
            src="/images/bg-mobile-dark"
            alt="assa"
            className="h-[200px] w-full origin-center object-cover sm:h-[300px]"
            width={375}
            height={200}
          />
        </picture>
      )}
      <div
        className={`absolute top-0 -z-20 h-full w-full ${
          isDark ? "bg-slate-500" : "bg-slate-200"
        }`}
      ></div>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-left text-[40px] font-bold uppercase tracking-[15px]">
          Todo
        </h1>
        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
              <path
                fillRule="evenodd"
                d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
              <path
                fill="#FFF"
                fill-rule="evenodd"
                d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
              />
            </svg>
          )}
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 w-full overflow-hidden rounded-lg bg-white sm:mb-6"
      >
        <input
          className="h-[64px] w-full px-[24px]"
          type="text"
          {...register("title")}
          placeholder="Create a new todo..."
        />
      </form>

      {isLoading ? (
        <div>loading...</div>
      ) : (
        <div className="mb-4 flex w-full flex-col gap-[1px] overflow-auto rounded-lg bg-gray-300 shadow-lg">
          {filteredTodos?.map((todo) => (
            <div
              key={todo.id}
              className="flex w-auto items-center justify-between gap-2 overflow-hidden bg-white px-[24px] py-[20px]"
            >
              <button
                className={`h-4 w-4 ${
                  todo.active ? "bg-green-700" : "bg-red-400"
                } `}
                onClick={() =>
                  toggleActive({ id: todo.id, active: !todo.active })
                }
              ></button>
              <button
                className={`${todo.completed ? "line-through" : ""}`}
                onClick={() =>
                  toggleCompleted({ id: todo.id, completed: !todo.completed })
                }
              >
                {todo.title}
              </button>
              <button
                onClick={() => deleteTodo({ id: todo.id })}
                className="rounded-full bg-red-400 p-2"
              >
                X
              </button>
            </div>
          ))}

          {!filteredTodos &&
            todos?.map((todo) => (
              <div
                key={todo.id}
                className="flex w-auto items-center justify-between gap-2 overflow-hidden bg-white px-[24px] py-[20px]"
              >
                <button
                  className={`h-4 w-4 ${
                    todo.active ? "bg-green-700" : "bg-red-400"
                  } `}
                  onClick={() =>
                    toggleActive({ id: todo.id, active: !todo.active })
                  }
                ></button>
                <button
                  className={`${todo.completed ? "line-through" : ""}`}
                  onClick={() =>
                    toggleCompleted({ id: todo.id, completed: !todo.completed })
                  }
                >
                  {todo.title}
                </button>
                <button
                  onClick={() => deleteTodo({ id: todo.id })}
                  className="rounded-full bg-red-400 p-2"
                >
                  X
                </button>
              </div>
            ))}
          <div className=" flex justify-between bg-white px-[24px] py-[16px]">
            <p>{todosLeft} items left</p>
            <div className="hidden gap-4 sm:flex">
              <button onClick={() => filter("all")}>All</button>
              <button onClick={() => filter("active")}>Active</button>
              <button onClick={() => filter("completed")}>Completed</button>
            </div>
            <button onClick={() => clearComplete()}>Clear Completed</button>
          </div>
        </div>
      )}

      <div className="flex h-[48px] w-full items-center justify-center gap-4 rounded-lg bg-white sm:hidden">
        <button onClick={() => filter("all")}>All</button>
        <button onClick={() => filter("active")}>Active</button>
        <button onClick={() => filter("completed")}>Completed</button>
      </div>
    </div>
  );
};

export default TodosList;
