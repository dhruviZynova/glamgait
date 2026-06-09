import React from "react";
import { Loader2 } from "lucide-react";

export default function ButtonLoader({ size = 16, className = "" }) {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin text-current inline-block flex-shrink-0 ${className}`} 
    />
  );
}
