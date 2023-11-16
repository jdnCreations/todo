import { useRouter } from "next/router";

const SignInPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">You must be logged in to use this app.</h1>
      <button
        className="h-20 w-[300px] rounded-lg bg-black text-xl font-bold text-white"
        onClick={() => router.push("/api/auth/signin")}
      >
        Log in with Discord
      </button>
    </div>
  );
};

export default SignInPage;
