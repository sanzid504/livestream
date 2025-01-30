import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

export default function Modal({ children, focus, isOpen, closeModal, size, padding }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
        initialFocus={focus}
      >
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />

        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* This overlay is redundant with the above, consider removing if not needed */}
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* Invisible spacer element to aid in centering the modal content */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full ${size || "max-w-lg"} ${padding || "p-6 rounded-2xl"} my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl`}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}