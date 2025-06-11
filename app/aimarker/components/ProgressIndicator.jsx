import { Loader2 } from "lucide-react";

// Add a progress indicator component
export const ProgressIndicator = ({ loading, progress }) => {
  // Don't show if not loading or if progress is empty (stream finished)
  if (!loading || !progress) return null;
  
  return (
    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col items-center gap-2 min-w-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm font-medium">{progress || "Processing..."}</p>
      </div>
    </div>
  );
}; 