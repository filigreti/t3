import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const PostPage: NextPage = () => {
  const router = useRouter();

  //   console.log(router);

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main>
        <div className=" mx-auto md:max-w-2xl">Post Page View</div>
      </main>
    </>
  );
};

export default PostPage;
