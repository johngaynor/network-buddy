import { type NextPage } from "next";
import { AddContactForm } from "~/components/global/AddContactForm";

const NewContactPage: NextPage = () => {
  return (
    <>
      <div className="flex h-16 justify-between">
        <div className="flex items-center">
          <p className="xs:text-3xl p-6 text-2xl text-site-purple-r">
            New Contact Form
          </p>
        </div>
      </div>
      <AddContactForm isModal={false} />
    </>
  );
};

export default NewContactPage;
