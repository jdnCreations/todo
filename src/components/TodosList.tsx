import { useSession } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

type Inputs = {
  title: string;
};

const TodosList = ({}) => {
  const session = useSession();

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  const { mutate } = api.todo.create.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: toggleActive } = api.todo.toggleActive.useMutation({
    onSuccess: () => refetch(),
  });

  const { data: todos, isLoading, refetch } = api.todo.getAll.useQuery();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate({ title: data.title });
  };

  return (
    <div className="my-10 flex flex-col items-center">
      <h1>Todos</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("title")} />
      </form>

      {isLoading ? (
        <div>loading...</div>
      ) : (
        <div className="flex w-[300px] flex-col gap-2 rounded-lg bg-gray-200 p-4">
          {todos?.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between gap-2 "
            >
              <button
                className={`h-4 w-4 ${
                  todo.active ? "bg-green-700" : "bg-red-400"
                } `}
                onClick={() =>
                  toggleActive({ id: todo.id, active: !todo.active })
                }
              ></button>
              <p>{todo.title}</p>
              <button
                onClick={() => deleteTodo({ id: todo.id })}
                className="rounded-full bg-red-400 p-2"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodosList;
