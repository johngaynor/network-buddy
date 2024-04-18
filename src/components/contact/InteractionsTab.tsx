import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import type { ContactObj, Interaction } from "contact";

const InteractionBox = (props: { interaction: Interaction }) => {
  const { interaction: i } = props;

  console.log(i);
  return (
    <div className="mb-3 flex flex-row justify-between rounded-xl border-2 px-5 pt-3">
      <div className="w-4/5">
        <p className="py-2 font-semibold">
          April 16, 2003 - Coffee chat at Indy City Barbell
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

export const InteractionsTab = (props: { contactObj: ContactObj }) => {
  const {
    contactObj: { interactions },
  } = props;

  return (
    <>
      <p className="pb-2 text-lg font-semibold">Interactions</p>
      {interactions.map((i, index) => (
        <InteractionBox key={index} interaction={i} />
      ))}
    </>
  );
};
