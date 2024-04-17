import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useContacts } from "~/store/AppStore";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import type { Contact } from "contact";

export const ContactModal = (props: {
  contactModal: null | number;
  setContactModal: Dispatch<SetStateAction<null | number>>;
}) => {
  const contacts: Contact[] = useContacts();
  const router = useRouter();

  const { contactModal, setContactModal } = props;

  const activeContact: Contact | undefined = contacts.find(
    (c) => c.id === contactModal,
  );

  if (!activeContact) {
    toast.error("There is no contact with this ID...");
    return;
  }

  const {
    name,
    affiliation,
    company,
    position,
    notes,
    intTitle,
    intDate,
    intHighlights,
  } = activeContact;

  console.log(intHighlights[0]?.highlight);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-1/2">
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            <div className="flex items-center justify-center rounded-t p-5">
              <h3 className="text-3xl">{name}</h3>
            </div>
            <div className="relative flex flex-col p-6">
              <div className="flex w-full flex-row pb-4">
                <div className="flex w-1/3 flex-col">
                  <label>Affiliation</label>
                  <p className="mt-1 text-xl font-semibold">{affiliation}</p>
                </div>
                <div className="flex w-2/3 flex-col">
                  <label>Occupation</label>
                  <p className="mt-1 text-xl font-semibold">
                    {position} at {company}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-row pb-4">
                <div className="flex w-full flex-col">
                  <label>General Notes</label>
                  <p className="mt-1 text-xl font-semibold">{notes}</p>
                </div>
              </div>
              <div className="flex w-full flex-row pb-4">
                <div className="flex w-1/3 flex-col">
                  <label>Last Activity</label>
                  <p className="mt-1 text-xl font-semibold">
                    {intTitle && intDate
                      ? intTitle +
                        " on " +
                        DateTime.fromJSDate(intDate).toFormat("MMMM dd, yyyy")
                      : "--"}
                  </p>
                </div>
                <div className="flex w-2/3 flex-col">
                  <label>Activity Highlights</label>
                  {intHighlights.length ? (
                    intHighlights.map((h, i) => (
                      <p className="mt-1 text-xl font-semibold" key={i}>
                        - {h.highlight}
                      </p>
                    ))
                  ) : (
                    <p className="mt-1 text-xl font-semibold">--</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end rounded-b p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => setContactModal(null)}
              >
                Close
              </button>
              <button
                className="mb-1 mr-1 rounded bg-site-blue-r px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                onClick={() => router.push(`/contact/1`)}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
