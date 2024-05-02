import { useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Modal } from "./Modal";
import { useRouter } from "next/navigation";

interface NewContactFormData {
  name: string;
  affiliation: string;
  position: string;
  company: string;
  notes: string;
}

export const AddContactForm = (props: {
  isModal: boolean;
  setAddModal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState<NewContactFormData>({
    name: "",
    affiliation: "",
    position: "",
    company: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<NewContactFormData>>({});

  const ctx = api.useUtils();
  const router = useRouter();
  const { setAddModal, isModal } = props;

  const { mutate, isPending } = api.contacts.new.useMutation({
    onSuccess: (contact) => {
      toast.success(`Successfully added ${formData.name} as a contact!`);
      setFormData({
        name: "",
        affiliation: "",
        position: "",
        company: "",
        notes: "",
      });
      void ctx.contacts.getAll.invalidate();
      if (isModal && setAddModal) setAddModal(false);
      if (!isModal && !setAddModal) router.push(`/contact/${contact.id}`);
    },
    onError: () => {
      toast.error("Failed to add new contact, please try again later!");
    },
  });

  const handleSubmit = () => {
    const errors: Partial<NewContactFormData> = {};

    if (!formData.name.length) errors.name = "The name field cannot be empty.";
    if (!formData.affiliation.length)
      errors.affiliation = "The affiliation field cannot be empty.";
    if (!formData.position.length)
      errors.position = "The position field cannot be empty.";
    if (!formData.company.length)
      errors.company = "The company field cannot be empty.";
    if (!formData.notes.length)
      errors.notes = "The notes field cannot be empty.";

    if (!Object.keys(errors).length) {
      mutate(formData);
    } else {
      setFormErrors(errors);
    }
  };

  const Form = (
    <>
      <div className="flex flex-col p-6">
        {/* first row of inputs */}
        <div
          className={`flex w-full flex-col sm:flex-row ${formErrors.name ?? formErrors.affiliation ? "pb-2" : "pb-7"}`}
        >
          <div className="flex flex-col sm:w-1/2 sm:pr-3">
            <label>Name</label>
            <input
              className="mt-1 rounded-lg border-2 p-2"
              placeholder="Joe Smith"
              id="name"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
            />
            {formErrors.name ? (
              <p className="text-red-500">{formErrors.name}</p>
            ) : null}
          </div>
          <div className="flex flex-col pt-8 sm:w-1/2 sm:pl-3 sm:pt-0">
            <label>Affiliation</label>
            <input
              className="mt-1 rounded-lg border-2 p-2"
              placeholder="Mutual friend of ___, etc."
              id="affiliation"
              required
              onChange={(e) =>
                setFormData({ ...formData, affiliation: e.target.value })
              }
              value={formData.affiliation}
            />
            {formErrors.affiliation ? (
              <p className="text-red-500">{formErrors.affiliation}</p>
            ) : null}
          </div>
        </div>
        {/* second row of inputs */}
        <div
          className={`flex w-full flex-col sm:flex-row ${formErrors.position ?? formErrors.company ? "pb-2" : "pb-7"}`}
        >
          <div className="flex flex-col sm:w-1/2 sm:pr-3">
            <label>Company</label>
            <input
              className="mt-1 rounded-lg border-2 p-2"
              placeholder="Microsoft"
              id="company"
              required
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              value={formData.company}
            />
            {formErrors.company ? (
              <p className="text-red-500">{formErrors.company}</p>
            ) : null}
          </div>
          <div className="flex flex-col pt-8 sm:w-1/2 sm:pl-3 sm:pt-0">
            <label>Position</label>
            <input
              className="mt-1 rounded-lg border-2 p-2"
              placeholder="Software Developer"
              id="position"
              required
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              value={formData.position}
            />
            {formErrors.position ? (
              <p className="text-red-500">{formErrors.position}</p>
            ) : null}
          </div>
        </div>
        {/* third row of inputs */}
        <div
          className={`flex w-full flex-row ${formErrors.notes ? "pb-2" : "pb-7"}`}
        >
          <div className="flex w-full flex-col">
            <label>Notes</label>
            <textarea
              className="mt-1 h-40 resize-none rounded-lg border-2 p-2"
              placeholder="General notes... i.e. where are they from?"
              id="notes"
              required
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              value={formData.notes}
            />
            {formErrors.notes ? (
              <p className="text-red-500">{formErrors.notes}</p>
            ) : null}
          </div>
        </div>
      </div>
      {/*footer*/}
      <div className="flex items-center justify-end rounded-b p-6">
        {isModal && setAddModal ? (
          <button
            className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
            type="button"
            onClick={() => setAddModal(false)}
          >
            Close
          </button>
        ) : null}

        <button
          className="mb-1 mr-1 rounded bg-site-blue-r px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
        >
          Submit
        </button>
      </div>
    </>
  );

  if (isModal && setAddModal) {
    return (
      <Modal header="Add Contact" loadingState={isPending}>
        {Form}
      </Modal>
    );
  } else return Form;
};
