import { useRouter } from "next/router";
import { NextPage } from "next";

const ContactPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log("Contact page ID:", id);

  return (
    <div>
      <h1>Contact Page</h1>
      <p>ID: {id}</p>
    </div>
  );
};

export default ContactPage;
