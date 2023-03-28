import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { LoadingPage } from "~/components/Loader";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

const ProfilePage: NextPage<{ username: string; key: string }> = ({
  username,
}) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
    key: "firstName",
  });

  if (!data) return <div>no data</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main>
        <div className=" mx-auto md:max-w-2xl">Profile View</div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma,
      userId: null,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug?.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username, key: "firstName" });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
      key: "firstName",
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
