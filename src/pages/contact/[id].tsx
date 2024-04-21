import { useRouter } from "next/router";
import { useState } from "react";
import { NextPage } from "next";
import { api } from "~/utils/api";
import { useContacts } from "~/store/AppStore";
import toast from "react-hot-toast";
import type { Contact, ContactObj } from "contact";
import { ContactLoadingPage } from "~/components/loading";

import { ProfileTab } from "~/components/contact/ProfileTab";
import { InteractionsTab } from "~/components/contact/InteractionsTab";
import { HistoryTab } from "~/components/contact/HistoryTab";
import { OpportunitiesTab } from "~/components/contact/OpportunitiesTab";

const ProfileSection = (props: { contactId: number; contact: Contact }) => {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(1);
  const ProfileSectionTab = (props: {
    title: string;
    index: 0 | 1 | 2 | 3;
  }) => {
    const { title, index } = props;
    return (
      <p
        className={`text-md w-fit rounded-full px-4 py-2 transition delay-100 ease-in-out hover:bg-site-purple-l hover:text-site-purple-r ${index === activeTab ? null : "text-[#8099a7]"}`}
        onClick={() => setActiveTab(index)}
      >
        {title}
      </p>
    );
  };

  const { contactId, contact } = props;
  const { data, isLoading, error } = api.interactions.getByContact.useQuery({
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
          <ProfileSectionTab title="Profile" index={0} />
          <ProfileSectionTab title="Interactions" index={1} />
          <ProfileSectionTab title="History" index={2} />
          <ProfileSectionTab title="Opportunities" index={3} />
        </div>
        <div className="w-full pl-6">
          {activeTab === 0 ? <ProfileTab contactObj={contactObj} /> : null}
          {activeTab === 1 ? <InteractionsTab contactObj={contactObj} /> : null}
          {activeTab === 2 ? <HistoryTab /> : null}
          {activeTab === 3 ? <OpportunitiesTab /> : null}
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
