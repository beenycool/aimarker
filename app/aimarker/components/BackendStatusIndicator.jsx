"use client";
import { AlertTriangle, CheckCircle, Loader2, Clock } from "lucide-react";

export const BackendStatusIndicator = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'checking':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'waking_up':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'offline':
      case 'error':
      case 'timeout':
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Backend Online';
      case 'checking':
        return 'Checking...';
      case 'waking_up':
        return 'Starting Up...';
      case 'offline':
        return 'Backend Offline';
      case 'error':
        return 'Connection Error';
      case 'timeout':
        return 'Connection Timeout';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-700 dark:text-green-400';
      case 'checking':
        return 'text-blue-700 dark:text-blue-400';
      case 'waking_up':
        return 'text-amber-700 dark:text-amber-400';
      case 'offline':
      case 'error':
      case 'timeout':
      default:
        return 'text-red-700 dark:text-red-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon()}
      <span className={`text-xs font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
}; 