import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const EditButton = () => (
  <div className="flex w-20 items-center justify-evenly rounded-full bg-site-blue-l p-2 text-[#8099a7] text-site-blue-r transition ease-in-out hover:bg-site-blue-r hover:text-white">
    <p className="text-sm">Edit</p>
    <FontAwesomeIcon
      icon={faPenToSquare}
      style={{ height: "18px", width: "18px" }}
    />
  </div>
);
export const ProfileTab = () => {
  return (
    <>
      <p className="py-2 font-semibold">Profile</p>
      <div className="flex h-32 flex-row items-center justify-between rounded-xl border-2 px-5">
        <div className="flex">
          <div className="h-20 w-20 rounded-full border-2 border-site-purple-r"></div>
          <div className="pl-4">
            <p className="pb-1 text-xl">Zach Canterbury</p>
            <p className="text-md text-[#8099a7]">Director of IN/OH Sales</p>
            <p className="text-md text-[#8099a7]">IMI</p>
          </div>
        </div>

        <EditButton />
      </div>
    </>
  );
};
