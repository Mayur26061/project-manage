import { X } from "lucide-react";

const RecordBadge = ({
  name,
  onRemove,
}: {
  name: string;
  onRemove?: () => void;
}) => {
  return (
    <div className="flex items-center gap-2 flex-nowrap border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100">
      <div className="rounded-full p-3 border-gray-300 bg-gray-200 text-gray-600 w-6 h-6 flex items-center justify-center">
        {name[0].toUpperCase()}
      </div>
      <span>{name}</span>
      <X className="w-4 h-4 text-gray-500 cursor-pointer" onClick={onRemove} />
    </div>
  );
};

export default RecordBadge;
