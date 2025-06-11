import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Share2, Copy, Mail, Twitter, Facebook, Download, Printer, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MathMarkdown } from './MathMarkdown';
import { shareFeedback, saveFeedbackAsPdf, printFeedback } from '../utils';

// Enhanced Feedback UI component
export const EnhancedFeedback = ({ 
  feedback, 
  grade, 
  modelName, 
  achievedMarks, 
  totalMarks, 
  hasMarkScheme,
  onAskFollowUp = () => {},
  followUpEnabled = true
}) => {
  const feedbackRef = useRef(null);
  const [shareMessage, setShareMessage] = useState(null);
  
  const handleShare = (method) => {
    const message = shareFeedback(feedback, method, grade);
    setShareMessage(message);
    setTimeout(() => setShareMessage(null), 2000);
  };
  
  const handleSaveAsPdf = async () => {
    const message = await saveFeedbackAsPdf(feedbackRef, grade);
    setShareMessage(message);
    setTimeout(() => setShareMessage(null), 2000);
  };
  
  const handlePrint = () => {
    const message = printFeedback(feedbackRef);
    setShareMessage(message);
    setTimeout(() => setShareMessage(null), 2000);
  };
  
  return (
    <div className="relative">
      {shareMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded text-sm z-10"
        >
          {shareMessage}
        </motion.div>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {grade && (
            <div className="flex flex-col items-start gap-2 mr-2">
              <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-md shadow-md">
                Grade: {grade}
              </div>
              {achievedMarks && totalMarks && (
                <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500 text-white font-bold rounded-md shadow-md">
                  Mark: {achievedMarks}/{totalMarks}
                </div>
              )}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              Feedback
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                by {modelName}
              </span>
              {hasMarkScheme && (
                <Badge variant="outline" className="ml-2 px-1.5 py-0 text-[10px] bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50">
                  Mark Scheme Analysis
                </Badge>
              )}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Try a different model</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share feedback</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Share Feedback</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleShare('clipboard')}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy to clipboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('email')}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Share via email</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('twitter')}>
                <Twitter className="mr-2 h-4 w-4" />
                <span>Share on Twitter</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('facebook')}>
                <Facebook className="mr-2 h-4 w-4" />
                <span>Share on Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveAsPdf}>
                <Download className="mr-2 h-4 w-4" />
                <span>Save as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print feedback</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div 
        ref={feedbackRef}
        className="prose prose-sm dark:prose-invert prose-p:my-2 prose-h1:text-xl prose-h1:my-3 prose-h2:text-lg prose-h2:my-3 prose-h3:text-base prose-h3:font-semibold prose-h3:my-2.5 max-w-none bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <MathMarkdown>{feedback}</MathMarkdown>
      </div>

      {followUpEnabled && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <div>
              <h4 className="text-base font-semibold mb-1 flex items-center">
                <HelpCircle className="h-4 w-4 mr-1.5 text-primary" />
                Need more help understanding this feedback?
              </h4>
              <p className="text-sm text-muted-foreground">
                Ask a follow-up question about anything you didn't understand in the feedback.
              </p>
            </div>
            <Button
              onClick={onAskFollowUp}
              className="whitespace-nowrap"
            >
              Ask Follow-Up Question
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 