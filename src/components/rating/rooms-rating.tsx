// components/ui/rating.tsx
"use client";

import { useState } from "react";
import { FaTrophy } from "react-icons/fa6";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

interface RatingProps {
  initialRating: number;
  className : string;
  onRatingChange: (newRating: number) => void;
  maxStars?: number;
  disabled?: boolean;
}

const RoomsRating = ({ initialRating, onRatingChange, maxStars = 3, disabled = false, className }: RatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentRating = hoverRating || initialRating;

  return (
    <div className="flex items-center justify-center w-full">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaTrophy
            key={starValue}
            className={cn(className, "h-10 w-10",
              "cursor-pointer text-gray-300 transition-colors duration-200",
              (currentRating >= starValue) && "text-yellow-400",
              disabled ? "cursor-not-allowed opacity-70" : "hover:text-yellow-500"
            )}
            onClick={() => !disabled && onRatingChange(starValue)}
            onMouseEnter={() => !disabled && setHoverRating(starValue)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            // size={20}
          />
        );
      })}
    </div>
  );
};

export default RoomsRating;