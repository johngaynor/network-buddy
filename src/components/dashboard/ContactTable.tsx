import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

type Highlight = {
  highlight: string;
};

type Interaction = {
  title: string;
  location: string;
  date: Date;
  Highlights: Highlight[];
};

type Contact = {
  id: number;
  name: string;
  affiliation: string;
  notes: string;
  position: string;
  company: string;
  lastUpdated: Date;
  Interactions: Interaction[];
};

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
  columnHelper.accessor("Interactions", {
    header: () => "RECENT ACTIVITY",
    cell: (info) => {
      const interactions = info.getValue();
      if (interactions.length === 0) {
        return "--"; // Handle case when there are no interactions
      }

      const sorted = interactions.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );
      const recent = sorted[0];
      return recent?.title;
    },
    size: 90,
  }),
  columnHelper.accessor("Interactions", {
    header: () => "ACTIVITY DATE",
    id: "activity_date",
    cell: (info) => {
      const interactions = info.getValue();
      if (interactions.length === 0) {
        return "--"; // Handle case when there are no interactions
      }

      const sorted = interactions.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );
      const recent = sorted[0];
      const convertedDate = DateTime.fromJSDate(
        recent?.date ?? new Date(),
      ).toFormat("MMMM dd, yyyy");
      return `${convertedDate}`;
    },
    size: 90,
  }),
];

const ContactTable = ({ data }: { data: Contact[] }) => {
  const router = useRouter();
  const table = useReactTable({
    data: data ?? [],
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
            className="h-12 rounded-xl border-y-8 border-gray-100 bg-white text-[#999]"
            onClick={() => router.push(`/contact/${row.original.id}`)}
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
  );
};

export default ContactTable;
