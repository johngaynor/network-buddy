import { useRouter } from "next/router";
import { useState } from "react";
import { NextPage } from "next";
import { api } from "~/utils/api";
import { useContacts } from "~/store/AppStore";
import toast from "react-hot-toast";
import type { Contact, ContactObj, Interaction } from "contact";
import { ContactLoadingPage } from "~/components/loading";

import { ProfileTab } from "~/components/contact/ContactTabs";

const ProfileSectionTab = (props: { title: string }) => {
  return (
    <p className="text-md w-fit rounded-full px-4 py-2 text-[#8099a7] transition delay-100 ease-in-out hover:bg-site-purple-l hover:text-site-purple-r">
      {props.title}
    </p>
  );
};

const ProfileSection = (props: { contactId: number; contact: Contact }) => {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(0);

  const { contactId, contact } = props;
  const { data, isLoading, error } = api.contacts.getInteractions.useQuery({
    contactId,
  });

  if (error) toast.error("Error retrieving interactions: " + error.message);

  const { intTitle, intDate, intHighlights, ...rest } = contact;
  const contactObj: ContactObj = { ...rest, interactions: data ?? [] };

  if (isLoading || !data) {
    return <ContactLoadingPage />;
  }

  return (
    <>
      <div className="flex h-16 justify-between">
        <div className="flex w-1/3 items-center justify-between">
          <p className="text-3xl text-site-purple-r">Contact</p>
        </div>
      </div>
      <div className="flex h-full w-full flex-row rounded-lg bg-white p-4">
        <div className="flex w-48 flex-col border-r-2">
          <ProfileSectionTab title="Profile" />
          <ProfileSectionTab title="Interactions" />
          <ProfileSectionTab title="History" />
          <ProfileSectionTab title="Opportunities" />
        </div>
        <div className="w-full pl-6">
          <ProfileTab contactObj={contactObj} />
        </div>
      </div>
    </>
  );
};

const ContactPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const contacts = useContacts();

  const contactId: number | null =
    typeof id === "string" ? parseInt(id, 10) : null;

  const contact = contacts?.find((c) => c.id === contactId);

  if (contactId && contact) {
    return <ProfileSection contactId={contactId} contact={contact} />;
  } else return <ContactLoadingPage />;
};

export default ContactPage;
