import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { api } from "@/utils/api";
import type { RouterOutputs } from "@/utils/api";

import { SignInButton, useUser } from "@clerk/nextjs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        width={56}
        height={56}
        src={user.profileImageUrl}
        alt="Profile"
        className="h-14 w-14 rounded-full"
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none "
      />
    </div>
  );
};

type PostWithUsers = RouterOutputs["posts"]["getAll"][number];

const PostView = ({ post, author }: PostWithUsers) => {
  return (
    <div className="flex gap-3 border-b border-slate-400 p-4 ">
      <Image
        width={56}
        height={56}
        src={author.profileImageUrl}
        alt={`@${author.username}`}
        className="h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-x-1 text-slate-400">
          {" "}
          <span>@{author.username}</span>{" "}
          <span className="font-thin">
            {" "}
            . {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  console.log(user);

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          {/* <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" /> */}
          <div className="flex border-b border-slate-400 p-4 ">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                {" "}
                <SignInButton />{" "}
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {[...data, ...data]?.map(({ post, author }) => (
              <PostView key={post.id} author={author} post={post} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
