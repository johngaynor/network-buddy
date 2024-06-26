import { type Dispatch, type SetStateAction, type ReactNode } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import type { Interaction, Highlight } from "contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../loading";

export interface InteractionFormData {
  id?: number; // id will be used to determine if it's an edit or a new interaction
  date: Date;
  title: string;
  location: string;
  Highlights: Highlight[];
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
  contactId: number;
}) => {
  const [formData, setFormData] = useState<InteractionFormData | Interaction>(
    props.interaction,
  );
  const [formErrors, setFormErrors] = useState<Partial<InteractionFormData>>(
    {},
  );

  const ctx = api.useUtils();

  const { mutate: newMutate, isPending: newPending } =
    api.interactions.new.useMutation({
      onSuccess: () => {
        props.setEditMode(false);
        toast.success(`Successfully added new interaction!`);
        setFormData({
          date: new Date(),
          title: "",
          location: "",
          Highlights: [],
        });
        void ctx.interactions.getByContact.invalidate();
        void ctx.contacts.getAll.invalidate();
      },
      onError: () => {
        toast.error("Failed to add interaction, please try again later!");
      },
    });

  const { mutate: editMutate, isPending: editPending } =
    api.interactions.edit.useMutation({
      onSuccess: () => {
        props.setEditMode(false);
        props.setInteraction(null);
        toast.success(`Successfully edited interaction!`);
        setFormData({
          date: new Date(),
          title: "",
          location: "",
          Highlights: [],
        });
        void ctx.interactions.getByContact.invalidate();
        void ctx.contacts.getAll.invalidate();
      },
      onError: () => {
        toast.error("Failed to edit interaction, please try again later!");
      },
    });

  const handleSubmit = () => {
    const errors: Partial<InteractionFormData> = {};

    if (!formData.title.length)
      errors.title = "The title field cannot be empty.";
    if (!formData.location.length)
      errors.location = "The location field cannot be empty.";

    if (!Object.keys(errors).length) {
      if (!props.interaction.id) {
        newMutate({ ...formData, contactId: props.contactId });
      } else {
        editMutate({
          ...formData,
          interactionId: props.interaction.id,
          contactId: props.contactId,
        });
      }
      setFormData({
        date: new Date(),
        title: "",
        location: "",
        Highlights: [],
      }); // clear out values
    } else {
      setFormErrors(errors);
    }
  };

  const handleDelete = (i: number) => {
    const highlights = [...formData.Highlights];

    if (highlights[i]) {
      if (!highlights[i]!.id) {
        highlights.splice(i, 1);
      } else if (!highlights[i]!.isDeleted) {
        highlights[i]!.isDeleted = true;
      }
    }

    setFormData({ ...formData, Highlights: highlights });
  };

  return (
    <Modal title={formData.id ? "Edit Interaction" : "New Interaction"}>
      {newPending || editPending ? <LoadingSpinner size={20} /> : null}
      <div className="flex flex-col p-6">
        <div
          className={`flex w-full flex-row ${formErrors.title ?? formErrors.location ? "pb-2" : "pb-7"}`}
        >
          <div className="flex w-1/3 flex-col pr-3">
            <label className="font-semibold">Date</label>
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
              value={DateTime.fromJSDate(formData.date).toISODate() ?? ""}
            />
          </div>
          <div className="flex w-1/3 flex-col pr-3">
            <label className="font-semibold">Title</label>
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
            <label className="font-semibold">Location</label>
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
            <label className="font-semibold">Highlights</label>
            {formData.Highlights.map((h, i) => {
              if (!h.isDeleted)
                return (
                  <div className="flex" key={i}>
                    <input
                      className={`mt-2 w-full rounded-lg border-2 p-2 ${h.isDeleted ? "bg-red-100 text-gray-300" : null}`}
                      placeholder="Highlight..."
                      id={`highlight-${i}`}
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Highlights: formData.Highlights.map((h, index) =>
                            index === i
                              ? { ...h, highlight: e.target.value }
                              : h,
                          ),
                        })
                      }
                      value={h.highlight}
                      disabled={h.isDeleted}
                    />
                    <div
                      className="mt-2 flex w-12 items-center justify-evenly rounded-md bg-red-100 p-2 text-red-500 transition ease-in-out hover:bg-red-500 hover:text-white"
                      onClick={() => handleDelete(i)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ height: "15px", width: "15px" }}
                      />
                    </div>
                  </div>
                );
              return null;
            })}
            {/* There is a bug here... after entering the first letter, it loses focus because it is removing one input and switching in another */}
            {/* {!formData.Highlights.length ? (
              <div className="flex">
                <input
                  className="mt-2 w-full rounded-lg border-2 p-2"
                  placeholder="Highlight..."
                  id={`highlight-default`}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Highlights: [
                        ...formData.Highlights,
                        { highlight: e.target.value },
                      ],
                    })
                  }
                  value={formData.Highlights[0]?.highlight}
                />
                <div className="mt-2 flex w-12 items-center justify-evenly rounded-md bg-red-100 p-2 text-red-500 transition ease-in-out hover:bg-red-500 hover:text-white">
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ height: "15px", width: "15px" }}
                  />
                </div>
              </div>
            ) : null} */}
            <div
              className="mt-2 flex h-8 w-8 cursor-pointer items-center justify-evenly rounded-md bg-site-blue-l p-2 text-[#8099a7] text-site-blue-r transition ease-in-out hover:bg-site-blue-r hover:text-white"
              onClick={() =>
                setFormData({
                  ...formData,
                  Highlights: [...formData.Highlights, { highlight: "" }],
                })
              }
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ height: "15px", width: "15px" }}
              />
            </div>
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
          disabled={newPending || editPending}
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
  contactId: number;
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

  const ctx = api.useUtils();

  const { mutate, isPending } = api.interactions.delete.useMutation({
    onSuccess: () => {
      props.setInteraction(null);
      toast.success(`Successfully deleted interaction!`);
      void ctx.interactions.getByContact.invalidate();
      void ctx.contacts.getAll.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete interaction, please try again later!");
    },
  });

  const handleDelete = () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this interaction? This action cannot be undone.",
    );

    if (confirm) mutate({ interactionId: id, contactId: props.contactId });
  };

  return (
    <Modal title={formattedDate}>
      {isPending ? <LoadingSpinner size={20} /> : null}
      <div className="flex flex-col p-6">
        <div className="flex flex-col p-6">
          <div className="flex w-full flex-row pb-4">
            <div className="flex flex-col">
              <label className="font-semibold">Title</label>
              <p className="mt-1 text-xl">
                {title} at {location}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-row pb-4">
            <div className="flex w-full flex-col">
              <label className="font-semibold">Highlights</label>
              {Highlights.map((h, i) => {
                return (
                  <p className="mt-1 text-xl" key={i}>
                    {h.highlight}
                  </p>
                );
              })}
              {!Highlights.length ? <p className="mt-1 text-xl">--</p> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-b p-6">
        <div
          className="mb-1 mr-1 flex cursor-pointer rounded bg-red-500 px-3 py-3 text-sm uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
          onClick={handleDelete}
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            style={{ height: "18px", width: "18px" }}
          />
        </div>
        <div>
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
      </div>
    </Modal>
  );
};

export const InteractionModal = (props: {
  interaction: InteractionFormData | Interaction | null;
  setInteraction: Dispatch<SetStateAction<Interaction | null>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  contactId: number;
}) => {
  const { interaction, setInteraction, editMode, setEditMode, contactId } =
    props;

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
        contactId={contactId}
      />
    );
  } else
    return (
      <ViewInteractionModal
        interaction={interaction}
        setInteraction={setInteraction}
        setEditMode={setEditMode}
        contactId={contactId}
      />
    );
};
