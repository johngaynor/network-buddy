import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import type { Contact } from "contact";
import { Modal } from "../global/Modal";

export const ContactModal = (props: {
  contactModal: null | number;
  setContactModal: Dispatch<SetStateAction<null | number>>;
  contacts: Contact[];
}) => {
  const router = useRouter();

  const { contactModal, setContactModal, contacts } = props;

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

  return (
    <>
      <Modal header={name}>
        {/*  begin content */}
        <div className="relative flex flex-col p-6">
          <div className="flex w-full flex-row pb-4">
            <div className="flex w-1/3 flex-col">
              <label className="font-semibold">Affiliation</label>
              <p className="mt-1 text-xl">{affiliation}</p>
            </div>
            <div className="flex w-2/3 flex-col">
              <label className="font-semibold">Occupation</label>
              <p className="mt-1 text-xl">
                {position} at {company}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-row pb-4">
            <div className="flex w-full flex-col">
              <label className="font-semibold">General Notes</label>
              <p className="mt-1 text-xl">{notes}</p>
            </div>
          </div>
          <div className="flex w-full flex-row pb-4">
            <div className="flex w-1/3 flex-col">
              <label className="font-semibold">Last Activity</label>
              <p className="mt-1 text-xl">
                {intTitle && intDate
                  ? intTitle +
                    " on " +
                    DateTime.fromJSDate(intDate).toFormat("MMMM dd, yyyy")
                  : "--"}
              </p>
            </div>
            <div className="flex w-2/3 flex-col">
              <label className="font-semibold">Activity Highlights</label>
              {intHighlights.length ? (
                intHighlights.map((h, i) => (
                  <p className="mt-1 text-xl" key={i}>
                    - {h.highlight}
                  </p>
                ))
              ) : (
                <p className="mt-1 text-xl">--</p>
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
            onClick={() => router.push(`/contact/${contactModal}`)}
          >
            View Profile
          </button>
        </div>
        {/* end content */}
      </Modal>
    </>
  );
};
