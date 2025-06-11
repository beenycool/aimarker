"use client";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";

export const QuickGuide = ({ onClose }) => {
  return (
    <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 p-3">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">Quick Guide</div>
          <div className="text-sm text-blue-600 dark:text-blue-400">How to use the GCSE AI Marker</div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 h-8 w-8 p-0 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="p-4">
        <ol className="space-y-2">
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">1</div>
            <p className="text-gray-700 dark:text-gray-300">Enter your question and answer in the text boxes.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">2</div>
            <p className="text-gray-700 dark:text-gray-300">Select the subject, exam board, and question type.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">3</div>
            <p className="text-gray-700 dark:text-gray-300">Click "Mark Answer" to get AI feedback.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">4</div>
            <p className="text-gray-700 dark:text-gray-300">Review the feedback and grade provided.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">5</div>
            <p className="text-gray-700 dark:text-gray-300">Optionally save, share or print your feedback.</p>
          </li>
        </ol>
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="font-medium text-base mb-3 text-gray-800 dark:text-gray-200">Quick Tips</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>Enter both the question and your full answer for accurate marking.</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>Select the correct subject and exam board for tailored feedback.</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>For image uploads, ensure the text is clear and readable.</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>The AI models are good, but always cross-reference with official materials.</span>
            </li>
             <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>Wait for the backend to wake up when you first visit the site (may take up to 60 seconds)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 