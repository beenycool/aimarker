"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { HelpCircle, Keyboard } from "lucide-react";

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
        {backendStatus && (
          <div className="hidden sm:flex items-center space-x-1">
            <div className={`h-2 w-2 rounded-full ${
              backendStatus === 'online' ? 'bg-green-500' :
              backendStatus === 'rate_limited' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}></div>
            <div className="text-xs text-muted-foreground">{
              backendStatus === 'online' ? 'API Connected' :
              backendStatus === 'rate_limited' ? 'API Rate Limited' :
              'API Offline'
            }</div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
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