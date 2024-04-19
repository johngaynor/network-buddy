import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
import type { ContactObj, Interaction } from "contact";
import { DateTime } from "luxon";
// import { ViewInteractionModal } from "./InteractionModal";
import { InteractionModal } from "./InteractionModal";

export const InteractionsTab = (props: { contactObj: ContactObj }) => {
  const [activeInteraction, setActiveInteraction] =
    useState<null | Interaction>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  const {
    contactObj: { interactions },
  } = props;

  const filteredInteractions = interactions
    .filter(
      (i) =>
        i.location.toLowerCase().includes(filter.toLowerCase()) ||
        i.title.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) => {
      const at = a.date.getTime();
      const bt = b.date.getTime();

      if (sortDesc) return bt - at;
      return at - bt;
    });

  // const activeInteraction = interactions.find((i) => i.id === interactionModal);

  const InteractionBox = (props: { interaction: Interaction }) => {
    const { interaction: i } = props;

    const date = DateTime.fromJSDate(i.date).toFormat("MMMM dd, yyyy");

    return (
      <div
        className="mb-3 flex flex-row justify-between rounded-xl border-2 px-5 pt-3"
        onClick={() => setActiveInteraction(i)}
      >
        <div className="w-4/5">
          <p className="py-2 font-semibold">
            {date} - {i.title} at {i.location}
          </p>
        </div>
        <div className="mb-3 flex items-center">
          <div className="flex h-10 w-24 items-center justify-evenly rounded-full bg-site-blue-l p-2 text-[#8099a7] text-site-blue-r transition ease-in-out hover:bg-site-blue-r hover:text-white">
            <p className="text-sm">Details</p>
            <FontAwesomeIcon
              icon={faEye}
              style={{ height: "18px", width: "18px" }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {activeInteraction ?? editMode ? (
        <InteractionModal
          editMode={editMode}
          setEditMode={setEditMode}
          interaction={activeInteraction}
          setInteraction={setActiveInteraction}
        />
      ) : null}
      <div className="flex justify-between">
        <p className="pb-2 text-lg font-semibold">Interactions</p>

        <p className="text-sm text-[#8099a7]" onClick={() => setEditMode(true)}>
          Total Interactions: {filteredInteractions.length}
        </p>
      </div>
      <div className="mb-3 flex justify-between">
        <div className="flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-bl-lg rounded-tl-lg border-2 bg-site-purple-l text-site-purple-r">
            <FontAwesomeIcon
              icon={faSearch}
              style={{ width: 20, height: 20 }}
            />
          </div>

          <input
            className="w-96 rounded-br-lg rounded-tr-lg border-b-2 border-r-2 border-t-2 p-2"
            placeholder="Search here..."
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          />
        </div>

        <label className="inline-flex cursor-pointer items-center">
          <span className="pr-2">Sort by Descending?</span>
          <input
            type="checkbox"
            checked={sortDesc}
            onChange={(e) => setSortDesc(e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-site-blue-r peer-checked:after:translate-x-full  peer-focus:outline-none"></div>
        </label>
      </div>

      {filteredInteractions.map((i, index) => (
        <InteractionBox key={index} interaction={i} />
      ))}
    </>
  );
};

// need to add cursor pointers to everything
