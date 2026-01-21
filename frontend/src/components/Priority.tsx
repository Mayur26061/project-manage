import { StarIcon } from "lucide-react";

type Props = {
  priority: number;
  onSelect: (priority: number) => void;
};

const Priority = ({ priority, onSelect }: Props) => {
  return (
    <div className="flex mt-3" aria-label="Priority">
      {Array.from({ length: 3 }).map((_, i) => (
        <StarIcon
        width={30}
          key={i}
          size={20}
          strokeWidth={1}
          fill={i + 1 <= priority ? "oklch(79.5% 0.184 86.047)" : "none"}
          className={
            "hover:text-yellow-500 text-gray-400" + (i + 1 <= priority ? " text-yellow-500" : "")
          }
          onClick={() => {
            if (i + 1 === priority) {
              onSelect(0);
              return;
            }
            onSelect(i + 1);
          }}
        />
      ))}
    </div>
  );
};

export default Priority;
