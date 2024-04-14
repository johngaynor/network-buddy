import Head from "next/head";
import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import { IconDefinition, faHouse } from "@fortawesome/free-solid-svg-icons";
import { ContactLoadingPage } from "~/components/spinner";
import ContactTable from "~/components/contacts/ContactTable";
import { AddModal } from "~/components/contacts/AddModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFilter,
  faUserPlus,
  faEllipsis,
  faMagnifyingGlass,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

import { api } from "~/utils/api";
import toast from "react-hot-toast";

const Home: NextPage = () => {
  const [addModal, setAddModal] = useState(false);

  const { data, isLoading, error } = api.contacts.getAll.useQuery();

  if (error) toast.error("Error retrieving contacts, please try again later!");

  const NavIcon = ({ icon }: { icon: IconDefinition }) => {
    return (
      <div className="flex h-14 w-14 items-center justify-center text-[#8099a7] transition delay-100 ease-in-out hover:bg-site-purple-l hover:text-site-purple-r">
        <FontAwesomeIcon
          icon={icon}
          style={{ height: "20px", width: "20px" }}
        />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Network Buddy</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-bl from-site-blue-r to-site-purple-r p-10">
        <div className="flex h-full w-full flex-row rounded-lg bg-white">
          {addModal ? (
            <AddModal addModal={addModal} setAddModal={setAddModal} />
          ) : null}
          <div className="flex w-14 flex-col items-center">
            <NavIcon icon={faBars} />
            <NavIcon icon={faBars} />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex h-14 w-full items-center rounded-lg bg-white px-6 text-[#8099a7]">
              <div className="flex w-1/6 items-center">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{ height: "20px", width: "20px" }}
                />
                <p className="ml-3 text-sm text-[#b5bfc3]">
                  Type in to Search...
                </p>
              </div>
              <div className="flex w-2/3 justify-center">
                <FontAwesomeIcon
                  icon={faHouse}
                  style={{ height: "20px", width: "20px" }}
                />
              </div>
              <div className="flex w-1/6 items-center justify-end">
                <div className="h-8 w-8 rounded-full border-2 border-[#4ca8f6]"></div>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  style={{ height: "20px", width: "20px", marginLeft: "10px" }}
                />
              </div>
            </div>
            <div className="flex flex-grow flex-col rounded-br-lg bg-gray-100 p-6">
              <div className="flex h-16 justify-between">
                <div className="flex w-1/3 items-center justify-between">
                  <p className="text-3xl text-site-purple-r">Contacts</p>
                  <p className="-ml-20 text-sm text-[#b5bfc3]">14,323 Total</p>
                  <p className="text-sm text-[#b5bfc3]">
                    Sort by:{" "}
                    <span className="text-[#828586]">Date Created</span>
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
