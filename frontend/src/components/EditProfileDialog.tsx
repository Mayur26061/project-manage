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
import { useAuth } from "@/lib/useAuth";
import axios from "axios";
import { useState } from "react";

type Props = {
  firstName: string;
  lastName: string;
};

export const EditProfileDialog = (props: Props) => {
  const [fname, setFname] = useState(props.firstName);
  const [lname, setLname] = useState(props.lastName);
  const { login } = useAuth();
  const onSaveName = async () => {
    try {
      const response = await axios.put("/api/users/update", {
        first_name: fname,
        last_name: lname,
      });
      if (response.status === 200) {
        login(response.data.user);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>Edit Profile</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="firstName" className="text-right">
              First Name
            </label>
            <Input
              id="firstName"
              value={fname}
              className="col-span-3"
              onChange={(e) => setFname(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="lastName" className="text-right">
              Last Name
            </label>
            <Input
              id="lastName"
              value={lname}
              className="col-span-3"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={onSaveName}>
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
