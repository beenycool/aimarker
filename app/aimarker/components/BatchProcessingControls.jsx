import { RefreshCw, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// BatchProcessingControls component with parallelism setting
export const BatchProcessingControls = ({ 
  isProcessing, 
  progress, 
  onPause, 
  onResume, 
  onCancel, 
  isPaused,
  parallelism,
  onParallelismChange
}) => {
  return (
    <div className="flex flex-col space-y-3 mt-2 mb-4">
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${Math.round((progress.processed / progress.total) * 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Processing {progress.processed} of {progress.total} items</span>
        <span>{Math.round((progress.processed / progress.total) * 100)}% complete</span>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="parallelism" className="text-xs whitespace-nowrap">Parallel Tasks:</Label>
          <Select
            value={parallelism.toString()}
            onValueChange={(value) => onParallelismChange(parseInt(value))}
            disabled={isProcessing}
          >
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue placeholder={parallelism} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          {isPaused ? (
            <Button size="sm" variant="outline" onClick={onResume} disabled={!isProcessing}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Resume
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onPause} disabled={!isProcessing}>
              <Pause className="mr-1.5 h-3.5 w-3.5" />
              Pause
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onCancel} disabled={!isProcessing}>
            <X className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}; 