import { useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

export const AddModal = (props: {
  addModal: boolean;
  setAddModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    affiliation: "",
    position: "",
    company: "",
    notes: "",
  });

  console.log(formData);

  const { mutate, isPending } = api.contacts.newContact.useMutation({
    onSuccess: () => {
      setFormData({
        name: "",
        affiliation: "",
        position: "",
        company: "",
        notes: "",
      });
      // void api.contacts.getAll.invalidate();
    },
    onError: () => {
      toast.error("Failed to add new contact, please try again later!");
    },
  });

  const handleSubmit = () => {
    // props.setAddModal(false)
    mutate({
      name: "TEST",
      affiliation: "TEST",
      position: "TEST",
      company: "TEST",
      notes: "TEST",
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-3xl">
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
              <h3 className="text-3xl font-semibold">Modal Title</h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                onClick={() => props.setAddModal(false)}
              >
                <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto p-6">
              <p className="text-blueGray-500 my-4 text-lg leading-relaxed">
                Test body material
              </p>
            </div>
            {/*footer*/}
            <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => props.setAddModal(false)}
              >
                Close
              </button>
              <button
                className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
