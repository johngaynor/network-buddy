import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import type { ContactObj } from "contact";

const EditButton = () => (
  <div className="flex h-10 w-20 items-center justify-evenly rounded-full bg-site-blue-l p-2 text-[#8099a7] text-site-blue-r transition ease-in-out hover:bg-site-blue-r hover:text-white">
    <p className="text-sm">Edit</p>
    <FontAwesomeIcon
      icon={faPenToSquare}
      style={{ height: "18px", width: "18px" }}
    />
  </div>
);

const TextField = (props: { label: string; text: string }) => {
  const { label, text } = props;
  return (
    <div>
      <p className="text-sm text-[#8099a7]">{label}</p>
      <p className="pb-5 pt-1">{text}</p>
    </div>
  );
};

export const ProfileTab = (props: { contactObj: ContactObj }) => {
  const { contactObj } = props;
  console.log(contactObj);
  return (
    <>
      <p className="pb-2 text-lg font-semibold">Profile</p>
      <div className="flex h-32 flex-row items-center justify-between rounded-xl border-2 px-5">
        <div className="flex">
          <div className="h-20 w-20 rounded-full border-2 border-site-purple-r"></div>
          <div className="pl-4">
            <p className="pb-1 text-xl">{contactObj.name ?? "--"}</p>
            <p className="text-md text-[#8099a7]">
              {contactObj.position ?? "--"}
            </p>
            <p className="text-md text-[#8099a7]">
              {contactObj.company ?? "--"}
            </p>
          </div>
        </div>
        <EditButton />
      </div>
      <div className="my-3 flex flex-row justify-between rounded-xl border-2 px-5 pt-3">
        <div className="w-4/5">
          <p className="py-2 font-semibold">Personal Information</p>
          <div className="flex">
            <div className="w-1/2 pr-3 pt-3">
              <TextField label="Name" text={contactObj.name ?? "--"} />
              <TextField label="Position" text={contactObj.position ?? "--"} />
            </div>
            <div className="w-1/2 pr-3 pt-3">
              <TextField
                label="Affiliation"
                text={contactObj.affiliation ?? "--"}
              />
              <TextField label="Company" text={contactObj.company ?? "--"} />
            </div>
          </div>
          <TextField label="General Notes" text={contactObj.notes ?? "--"} />
        </div>
        <EditButton />
      </div>
      <div className="flex flex-row justify-between rounded-xl border-2 px-5 pt-3">
        <div className="w-4/5">
          <p className="py-2 font-semibold">Contact Information</p>
          <div className="flex">
            <div className="w-1/2 pr-3 pt-3">
              <TextField label="Phone #" text="(###) ###-####" />
            </div>
            <div className="w-1/2 pr-3 pt-3">
              <TextField label="Social Media" text="--" />
            </div>
          </div>
        </div>
        <div className="mb-3 flex items-center">
          <EditButton />
        </div>
      </div>
    </>
  );
};
