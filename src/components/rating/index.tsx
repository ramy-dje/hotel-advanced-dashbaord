// components/ui/rating.tsx
"use client";

import { useState } from "react";
import { HiStar } from "react-icons/hi";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

interface RatingProps {
  initialRating: number;
  onRatingChange: (newRating: number) => void;
  maxStars?: number; // Optional: default to 6
  disabled?: boolean;
  className?: string; 
}

const Rating = ({ initialRating, onRatingChange, maxStars = 5, disabled = false, className }: RatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentRating = hoverRating || initialRating;

  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <HiStar
            key={starValue}
            className={cn(
              "cursor-pointer h-10 w-10 text-gray-300 transition-colors duration-200",
              (currentRating >= starValue) && "text-yellow-400",
              disabled ? "cursor-not-allowed opacity-70" : "hover:text-yellow-500",  className
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

export default Rating;