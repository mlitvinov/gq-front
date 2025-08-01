import React, { ReactNode } from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const style = {
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  borderRadius: "8px 8px 0 0",
  bgcolor: "white",
  boxShadow: 24,
  maxHeight: "90vh",
  zIndex: 99999999,
};

type DrawerProps = {
  title?: string;
  open: boolean;
  children: ReactNode;
  onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
};
export default function Drawer({ title = "", children, open, onClose }: DrawerProps) {
  return (
    <Modal sx={{ zIndex: 10005 }} open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Button className="top-3 right-0 absolute" onClick={() => onClose({}, "backdropClick")}>
          <XIcon className="size-6 text-[#B1B1B1]" />
        </Button>
        <h2 className="p-4" id="modal-modal-title">
          {title}
        </h2>
        <div className="overflow-hidden h-full">{children}</div>
      </Box>
    </Modal>
  );
}
