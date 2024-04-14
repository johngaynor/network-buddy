import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DefaultContactPageData } from "../defaultData/contact";

type LoadingPageContact = {
  name: string;
  affiliation: string;
  position: string;
  company: string;
  recentActivity: string;
  activityDate: string;
};

export const LoadingSpinner = (props: { size?: number }) => {
  return (
    <div className="absolute h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm">
        <div role="status">
          <svg
            aria-hidden="true"
            className="animate-spin fill-slate-300 text-slate-200 dark:text-slate-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.size ?? 16}
            height={props.size ?? 16}
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
export const ContactLoadingPage = () => {
  const columnHelper = createColumnHelper<LoadingPageContact>();

  const columns = [
    columnHelper.accessor("name", {
      header: () => "NAME",
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
    columnHelper.accessor("recentActivity", {
      header: () => "RECENT ACTIVITY",
      cell: (info) => info.renderValue(),
      size: 90,
    }),
    columnHelper.accessor("activityDate", {
      header: () => "ACTIVITY DATE",
      id: "activity_date",
      cell: (info) => info.renderValue(),
      size: 90,
    }),
  ];

  const table = useReactTable({
    data: DefaultContactPageData,
    // data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="relative h-full w-full">
      <LoadingSpinner size={40} />
      <table className="mt-5 w-full">
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
    </div>
  );
};
