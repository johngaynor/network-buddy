import { useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

interface NewContactFormData {
  name: string;
  affiliation: string;
  position: string;
  company: string;
  notes: string;
}

export const AddModal = (props: {
  addModal: boolean;
  setAddModal: Dispatch<SetStateAction<boolean>>;
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

  const { mutate, isPending } = api.contacts.newContact.useMutation({
    onSuccess: () => {
      setFormData({
        name: "",
        affiliation: "",
        position: "",
        company: "",
        notes: "",
      });
      void ctx.contacts.getAll.invalidate();
      props.setAddModal(false);
    },
    onError: (err) => {
      console.log(err);
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-3xl">
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
              <h3 className="text-3xl font-semibold">New Contact Form</h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                onClick={() => props.setAddModal(false)}
              >
                <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex flex-auto flex-col p-6">
              <input
                className="border-2"
                placeholder="Name..."
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

              <input
                className="border-2"
                placeholder="Affiliation..."
                id="affiliation"
                required
                onChange={(e) =>
                  setFormData({ ...formData, affiliation: e.target.value })
                }
                value={formData.affiliation}
              />
              <input
                className="border-2"
                placeholder="Position..."
                id="position"
                required
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                value={formData.position}
              />
              <input
                className="border-2"
                placeholder="Company..."
                id="company"
                required
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                value={formData.company}
              />
              <input
                className="border-2"
                placeholder="Notes..."
                id="notes"
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                value={formData.notes}
              />
            </div>
            {/*footer*/}
            <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => props.setAddModal(false)}
              >
                Close
              </button>
              <button
                className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
