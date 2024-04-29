import { type NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/contacts");
  }, []);

  return <></>;
};

export default HomePage;
