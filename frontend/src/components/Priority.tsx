import { StarIcon } from "lucide-react";
import React from "react";

type Props = {
  priority: number;
  onSelect: (priority: number) => void;
};

const Priority = ({ priority, onSelect }: Props) => {
  const [hoveredStar, setHoveredStar] = React.useState<number>(0);
  const handleSelect = (i: number) => {
        if (i + 1 === priority) {
          onSelect(0);
          return;
        }
        onSelect(i + 1);
      }

  return (
    <div className="flex mt-3" aria-label="Priority">
      {Array.from({ length: 3 }).map((_, i) => (
        <StarIcon
          onKeyDown={(ev) => {
            if (ev.key !== "Enter") {
              return
            }
            ev.preventDefault();
            handleSelect(i);

          }}
          onMouseEnter={() => setHoveredStar(i + 1)}
          onMouseLeave={() => setHoveredStar(0)}
          width={30}
          key={i}
          size={20}
          strokeWidth={1}
          fill={
            hoveredStar >= i + 1
              ? "oklch(79.5% 0.184 86.047)"
              : !hoveredStar && i + 1 <= priority
                ? "oklch(79.5% 0.184 86.047)"
                : "none"
          }
          className={
            hoveredStar >= i + 1
              ? "text-yellow-500"
              : !hoveredStar && i + 1 <= priority
                ? "text-yellow-500"
                : "text-gray-400"
          }
          onClick={() => {
            handleSelect(i);
          }}
        />
      ))}
    </div>
  );
};

export default Priority;
