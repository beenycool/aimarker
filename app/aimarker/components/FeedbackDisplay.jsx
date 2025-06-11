import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AI_MODELS } from '../constants';
import { ProgressIndicator } from './ProgressIndicator';
import { ModelThinkingBox } from './ModelThinkingBox';
import { EnhancedFeedback } from './EnhancedFeedback';

// Component to organize the feedback tab content
export const FeedbackDisplay = ({ 
  loading, 
  feedback, 
  grade, 
  selectedModel, 
  modelThinking, 
  achievedMarks, 
  totalMarks, 
  processingProgress,
  setActiveTab,
  markScheme,
  onAskFollowUp,
  followUpEnabled = true
}) => {
  // Get the model name for display
  const modelName = AI_MODELS.find(m => m.value === selectedModel)?.label || 'AI';
  
  return (
    <div className="relative">
      {/* Main loading indicator */}
      <ProgressIndicator loading={loading} progress={processingProgress} />
      
      {/* Thinking Box for specific models */}
      {(loading || modelThinking) && selectedModel === "microsoft/mai-ds-r1:free" && (
        <ModelThinkingBox thinking={modelThinking} loading={loading} />
      )}
      
      {/* Feedback content when available */}
      {feedback ? (
        <EnhancedFeedback 
          feedback={feedback} 
          grade={grade} 
          modelName={modelName}
          achievedMarks={achievedMarks}
          totalMarks={totalMarks}
          hasMarkScheme={!!markScheme}
          onAskFollowUp={onAskFollowUp}
          followUpEnabled={followUpEnabled}
        />
      ) : loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium">Generating Feedback...</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Please wait while the AI analyzes your answer. This may take up to 90 seconds depending on the model selected.
          </p>
        </div>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-muted/20">
          <div className="mb-4 p-3 rounded-full bg-muted">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No Feedback Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Enter your question and answer in the Answer tab, then click "Mark Answer" to receive AI feedback and a GCSE grade.
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveTab("answer")}
            className="text-sm"
          >
            Go to Answer Tab
          </Button>
        </div>
      )}
    </div>
  );
}; 