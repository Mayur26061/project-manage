import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
type Props = {
  data: { id: number; name: string } | null;
  setData: (data: { id: number; name: string }) => void;
  model: "project" | "task" | "user";
  inputClassName?: string;
  isMany?: boolean;
};

const RecordSelector = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dataName, setDataName] = React.useState("");
  const [dropdownData, setDropdownData] = React.useState<{
    isLoading: boolean;
    records: Array<{ id: number; name: string }>;
  }>({ isLoading: true, records: [] });

  const fetchData = async (title: string | undefined = "") => {
    try {
      const response = await axios.post(`/api/${props.model}/limited`, {
        offset: 0,
        title: title || "",
      });
      if (response.status === 200) {
        setDropdownData({ isLoading: false, records: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      setDropdownData({ isLoading: false, records: [] });
    }
  };

  useEffect(() => {
    // Fetch records
    if (open) {
      const debounceFetch = setTimeout(() => {
        fetchData(dataName);
      }, 300); // Debounce to avoid excessive calls
      return () => clearTimeout(debounceFetch);
    }
  }, [open, dataName]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.data?.name || "";
    }
  }, [props.data?.name]);

  const onSelectRecord = (recordId: number, dataName: string) => {
    console.log("Selected record ID:", recordId);
    props.setData({ id: recordId, name: dataName });
    if (!props.isMany) {
      inputRef.current!.value = dataName;
    } else {
      inputRef.current!.value = "";
    }
    setOpen(false);
  };

  const handleFocusOrClick = (ev: React.FocusEvent | React.MouseEvent) => {
    ev.preventDefault();
    setOpen(true);
    (ev.currentTarget as HTMLElement)?.focus();
  };

  return (
    <>
      <Input
        onFocus={handleFocusOrClick}
        // onClick={handleFocusOrClick}
        className={
          props.inputClassName ? props.inputClassName + " mt-2" : "mt-2"
        }
        type="text"
        ref={inputRef}
        placeholder="Start typing..."
        defaultValue={props.data?.name || ""}
        onChange={(ev) => {
          setOpen(true);
          setDataName(ev.target.value);
        }}
      />
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={() => {
            inputRef.current?.focus();
          }}
          className="min-w-5 max-w-64 p-1"
          align="center"
        >
          {dropdownData.records.map((rec) => (
            <div
              onClick={() => onSelectRecord(rec.id, rec.name)}
              key={rec.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {rec.name}
            </div>
          ))}
          {dropdownData.isLoading ? (
            <LoaderCircle className="mx-auto my-2" />
          ) : dropdownData.records.length === 0 ? (
            <div className="p-2 text-gray-500">No records found</div>
          ) : null}
        </PopoverContent>
      </Popover>
    </>
  );
};
export default RecordSelector;
