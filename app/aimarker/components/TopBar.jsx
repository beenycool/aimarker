"use client";
import { Button } from "@/components/ui/button";
import { Keyboard, HelpCircle } from "lucide-react";
import { BackendStatusIndicator } from "./BackendStatusIndicator";

export const TopBar = ({ 
  version = "2.1.0", 
  backendStatus, 
  requestLimits, 
  onShowGuide, 
  onShowKeyboardShortcuts 
}) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between py-2 px-4 border-b border-border bg-card shadow-sm backdrop-blur-sm bg-opacity-90">
      <div className="flex items-center space-x-4">
        <div className="font-semibold text-xl">AI GCSE Marker</div>
        <div className="text-xs text-muted-foreground hidden sm:block">v{version}</div>
        <div className="flex items-center gap-2">
          <BackendStatusIndicator status={backendStatus} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onShowKeyboardShortcuts}
        >
          <Keyboard size={18} />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onShowGuide}
        >
          <HelpCircle size={18} />
          <span className="sr-only">Help</span>
        </Button>
      </div>
    </div>
  );
}; 