import { type Dispatch, type SetStateAction, type ReactNode } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import type { Interaction } from "contact";

export interface InteractionFormData {
  id?: number; // id will be used to determine if it's an edit or a new interaction
  date: Date;
  title: string;
  location: string;
  Highlights: string[];
}

export const Modal = (props: { children: ReactNode; title: string }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-1/2">
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            <div className="flex items-center justify-center rounded-t p-5">
              <h3 className="text-3xl">{props.title}</h3>
            </div>
            {props.children}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};

export const EditInteractionModal = (props: {
  interaction: InteractionFormData | Interaction;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setInteraction: Dispatch<SetStateAction<Interaction | null>>;
}) => {
  const [formData, setFormData] = useState<InteractionFormData | Interaction>(
    props.interaction,
  );
  const [formErrors, setFormErrors] = useState<Partial<InteractionFormData>>(
    {},
  );

  const handleSubmit = () => {
    const errors: Partial<InteractionFormData> = {};

    if (!formData.title.length)
      errors.title = "The title field cannot be empty.";
    if (!formData.location.length)
      errors.location = "The location field cannot be empty.";

    if (!Object.keys(errors).length) {
      // mutate(formData);
      // handle the case when submission is good, separate based on create/edit
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <Modal title={formData.id ? "Edit Interaction" : "New Interaction"}>
      <div className="relative flex flex-col p-6">
        <div
          className={`flex w-full flex-row ${formErrors.title ?? formErrors.location ? "pb-2" : "pb-7"}`}
        >
          <div className="flex w-1/3 flex-col pr-3">
            <label>Date</label>
            <input
              className="mt-1 rounded-lg border-2 p-2"
              placeholder="Select a date..."
              id="date"
              required
              type="date"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: DateTime.fromISO(e.target.value).toJSDate(),
                })
              }
              value={
                DateTime.fromJSDate(formData.date as Date).toISODate() ?? ""
              }
            />
            {formErrors.title ? (
              <p className="text-red-500">{formErrors.title}</p>
            ) : null}
          </div>
          <div className="flex w-1/3 flex-col pr-3">
            <label>Title</label>
            <input
              className="mt-1 rounded-lg border-2 p-2"
              placeholder="Coffee chat..."
              id="title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
            {formErrors.title ? (
              <p className="text-red-500">{formErrors.title}</p>
            ) : null}
          </div>
          <div className="flex w-1/3 flex-col pl-3">
            <label>Location</label>
            <input
              className="mt-1 rounded-lg border-2 p-2"
              placeholder="Starbucks"
              id="location"
              required
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              value={formData.location}
            />
            {formErrors.location ? (
              <p className="text-red-500">{formErrors.location}</p>
            ) : null}
          </div>
        </div>
        {/* second row of inputs */}
        <div
          className={`flex w-full flex-row ${formErrors.title ?? formErrors.location ? "pb-2" : "pb-7"}`}
        >
          <div className="flex w-full flex-col">
            <label>Highlights</label>
            <input
              className="mt-2 rounded-lg border-2 p-2"
              placeholder="Highlight..."
              id="title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
            {formErrors.title ? (
              <p className="text-red-500">{formErrors.title}</p>
            ) : null}
            <input
              className="mt-2 rounded-lg border-2 p-2"
              placeholder="Highlight..."
              id="title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
            {formErrors.title ? (
              <p className="text-red-500">{formErrors.title}</p>
            ) : null}
            <input
              className="mt-2 rounded-lg border-2 p-2"
              placeholder="Highlight..."
              id="title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
            {formErrors.title ? (
              <p className="text-red-500">{formErrors.title}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b pb-6 pl-6 pr-6">
        <button
          className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
          type="button"
          onClick={() => {
            props.setEditMode(false);
            props.setInteraction(null);
          }}
        >
          Close
        </button>
        <button
          className="mb-1 mr-1 rounded bg-site-blue-r px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
          type="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export const ViewInteractionModal = (props: {
  interaction: Interaction | InteractionFormData | null;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setInteraction: Dispatch<SetStateAction<Interaction | null>>;
}) => {
  if (!props.interaction) return;
  const {
    interaction: { date, title, location, Highlights, id },
  } = props;

  const formattedDate = DateTime.fromJSDate(date).toFormat("MMMM dd, yyyy");

  if (!id) {
    toast.error("There is no interaction with this ID...");
    return;
  }

  return (
    <Modal title={formattedDate}>
      <div className="relative flex flex-col p-6">
        <div className="relative flex flex-col p-6">
          <div className="flex w-full flex-row pb-4">
            <div className="flex flex-col">
              <label>Title</label>
              <p className="mt-1 text-xl font-semibold">
                {title} at {location}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-row pb-4">
            <div className="flex w-full flex-col">
              <label>Highlights</label>
              {Highlights.map((h, i) => {
                return (
                  <p className="mt-1 text-xl font-semibold" key={i}>
                    - test highlight
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b p-6">
        <button
          className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
          type="button"
          onClick={() => props.setInteraction(null)}
        >
          Close
        </button>
        <button
          className="mb-1 mr-1 rounded bg-site-blue-r px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
          type="button"
          onClick={() => props.setEditMode(true)}
        >
          Edit
        </button>
      </div>
    </Modal>
  );
};

export const InteractionModal = (props: {
  interaction: InteractionFormData | Interaction | null;
  setInteraction: Dispatch<SetStateAction<Interaction | null>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const { interaction, setInteraction, editMode, setEditMode } = props;

  const emptyFormData: InteractionFormData = {
    date: new Date(),
    title: "",
    location: "",
    Highlights: [],
  };

  if (editMode) {
    return (
      <EditInteractionModal
        interaction={interaction ?? emptyFormData}
        editMode={editMode}
        setInteraction={setInteraction}
        setEditMode={setEditMode}
      />
    );
  } else
    return (
      <ViewInteractionModal
        interaction={interaction}
        setInteraction={setInteraction}
        setEditMode={setEditMode}
      />
    );
};

// submission stuff
// const ctx = api.useUtils();
// const { setAddModal } = props;

// const { mutate, isPending } = api.contacts.new.useMutation({
//   onSuccess: () => {
//     toast.success(`Successfully added ${formData.name} as a contact!`);
//     setFormData({
//       name: "",
//       affiliation: "",
//       position: "",
//       company: "",
//       notes: "",
//     });
//     void ctx.contacts.getAll.invalidate();
//     setAddModal(false);
//   },
//   onError: () => {
//     toast.error("Failed to add new contact, please try again later!");
//   },
// });
