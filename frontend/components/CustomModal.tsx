import React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ModalProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  primaryActionText?: string;
  secondaryActionText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  disabled?: boolean;
};

const CustomModal: React.FC<ModalProps> = ({
  title = "Modal Title",
  description,
  open,
  onOpenChange,
  trigger,
  children,
  primaryActionText = "Save",
  secondaryActionText = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  disabled
}) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="py-0">{children}</div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
            <Button disabled={disabled} className="cursor-pointer disabled:opacity-50" onClick={onPrimaryAction}>{primaryActionText}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
