import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
// import { api } from "~/utils/api";

export const ContactModal = (props: {
  setContactModal: Dispatch<SetStateAction<boolean>>;
}) => {
  // const ctx = api.useUtils();
  const router = useRouter();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-1/2">
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            <div className="flex items-center justify-center rounded-t p-5">
              <h3 className="text-3xl">Zach Canterbury</h3>
            </div>
            <div className="relative flex flex-col p-6">
              <div className="flex w-full flex-row pb-4">
                <div className="flex w-1/3 flex-col">
                  <label>Affiliation</label>
                  <p className="mt-1 text-xl font-semibold">Met at CodeMash</p>
                </div>
                <div className="flex w-2/3 flex-col">
                  <label>Occupation</label>
                  <p className="mt-1 text-xl font-semibold">
                    Software Developer at Microsoft
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-row pb-4">
                <div className="flex w-full flex-col">
                  <label>General Notes</label>
                  <p className="mt-1 text-xl font-semibold">
                    Ball State grad, interned with E&B in 2012
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-row pb-4">
                <div className="flex w-1/3 flex-col">
                  <label>Last Activity</label>
                  <p className="mt-1 text-xl font-semibold">
                    Coffee chat on April 04, 2024
                  </p>
                </div>
                <div className="flex w-2/3 flex-col">
                  <label>Activity Highlights</label>
                  <p className="mt-1 text-xl font-semibold">
                    - Early years in career are going to be a grind
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    - Still making cold calls in his new role
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end rounded-b p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => props.setContactModal(false)}
              >
                Close
              </button>
              <button
                className="mb-1 mr-1 rounded bg-site-blue-r px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                onClick={() => router.push(`/contact/1`)}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
