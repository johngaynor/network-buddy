import { useState } from "react";
// import { SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import { ContactLoadingPage } from "~/components/spinner";
import ContactTable from "~/components/contacts/ContactTable";
import { AddModal } from "~/components/contacts/AddModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFilter,
  faUserPlus,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

import { api } from "~/utils/api";
import toast from "react-hot-toast";

const Home: NextPage = () => {
  const [addModal, setAddModal] = useState(false);

  const { data, isLoading, error } = api.contacts.getAll.useQuery();

  if (error) toast.error("Error retrieving contacts, please try again later!");

  return (
    <>
      {addModal ? (
        <AddModal addModal={addModal} setAddModal={setAddModal} />
      ) : null}
      <div className="flex h-16 justify-between">
        <div className="flex w-1/3 items-center justify-between">
          <p className="text-3xl text-site-purple-r">Contacts</p>
          <p className="-ml-20 text-sm text-[#b5bfc3]">14,323 Total</p>
          <p className="text-sm text-[#b5bfc3]">
            Sort by: <span className="text-[#828586]">Date Created</span>
          </p>
        </div>
        <div className="flex w-1/3 items-center justify-end">
          <div className="hover:text-text-[#4ca8f6] flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#8099a7] transition ease-in-out hover:bg-site-blue-l hover:text-[#4ca8f6]">
            <FontAwesomeIcon
              icon={faBars}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
          <div className="mx-1 flex h-10 w-20 items-center justify-evenly rounded-md bg-white text-sm text-[#8099a7] transition ease-in-out hover:bg-[#ddf1fb] hover:text-[#4ca8f6]">
            <p>Filter</p>
            <FontAwesomeIcon
              icon={faFilter}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
          <div
            className="flex h-10 w-36 items-center justify-evenly rounded-md bg-site-blue-r text-sm text-white"
            onClick={() => setAddModal(!addModal)}
          >
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ height: "20px", width: "20px" }}
            />
            <p>Add Contact</p>
          </div>
          <div className="mx-1 flex h-10 w-10 items-center justify-center rounded-md bg-site-blue-l text-site-blue-r transition ease-in-out hover:bg-site-blue-r hover:text-white">
            <FontAwesomeIcon
              icon={faEllipsis}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
        </div>
      </div>
      {!data || isLoading ? (
        <ContactLoadingPage />
      ) : (
        <ContactTable data={data} />
      )}
    </>
  );
};

export default Home;
