import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AI_MODELS } from '../constants';
import { MathMarkdown } from './MathMarkdown';

// Enhanced Bulk Item Preview Dialog component
export const BulkItemPreviewDialog = ({ open, onOpenChange, item, onClose }) => {
  if (!item) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Item {item.itemIndex + 1} Details</DialogTitle>
          <DialogDescription>
            Full question, answer and feedback details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="border-b pb-2">
            <h3 className="font-medium text-lg">Question</h3>
            <p className="mt-1">{item.question}</p>
          </div>
          
          <div className="border-b pb-2">
            <h3 className="font-medium text-lg">Answer</h3>
            <p className="mt-1">{item.answer}</p>
          </div>
          
          <div className="border-b pb-2">
            <h3 className="font-medium text-lg">Feedback</h3>
            {item.error ? (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{item.error}</AlertDescription>
              </Alert>
            ) : (
              <div className="mt-1 prose prose-sm dark:prose-invert max-w-none">
                <MathMarkdown>{item.feedback}</MathMarkdown>
              </div>
            )}
          </div>
          
          {!item.error && (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Grade:</span>
                <div className="inline-flex items-center justify-center h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-full shadow-md">
                  {item.grade || 'N/A'}
                </div>
              </div>
              
              {item.achievedMarks && item.totalMarks && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Marks:</span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                    {item.achievedMarks}/{item.totalMarks}
                  </span>
                </div>
              )}
              
              {item.modelName && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Model:</span> {AI_MODELS.find(m => m.value === item.modelName)?.label || item.modelName}
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 