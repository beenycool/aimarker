"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";

export const EnhancedAlert = ({ success, error, onRetryAction }) => {
  if (!success && !error) return null;

  if (success) {
    return (
      <Alert className="mb-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-300 ml-2">Success</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400 ml-2">
          {success.message}
        </AlertDescription>
      </Alert>
    );
  }

  // For error messages
  const isApiError = error.type === 'api_error' || error.message?.includes('API') || error.message?.includes('backend');
  const isRateLimited = error.type?.startsWith('rate_limit') || error.message?.includes('rate limit') || error.message?.toLowerCase().includes('too many requests');
  
  let title = 'Error';
  if (isApiError) title = 'API Error';
  else if (error.type === 'rate_limit_with_fallback') title = 'Rate Limited (Fallback Available)';
  else if (error.type === 'rate_limit_wait') title = 'Rate Limited (Please Wait)';
  else if (isRateLimited) title = 'Rate Limited';
  
  return (
    <Alert className={`mb-4 ${
      isRateLimited 
        ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900' 
        : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
    }`}>
      {isRateLimited 
        ? <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        : <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      }
      <AlertTitle className={`${
        isRateLimited 
          ? 'text-amber-800 dark:text-amber-300' 
          : 'text-red-800 dark:text-red-300'
        } ml-2 flex items-center gap-2`}
      >
        {title}
        {error.code && <span className="text-xs opacity-75">({error.code})</span>}
      </AlertTitle>
      <AlertDescription className={`${
        isRateLimited 
          ? 'text-amber-700 dark:text-amber-400' 
          : 'text-red-700 dark:text-red-400'
        } ml-2 flex flex-col gap-2`}
      >
        <span>{error.message}</span>
        
        {isApiError && (
          <span className="text-sm">
            The backend API service may be offline or starting up. This is normal as the server goes to sleep after periods of inactivity.
          </span>
        )}
        
        {/* Retry options based on error type */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {error.type === 'rate_limit_with_fallback' && error.fallbackModel && error.onRetryFallback && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300"
              onClick={() => error.onRetryFallback(error.fallbackModel)}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Try with a different model
            </Button>
          )}

          {error.type === 'rate_limit_wait' && error.waitTime && error.onRetry && (
             <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300"
              onClick={() => {
                toast.info(`Retrying in ${error.waitTime} seconds...`);
                setTimeout(() => error.onRetry(), error.waitTime * 1000);
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry in {error.waitTime}s
            </Button>
          )}

          {(error.type === 'api_error' || error.type === 'network' || error.type === 'timeout') && error.onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              className={`text-xs h-7 ${
                isRateLimited 
                  ? 'border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300' 
                  : 'border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 text-red-800 dark:text-red-300'
              }`}
              onClick={error.onRetry === true ? () => window.location.reload() : error.onRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Try with a different model
            </Button>
          )}
          
          {isApiError && onRetryAction && typeof onRetryAction.checkBackendStatus === 'function' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-300"
              onClick={() => onRetryAction.checkBackendStatus()}
            >
              <Zap className="h-3 w-3 mr-1" /> Check Server Status
            </Button>
            )}
          </div>
      </AlertDescription>
    </Alert>
  );
}; 