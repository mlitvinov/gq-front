import React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const style = {
  position: "absolute",
  bottom: "0",
  left: "0",
  display: "flex",
  flexDirection: "column",
  width: "fit-content",
  borderRadius: "8px 8px 0 0",
  bgcolor: "white",
  boxShadow: 24,
  maxHeight: "80vh",
  zIndex: 99999999,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        sx={{ zIndex: 10005 }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button className="top-3 right-0 absolute" onClick={handleClose}>
            <XIcon className="size-6 text-[#B1B1B1]" />
          </Button>
          <h2 className="p-4" id="modal-modal-title"></h2>
          <div className="overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col">
              <p id="modal-modal-description">
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </p>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
