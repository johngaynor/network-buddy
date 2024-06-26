import { useRouter } from "next/router";
import { useState } from "react";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useContacts } from "~/store/AppStore";
import toast from "react-hot-toast";
import type { Contact, ContactObj } from "contact";
import { ContactLoadingPage } from "~/components/loading";

import { ProfileTab } from "~/components/contact/tabs/ProfileTab";
import { InteractionsTab } from "~/components/contact/tabs/InteractionsTab";
import { HistoryTab } from "~/components/contact/tabs/HistoryTab";
import { OpportunitiesTab } from "~/components/contact/tabs/OpportunitiesTab";

const ProfileSection = (props: { contactId: number; contact: Contact }) => {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(0);
  const router = useRouter();
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

  const ctx = api.useUtils();

  const { mutate, isPending } = api.contacts.delete.useMutation({
    onSuccess: async () => {
      toast.success(`Successfully deleted contact!`);
      void ctx.contacts.getAll.invalidate();
      await router.push("/");
    },
    onError: (err) => {
      toast.error("Failed to delete contact, please try again later!");
    },
  });

  const handleDeleteContact = () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this contact? This action cannot be undone.",
    );
    if (confirm) mutate({ id: contactId });
  };

  if (isLoading || !data || isPending) {
    return <ContactLoadingPage />;
  }

  return (
    <>
      <div className="flex h-16 justify-between">
        <div className="flex w-1/3 items-center justify-between">
          <p className="xs:text-3xl p-6 text-2xl text-site-purple-r">Contact</p>
        </div>
      </div>
      {/* temporary fix to allow you to switch tabs */}
      <select
        onChange={(e) =>
          setActiveTab(parseInt(e.target.value) as 0 | 1 | 2 | 3)
        }
        className="mx-auto h-14 w-1/2 border-2 border-site-purple-r lg:hidden"
      >
        <option value="0">Profile</option>
        <option value="1">Interactions</option>
        {/* <option value="2">History</option>
        <option value="3">Opportunities</option> */}
      </select>
      <div className="flex h-full w-full flex-row overflow-hidden rounded-lg bg-white p-4">
        <div className="hidden w-48 flex-col border-r-2 lg:flex">
          <ProfileSectionTab title="Profile" index={0} />
          <ProfileSectionTab title="Interactions" index={1} />
          <ProfileSectionTab title="History" index={2} />
          <ProfileSectionTab title="Opportunities" index={3} />
          <p
            className="text-md mt-10 w-fit rounded-full px-4 py-2 text-red-500 transition delay-100 ease-in-out hover:bg-red-500 hover:text-white"
            onClick={handleDeleteContact}
          >
            Delete Contact
          </p>
        </div>
        <div className="w-full overflow-y-auto px-6">
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
