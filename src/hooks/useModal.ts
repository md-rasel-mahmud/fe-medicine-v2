import { useState } from 'react';

const useModal = () => {
  const [open, setOpen] = useState(false);

  // -> HANDLE MODAL OPEN
  const handleModalOpen = () => {
    setOpen(true);
  };

  // -> HANDLE MODAL CLOSE
  const handleModalClose = () => {
    setOpen(false);
  };

  return {
    open,
    handleModalOpen,
    handleModalClose,
  };
};

export default useModal;
