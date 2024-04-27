import Head from "next/head";
import { type ReactNode, useEffect, useState } from "react";
import {
  type IconDefinition,
  faHouse,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faCaretDown,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";
import { useSetContacts, useSetContactsLoading } from "~/store/AppStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Layout({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const setContacts = useSetContacts();
  const setContactsLoading = useSetContactsLoading();
  const router = useRouter();
  const {
    data: contacts,
    isLoading: contactsLoading,
    error: contactsError,
  } = api.contacts.getAll.useQuery();

  useEffect(() => {
    if (contacts) {
      setContacts(contacts);
    }
    setContactsLoading(contactsLoading);
  }, [contacts, setContacts]);

  if (contactsError)
    toast.error("Error retrieving contacts, please try again later!");

  const NavIcon = (props: {
    icon: IconDefinition;
    openOnClick?: boolean;
    title: string;
    link?: string;
  }) => {
    return (
      <div
        className={`flex h-14 items-center overflow-x-hidden text-[#8099a7] transition ease-in-out hover:bg-site-purple-l hover:text-site-purple-r
        ${navOpen ? "w-56" : "w-14"} ${props.openOnClick ? "rounded-tl-xl" : ""}
        `}
        onClick={() =>
          props.openOnClick
            ? setNavOpen(!navOpen)
            : props.link
              ? router.push(props.link)
              : null
        }
      >
        <div className="absolute flex h-14 w-14 items-center justify-center">
          <FontAwesomeIcon
            icon={props.icon}
            style={{ height: "20px", width: "20px" }}
          />
        </div>
        {navOpen && <p className="pl-14">{props.title}</p>}
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
      <main
        className={`flex h-screen flex-col items-center justify-center bg-gradient-to-bl from-site-blue-r to-site-purple-r p-5 font-sans ${inter.variable}`}
      >
        <div className="flex h-full w-full flex-row rounded-lg bg-white">
          <div
            className={`flex flex-col transition-all delay-100 ease-in-out ${navOpen ? "w-56" : "w-14"}`}
          >
            <NavIcon icon={faBars} openOnClick={true} title="Settings" />
            <NavIcon icon={faUserGroup} title="Contacts" link="/contacts" />
            <NavIcon
              icon={faUserPlus}
              title="Add Contact"
              link="/contact/new"
            />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex h-14 w-full items-center rounded-r-lg px-6 text-[#8099a7]">
              <div className="flex w-1/6 items-center">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{ height: "20px", width: "20px" }}
                />
                <p className="ml-3 text-sm text-[#b5bfc3]">
                  Type in to Search...
                </p>
              </div>
              <div className="pointer flex w-2/3 cursor-pointer justify-center hover:text-site-purple-r">
                <FontAwesomeIcon
                  icon={faHouse}
                  style={{ height: "20px", width: "20px" }}
                  onClick={() => router.push("/")}
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
            <div className="flex h-full flex-col overflow-hidden rounded-br-lg bg-gray-100 p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
