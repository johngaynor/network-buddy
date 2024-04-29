import type { ReactNode } from "react";
import { LoadingSpinner } from "../loading";

export const Modal = ({
  children,
  header,
  loadingState,
}: {
  children: ReactNode;
  header: string;
  loadingState: boolean;
}) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-1/2">
          {/*content*/}
          <div className="flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-center rounded-t p-5">
              <h3 className="text-3xl">{header}</h3>
            </div>
            {/*body*/}
            {loadingState ? <LoadingSpinner size={20} /> : null}
            {children}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
