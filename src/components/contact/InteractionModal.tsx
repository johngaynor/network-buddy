import { type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import type { Interaction } from "contact";

export const InteractionModal = (props: {
  setInteractionModal: Dispatch<SetStateAction<null | number>>;
  interaction: Interaction;
}) => {
  const {
    setInteractionModal,
    interaction: { date, title, location, Highlights, id },
  } = props;

  const formattedDate = DateTime.fromJSDate(date).toFormat("MMMM dd, yyyy");

  if (!id) {
    toast.error("There is no interaction with this ID...");
    return;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-1/2">
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            <div className="flex items-center justify-center rounded-t p-5">
              <h3 className="text-3xl">{formattedDate}</h3>
            </div>
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
                    {Highlights.map((h, i) => (
                      <p className="mt-1 text-xl font-semibold" key={i}>
                        - {h.highlight}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end rounded-b p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => setInteractionModal(null)}
              >
                Close
              </button>
              <button
                className="mb-1 mr-1 rounded bg-site-blue-r px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                // onClick={() => router.push(`/contact/1`)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
