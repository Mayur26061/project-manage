import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/useAuth";

const ChangePasswordDialog = () => {
  const [old, setOld] = useState("");
  const [newpass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const onSaveChanges = async () => {
    const obj: { confirm?: string; newpass?: string } = {};

    if (old && newpass && old === newpass) {
      obj.newpass = "Same as Old password";
    }
    if (confirm && newpass !== confirm) {
      obj.confirm = "Password didn't match";
    }
    setErrors(obj);
    if (Object.keys(obj).length !== 0) {
      return;
    }
    try {
      await axios.post("/api/user/change-password", {
        oldPassword: old,
        newPassword: newpass,
        confirmPassword: confirm,
      });
      logOut();
      navigate({
        to: "/signin",
      });
    } catch (error) {
      console.error("Error changing password:", error);
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOld("");
        setNewPass("");
        setConfirm("");
        setErrors({});
        setOpen((open) => !open);
      }}
    >
      <DialogTrigger asChild>
        <span>Change Password</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <label htmlFor="oldPassword">Old Password</label>
            <Input
              id="oldPassword"
              type="password"
              autoComplete="false"
              className="col-span-3"
              value={old}
              onChange={(ev) => setOld(ev.target.value.trim())}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="newPassword">New Password</label>
            <Input
              id="newPassword"
              type="password"
              className="col-span-3"
              value={newpass}
              onChange={(ev) => setNewPass(ev.target.value.trim())}
            />
            {errors.newpass && (
              <div className="bg-red-200 text-red-500 gap-3 p-1 flex rounded">
                <AlertCircle /> {errors.newpass}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <Input
              id="confirmPassword"
              type="password"
              className="col-span-3"
              value={confirm}
              onChange={(ev) => setConfirm(ev.target.value.trim())}
            />
            {errors.confirm && (
              <div className="bg-red-200 text-red-500 gap-3 p-1 flex">
                <AlertCircle /> {errors.confirm}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          {/* <DialogClose asChild> */}
          <Button
            onClick={onSaveChanges}
            disabled={!newpass || !old || !confirm}
          >
            Save Changes
          </Button>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
