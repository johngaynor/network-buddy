import { useRouter } from "next/router";
import { NextPage } from "next";
import { api } from "~/utils/api";
import { useContacts } from "~/store/AppStore";
import toast from "react-hot-toast";
import type { Contact } from "contact";

const ProfileSection = (props: { contactId: number; contact: Contact }) => {
  const { contactId } = props;
  const { data, isLoading, error } = api.contacts.getInteractions.useQuery({
    contactId,
  });

  if (error) toast.error("Error retrieving interactions: " + error.message);

  console.log(data);

  return (
    <div>
      {isLoading || !data ? (
        "Loading..."
      ) : (
        <>
          <h1>Contact Page</h1>
          <p>ID: {contactId}</p>
        </>
      )}
    </div>
  );
};

const ContactPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const contacts = useContacts();

  const contactId: number | null =
    typeof id === "string" ? parseInt(id, 10) : null;

  const contact = contacts?.find((c) => c.id === contactId);
  console.log(contact, contacts);

  return (
    <div>
      {contactId && contact ? (
        <ProfileSection contactId={contactId} contact={contact} />
      ) : (
        "no contact id"
      )}
    </div>
  );
};

export default ContactPage;
