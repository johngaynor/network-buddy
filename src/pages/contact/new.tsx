import { type NextPage } from "next";
import { AddContactForm } from "~/components/global/AddContactForm";

const NewContactPage: NextPage = () => {
  return (
    <>
      <div className="flex h-16 justify-between">
        <div className="flex w-1/3 items-center justify-between">
          <p className="text-3xl text-site-purple-r">New Contact Form</p>
        </div>
      </div>
      <AddContactForm isModal={false} />
    </>
  );
};

export default NewContactPage;
