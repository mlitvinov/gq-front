import React, { ReactNode } from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const style = {
  position: "absolute",
  bottom: "0",
  left: "0",
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "flex-end",
  width: "100vw",
  borderRadius: "8px 8px 0 0",
  bgcolor: "white",
  boxShadow: 24,
  height: "fit-content",
  minHeight: "300px",
  maxHeight: "90vh",
  zIndex: 99999999,
};

type DrawerProps = {
  title?: string;
  open: boolean;
  children: ReactNode;
  onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
};
export default function Drawer({
  title = "",
  children,
  open,
  onClose,
}: DrawerProps) {
  return (
    <Modal
      sx={{ zIndex: 10005, left: 0, top: 0, right: 0, bottom: 0 }}
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Button
          className="top-3 right-0 absolute"
          onClick={() => onClose({}, "backdropClick")}
        >
          <XIcon className="size-6 text-[#B1B1B1]" />
        </Button>
        {/*   <h2 className="p-4" id="modal-modal-title">
          {title}
        </h2> */}
        {/* <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden pb-12"> */}
        {children}
        {/*  </div> */}
      </Box>
    </Modal>
  );
}
