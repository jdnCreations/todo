import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Todo } from "@prisma/client";

type Inputs = {
  title: string;
};

type Filter = "all" | "active" | "completed";

const TodosList = ({}) => {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);
  const [filteredTodos, setFilteredTodos] = useState<Todo[] | undefined>(
    undefined,
  );
  const [filterType, setFilterType] = useState<Filter | undefined>(undefined);

  const { data: todos, isLoading, refetch } = api.todo.getAll.useQuery();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    if (mq.matches) {
      setIsDark(true);
    }

    mq.addEventListener("change", (evt) => setIsDark(evt.matches));
  }, []);

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const { mutate: createTodo } = api.todo.create.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: toggleActive } = api.todo.toggleActive.useMutation({
    onSuccess: () => refetch(),
  });
  const { mutate: toggleCompleted } = api.todo.toggleComplete.useMutation({
    onSuccess: async () => {
      await refetch();

      console.log("Todos after refetch: ", todos);
      if (filterType) {
        console.log("filtering");
        setFilteredTodos(todos?.filter((todo) => todo.completed));
        console.log("Filtered todos:", filteredTodos);
      }
    },
  });

  const { mutate: clearComplete } = api.todo.deleteCompleted.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  function filter(type: Filter) {
    if (type === "all") {
      setFilteredTodos(undefined);
      setFilterType(undefined);
    } else if (type === "active") {
      setFilteredTodos(todos?.filter((todo) => todo.active));
      setFilterType(type);
    } else if (type === "completed") {
      setFilteredTodos(todos?.filter((todo) => todo.completed));
      setFilterType(type);
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createTodo({ title: data.title });

    reset();
  };

  const todosLeft = todos?.filter((todo) => !todo.completed).length;

  // const getImageUrl = () => {
  //   const theme = isDark ? "dark" : "light";
  //   let size = "desktop";
  //   if (width < 640) {
  //     size = "mobile";
  //   }
  //   return `/images/bg-${size}-${theme}`;
  // };

  return (
    <div className="mt-[48px] flex w-[540px] flex-col items-center px-[24px] sm:mt-[70px]  sm:px-0">
      {isDark ? (
        <picture className="absolute top-0 -z-10 h-[200px] w-screen">
          <source
            srcSet={"/images/bg-desktop-dark.jpg"}
            media="(min-width: 640px)"
          />
          <Image
            src="/images/bg-mobile-dark.jpg"
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
            media="(min-width: 640px)"
          />
          <Image
            src="/images/bg-mobile-light.jpg"
            alt="assa"
            className="h-[200px] w-full origin-center object-cover sm:h-[300px]"
            width={375}
            height={200}
          />
        </picture>
      )}
      <div
        className={`absolute top-0 -z-20 h-full w-full ${
          isDark ? "bg-dark" : "bg-light"
        }`}
      ></div>
      <div className="mb-[30px] flex w-full items-center justify-between sm:mb-[48px]">
        <h1
          className={`top-1 text-left text-[26px] font-bold uppercase leading-normal tracking-[10px] text-white sm:text-[40px] sm:tracking-[15px]`}
        >
          Todo
        </h1>
        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="scale-75 sm:scale-100"
              width="26"
              height="26"
            >
              <path
                fill="#FFF"
                fillRule="evenodd"
                d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              className="scale-75 sm:scale-100"
            >
              <path
                fillRule="evenodd"
                fill="#FFF"
                d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"
              />
            </svg>
          )}
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${
          isDark ? "bg-todos-dark" : "bg-todos-light"
        } mb-4 flex h-[48px] w-full items-center gap-3 overflow-hidden rounded-lg px-5 text-[12px] sm:mb-6 sm:h-[64px] sm:gap-6 sm:px-6 sm:text-[18px]`}
      >
        <div
          className={`h-6 w-6 min-w-[24px]
            ${
              isDark ? "border-seperator-dark" : "border-seperator-light"
            } grid place-items-center rounded-full border`}
        ></div>
        <input
          className={`${
            isDark
              ? "bg-todos-dark text-todotxt-dark placeholder:placeholder-dark"
              : "bg-todos-light text-todotxt-light placeholder:placeholder-light"
          } w-full `}
          type="text"
          {...register("title")}
          placeholder="Create a new todo..."
        />
      </form>

      {isLoading ? (
        <div>loading...</div>
      ) : (
        <div
          className={`${
            isDark ? "bg-seperator-dark" : "bg-seperator-light"
          } mb-4 flex w-full flex-col gap-[1px] overflow-auto rounded-lg shadow-lg`}
        >
          {filteredTodos?.map((todo) => (
            <div
              key={todo.id}
              className={`${
                isDark ? "bg-todos-dark" : "bg-todos-light"
              } group flex w-auto items-center justify-between gap-3 overflow-hidden px-5 py-4 text-[12px] sm:gap-6 sm:px-[24px] sm:py-[20px] sm:text-[18px]`}
            >
              <button
                aria-label="set active"
                className={`h-6 w-6 min-w-[24px] ${
                  todo.active
                    ? "from-grad-blue to-grad-purple bg-gradient-to-br"
                    : "bg-transparent"
                } ${
                  isDark ? "border-seperator-dark" : "border-seperator-light"
                } hover:border-bright-blue grid place-items-center rounded-full border`}
                onClick={() =>
                  toggleActive({ id: todo.id, active: !todo.active })
                }
              >
                {todo.active ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                    <path
                      fill="none"
                      stroke="#FFF"
                      strokeWidth="2"
                      d="M1 4.304L3.696 7l6-6"
                    />
                  </svg>
                ) : null}
              </button>
              <button
                aria-label="set completed"
                className={`${
                  todo.completed
                    ? isDark
                      ? "text-todotxt-dark-complete line-through"
                      : "text-todotxt-light-complete line-through"
                    : isDark
                      ? "text-todotxt-dark"
                      : "text-todotxt-light"
                } w-full text-left`}
                onClick={
                  () =>
                    toggleCompleted({ id: todo.id, completed: !todo.completed })
                  // need to update filtered todos using refetched todos
                }
              >
                {todo.title}
              </button>
              <button
                aria-label="delete"
                className=" group-hover:block  md:hidden"
                onClick={() => deleteTodo({ id: todo.id })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[12px] sm:w-[18px]"
                  viewBox="0 0 18 18"
                >
                  <path
                    fill="#494C6B"
                    fillRule="evenodd"
                    d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                  />
                </svg>
              </button>
            </div>
          ))}

          {!filteredTodos &&
            todos?.map((todo) => (
              <div
                key={todo.id}
                className={`${
                  isDark ? "bg-todos-dark" : "bg-todos-light"
                } group flex w-auto items-center justify-between gap-3 overflow-hidden px-5 py-4 text-[12px] sm:gap-6 sm:px-[24px] sm:py-[20px] sm:text-[18px]`}
              >
                <button
                  aria-label="set active"
                  className={`h-6 w-6 min-w-[24px] ${
                    todo.active
                      ? "from-grad-blue to-grad-purple bg-gradient-to-br"
                      : "bg-transparent"
                  } ${
                    isDark ? "border-seperator-dark" : "border-seperator-light"
                  } hover:border-bright-blue grid place-items-center rounded-full border`}
                  onClick={() =>
                    toggleActive({ id: todo.id, active: !todo.active })
                  }
                >
                  {todo.active ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="9"
                    >
                      <path
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="2"
                        d="M1 4.304L3.696 7l6-6"
                      />
                    </svg>
                  ) : null}
                </button>
                <button
                  aria-label="set completed"
                  className={`${
                    todo.completed
                      ? isDark
                        ? "text-todotxt-dark-complete line-through"
                        : "text-todotxt-light-complete line-through"
                      : isDark
                        ? "text-todotxt-dark"
                        : "text-todotxt-light"
                  } w-full text-left`}
                  onClick={() =>
                    toggleCompleted({ id: todo.id, completed: !todo.completed })
                  }
                >
                  {todo.title}
                </button>
                <button
                  aria-label="delete"
                  className=" group-hover:block  md:hidden"
                  onClick={() => deleteTodo({ id: todo.id })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[12px] sm:w-[18px]"
                    viewBox="0 0 18 18"
                  >
                    <path
                      fill="#494C6B"
                      fillRule="evenodd"
                      d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          <div
            className={`${
              isDark
                ? "bg-todos-dark text-btn-dark"
                : "bg-todos-light text-btn-light"
            } flex items-center  justify-between px-[24px] py-[16px] text-[12px] sm:text-[18px]`}
          >
            <p className="text-[14px]">{todosLeft} items left</p>
            <div className="hidden gap-4 sm:flex">
              <button
                className={`${
                  filterType === undefined ? "text-bright-blue" : ""
                } ${
                  isDark ? "hover:text-white" : "hover:text-todotxt-light"
                }  hover:text-white`}
                onClick={() => filter("all")}
              >
                All
              </button>
              <button
                className={`${
                  filterType === "active" ? "text-bright-blue" : ""
                }  ${isDark ? "hover:text-white" : "hover:text-todotxt-light"}`}
                onClick={() => filter("active")}
              >
                Active
              </button>
              <button
                className={`${
                  filterType === "completed" ? "text-bright-blue" : ""
                } ${isDark ? "hover:text-white" : "hover:text-todotxt-light"}`}
                onClick={() => filter("completed")}
              >
                Completed
              </button>
            </div>
            <button
              className={`${
                isDark ? "hover:text-white" : "hover:text-todotxt-light"
              } text-[14px]`}
              onClick={() => clearComplete()}
            >
              Clear Completed
            </button>
          </div>
        </div>
      )}

      <div
        className={`${
          isDark
            ? "bg-todos-dark text-btn-dark"
            : "bg-todos-light text-btn-light"
        } flex h-[48px] w-full items-center justify-center gap-4 rounded-lg text-[14px] font-bold shadow-lg sm:hidden`}
      >
        <button
          className={`${filterType === undefined ? "text-bright-blue" : ""} ${
            isDark ? "hover:text-white" : "hover:text-todotxt-light"
          }  hover:text-white`}
          onClick={() => filter("all")}
        >
          All
        </button>
        <button
          className={`${filterType === "active" ? "text-bright-blue" : ""}  ${
            isDark ? "hover:text-white" : "hover:text-todotxt-light"
          }`}
          onClick={() => filter("active")}
        >
          Active
        </button>
        <button
          className={`${filterType === "completed" ? "text-bright-blue" : ""} ${
            isDark ? "hover:text-white" : "hover:text-todotxt-light"
          }`}
          onClick={() => filter("completed")}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default TodosList;
