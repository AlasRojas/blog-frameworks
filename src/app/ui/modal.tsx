
"use client";

import { Modal, ModalBody, ModalHeader } from "flowbite-react";

export default function ModalComponent({ children, isOpen, handleClose }: { children: React.ReactNode, isOpen: boolean, handleClose: (bool: boolean)=>void }) {
  const closeModal = () => {
    handleClose(false);
  }

  return (
    <>
      <Modal show={isOpen} onClose={closeModal}>
        <ModalHeader>Terms of Service</ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </Modal>
    </>
  );
}
/*
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
*/