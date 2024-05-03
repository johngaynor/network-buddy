import { type Contact } from "contact";
import { type NextPage } from "next";
import { useState } from "react";
import { ContactTableLoadingPage } from "~/components/loading";
import { AddContactForm } from "~/components/global/AddContactForm";
import { useContactsLoading, useContacts } from "~/store/AppStore";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { ContactModal } from "~/components/dashboard/ContactModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFilter,
  faUserPlus,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { useWindowDimensions } from "~/components/hooks/useWindowDimensions";
import { useRouter } from "next/navigation";

// table scaffolding
const columnHelper = createColumnHelper<Contact>();
const bigColumns = [
  columnHelper.accessor("name", {
    id: "name",
    header: () => "NAME",
    cell: (info) => info.getValue(),
    size: 150,
  }),
  columnHelper.accessor("affiliation", {
    id: "affiliation",
    header: () => "AFFILIATION",
    cell: (info) => {
      const value = info.renderValue();
      if (value) {
        return value.substring(0, 10) + (value.length > 10 ? "..." : "");
      } else {
        return "";
      }
    },
  }),
  columnHelper.accessor("position", {
    id: "position",
    header: () => "POSITION",
    cell: (info) => {
      const value = info.renderValue();
      if (value) {
        return value.substring(0, 20) + (value.length > 20 ? "..." : "");
      } else {
        return "";
      }
    },
  }),
  columnHelper.accessor("company", {
    id: "company",
    header: () => "COMPANY",
    cell: (info) => {
      const value = info.renderValue();
      if (value) {
        return value.substring(0, 20) + (value.length > 20 ? "..." : "");
      } else {
        return "";
      }
    },
  }),
  columnHelper.accessor("intTitle", {
    id: "int_title",
    header: () => "RECENT ACTIVITY",
    cell: (info) => {
      const title = info.getValue();
      if (!title) {
        return "--";
      } else return title;
    },
    size: 90,
  }),
  columnHelper.accessor("intDate", {
    header: () => "ACTIVITY DATE",
    id: "int_date",
    cell: (info) => {
      const date = info.getValue();
      if (!date) {
        return "--";
      } else
        return DateTime.fromJSDate(date ?? new Date()).toFormat(
          "MMMM dd, yyyy",
        );
    },
    size: 90,
  }),
];
const smallColumns = [
  columnHelper.accessor("name", {
    id: "name",
    header: () => "NAME",
    cell: (info) => info.getValue(),
    size: 150,
  }),
];

const ContactTable = (props: { contacts: Contact[] }) => {
  const [contactModal, setContactModal] = useState<null | number>(null);
  const { contacts } = props;
  const router = useRouter();

  const { width } = useWindowDimensions();

  const useMobile = width > 1200 ? false : true;

  const sortedContacts = contacts.sort((a, b) => {
    const dateA = DateTime.fromJSDate(a.lastUpdated);
    const dateB = DateTime.fromJSDate(b.lastUpdated);
    return dateB.toMillis() - dateA.toMillis();
  });
  const table = useReactTable({
    data: sortedContacts ?? [],
    columns: useMobile ? smallColumns : bigColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!table) return "Error, no data to display";

  const handleClickRow = (id: number) => {
    if (useMobile) {
      router.push(`/contact/${id}`);
      // go to the contact page for this ID
    } else {
      setContactModal(id);
    }
  };

  return (
    <>
      {contactModal ? (
        <ContactModal
          contactModal={contactModal}
          setContactModal={setContactModal}
          contacts={contacts}
        />
      ) : null}
      <table className="mt-5 w-full p-6 md:p-0">
        <thead>
          {table.getHeaderGroups().map((headerGroup, i) => (
            <tr key={headerGroup.id + i}>
              {headerGroup.headers.map((header, i) => (
                <th
                  key={header.id + i}
                  className={`px-3 text-left text-sm text-[#b5bfc3] ${i === 0 ? "pl-10" : null}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id + i}
              className="h-12 cursor-pointer rounded-xl border-y-8 border-gray-100 bg-white text-[#999] hover:bg-gray-200"
              onClick={() => handleClickRow(row.original.id)}
            >
              {row.getVisibleCells().map((cell, i) => (
                <td
                  key={cell.id + i}
                  style={{ width: cell.column.getSize() }}
                  className={`p-3 ${i === 0 ? "pl-10" : null}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const HomePage: NextPage = () => {
  const [addModal, setAddModal] = useState<boolean>(false);
  const contacts = useContacts();
  const contactsLoading = useContactsLoading();
  const router = useRouter();

  const { width } = useWindowDimensions();

  const useMobile = width > 1200 ? false : true;

  const handleAddContact = () => {
    if (useMobile) {
      router.push("/contact/new");
    } else setAddModal(!addModal);
  };

  return (
    <>
      {addModal ? (
        <AddContactForm setAddModal={setAddModal} isModal={true} />
      ) : null}
      <div className="flex h-16 justify-between">
        <div className="flex items-center justify-between">
          <p className=" xs:text-3xl p-6 pr-4 text-2xl text-site-purple-r md:pl-0">
            Contacts
          </p>
          <p className="pt-2 text-sm text-[#b5bfc3]">{contacts.length} Total</p>
        </div>
        <div className="flex w-1/3 items-center justify-end">
          {/* <div className="hover:text-text-[#4ca8f6] flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-white text-[#8099a7] transition ease-in-out hover:bg-site-blue-l hover:text-[#4ca8f6]">
            <FontAwesomeIcon
              icon={faBars}
              style={{ height: "20px", width: "20px" }}
            />
          </div> */}
          {/* <div className="mx-1 flex h-10 w-20 cursor-pointer items-center justify-evenly rounded-md bg-white text-sm text-[#8099a7] transition ease-in-out hover:bg-[#ddf1fb] hover:text-[#4ca8f6]">
            <p>Filter</p>
            <FontAwesomeIcon
              icon={faFilter}
              style={{ height: "20px", width: "20px" }}
            />
          </div> */}
          <div
            className="mr-3 flex h-10 w-36 cursor-pointer items-center justify-evenly rounded-md bg-site-blue-r text-sm text-white sm:m-0"
            onClick={handleAddContact}
          >
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ height: "20px", width: "20px" }}
            />
            <p>Add Contact</p>
          </div>
          {/* <div className="mx-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-site-blue-l text-site-blue-r transition ease-in-out hover:bg-site-blue-r hover:text-white">
            <FontAwesomeIcon
              icon={faEllipsis}
              style={{ height: "20px", width: "20px" }}
            />
          </div> */}
        </div>
      </div>
      {!contacts || contactsLoading ? (
        <ContactTableLoadingPage />
      ) : (
        <ContactTable contacts={contacts} />
      )}
    </>
  );
};

export default HomePage;
