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
      toast.success(`Successfully added ${formData.name} as a contact!`);
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-1/2">
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-center rounded-t p-5">
              <h3 className="text-3xl">Add Contact</h3>
            </div>
            {/*body*/}
            <div className="relative flex flex-col p-6">
              {/* first row of inputs */}
              <div
                className={`flex w-full flex-row ${formErrors.name ?? formErrors.affiliation ? "pb-2" : "pb-7"}`}
              >
                <div className="flex w-1/2 flex-col pr-3">
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
                <div className="flex w-1/2 flex-col pl-3">
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
                className={`flex w-full flex-row ${formErrors.position ?? formErrors.company ? "pb-2" : "pb-7"}`}
              >
                <div className="flex w-1/2 flex-col pr-3">
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
                <div className="flex w-1/2 flex-col pl-3">
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
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => props.setAddModal(false)}
              >
                Close
              </button>
              <button
                className="mb-1 mr-1 rounded bg-site-blue-r px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
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