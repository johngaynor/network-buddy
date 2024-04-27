import { type Contact } from "contact";
import { type NextPage } from "next";
import { useState } from "react";
import { ContactTableLoadingPage } from "~/components/loading";
import { AddModal } from "~/components/dashboard/AddModal";
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

// table scaffolding
const columnHelper = createColumnHelper<Contact>();
const columns = [
  columnHelper.accessor("name", {
    header: () => "NAME",
    id: "name",
    cell: (info) => info.getValue(),
    size: 150,
  }),
  columnHelper.accessor("affiliation", {
    header: () => "AFFILIATION",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("position", {
    header: () => "POSITION",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("company", {
    header: () => "COMPANY",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("intTitle", {
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
    id: "activity_date",
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

const ContactTable = (props: { contacts: Contact[] }) => {
  const [contactModal, setContactModal] = useState<null | number>(null);
  const { contacts } = props;
  const table = useReactTable({
    data: contacts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "name",
          desc: true,
        },
      ],
    },
  });

  if (!table) return "Error, no data to display";

  return (
    <>
      {contactModal ? (
        <ContactModal
          contactModal={contactModal}
          setContactModal={setContactModal}
          contacts={contacts}
        />
      ) : null}
      <table className="mt-5">
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
              onClick={() => setContactModal(row.original.id)}
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

  return (
    <>
      {addModal ? <AddModal setAddModal={setAddModal} /> : null}
      <div className="flex h-16 justify-between">
        <div className="flex w-1/3 items-center justify-between">
          <p className="text-3xl text-site-purple-r">Contacts</p>
          <p className="-ml-20 text-sm text-[#b5bfc3]">14,323 Total</p>
          <p className="text-sm text-[#b5bfc3]">
            Sort by: <span className="text-[#828586]">Date Created</span>
          </p>
        </div>
        <div className="flex w-1/3 items-center justify-end">
          <div className="hover:text-text-[#4ca8f6] flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-white text-[#8099a7] transition ease-in-out hover:bg-site-blue-l hover:text-[#4ca8f6]">
            <FontAwesomeIcon
              icon={faBars}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
          <div className="mx-1 flex h-10 w-20 cursor-pointer items-center justify-evenly rounded-md bg-white text-sm text-[#8099a7] transition ease-in-out hover:bg-[#ddf1fb] hover:text-[#4ca8f6]">
            <p>Filter</p>
            <FontAwesomeIcon
              icon={faFilter}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
          <div
            className="flex h-10 w-36 cursor-pointer items-center justify-evenly rounded-md bg-site-blue-r text-sm text-white"
            onClick={() => setAddModal(!addModal)}
          >
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ height: "20px", width: "20px" }}
            />
            <p>Add Contact</p>
          </div>
          <div className="mx-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-site-blue-l text-site-blue-r transition ease-in-out hover:bg-site-blue-r hover:text-white">
            <FontAwesomeIcon
              icon={faEllipsis}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
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
