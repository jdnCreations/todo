import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import SignInPage from "~/components/SignInPage";
import TodosList from "~/components/TodosList";
import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({ subsets: ["latin"] });

export default function Home() {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Todo</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${josefin.className} flex h-screen w-screen justify-center `}
      >
        {!session?.data ? <SignInPage /> : <TodosList />}
      </main>
    </>
  );
}
