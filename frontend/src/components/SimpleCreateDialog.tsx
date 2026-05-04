import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface SimpleCreateDialogProps {
  onSave: (name: string) => void;
  children: React.ReactNode;
  title: string;
}
export function SimpleCreateDialog({
  children,
  onSave,
  title,
}: SimpleCreateDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input ref={nameInputRef} id="name" placeholder="Enter name" autoComplete="off" />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                const name = nameInputRef.current?.value || "";
                onSave(name.trim());
              }}
            >
              Save
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SimpleCreateDialog;
