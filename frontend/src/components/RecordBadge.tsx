import { X } from "lucide-react";

const RecordBadge = ({
  name,
  onRemove,
}: {
  name: string;
  onRemove?: (ev: React.MouseEvent<SVGSVGElement>) => void;
}) => {
  return (
    <div
      title={name}
      className="flex items-center gap-2 flex-nowrap border border-gray-300 px-2 py-1 text-sm bg-gray-100 rounded-l-full rounded-r-full cursor-pointer hover:bg-gray-200"
    >
      <div className="rounded-full p-3 border-gray-300 bg-gray-200 text-gray-600 w-6 h-6 flex items-center justify-center">
        {name[0].toUpperCase()}
      </div>
      <div className="max-w-32 overflow-hidden whitespace-nowrap text-ellipsis ">
        {name}
      </div>
      <X
        className="w-4 h-4 text-gray-500 cursor-pointer"
        onClick={(ev) => onRemove?.(ev)}
      />
    </div>
  );
};

export default RecordBadge;
