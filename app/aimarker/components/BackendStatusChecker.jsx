"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Zap } from "lucide-react";
import { useBackendStatus } from '../../aimarker-hooks';

export const BackendStatusChecker = ({ onStatusChange, getAPI_BASE_URL }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'error', 'rate_limited', 'waking_up'
  const [statusDetail, setStatusDetail] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [wakeupProgress, setWakeupProgress] = useState(0);
  const [wakeupAttempts, setWakeupAttempts] = useState(0);
  const wakeupTimerRef = useRef(null);
  const { checkBackendStatus } = useBackendStatus(getAPI_BASE_URL());
  
  const checkStatus = useCallback(async () => {
    console.log('[STATUS-CHECK] checkStatus function called');
    try {
      setStatus('checking');
      console.log('[STATUS-CHECK] Set status to checking, calling checkBackendStatus()');
      
      // Check if the backend is reachable
      const result = await checkBackendStatus();
      console.log('[STATUS-CHECK] checkBackendStatus returned:', result);
      setLastChecked(new Date().toLocaleTimeString());
      
      if (!result.ok) {
        // If it's a timeout, assume the server is waking up
        if (result.status === 'timeout') {
          setStatus('waking_up');
          setStatusDetail('Server is waking up...');
          setIsWakingUp(true);
          setWakeupProgress(0);
          
          // Start a progress timer for visual feedback - max 50 seconds for wakeup
          clearInterval(wakeupTimerRef.current);
          wakeupTimerRef.current = setInterval(() => {
            setWakeupProgress(prev => {
              const newProgress = prev + 2; // Increment by 2% every second
              if (newProgress >= 100) {
                clearInterval(wakeupTimerRef.current);
                return 100;
              }
              return newProgress;
            });
          }, 1000);
          
          // Schedule an automatic recheck after 10 seconds
          setTimeout(() => {
            checkStatus();
          }, 10000);
        } else {
          setStatus(result.status || 'error');
          setStatusDetail(result.error);
          setIsWakingUp(false);
          clearInterval(wakeupTimerRef.current);
        }
        
        if (onStatusChange) onStatusChange(result.status || 'error', result.data);
        
        // Store status in window object for other components to access
        if (typeof window !== 'undefined') {
          window.BACKEND_STATUS = { 
            status: result.status || 'error', 
            lastChecked: new Date().toLocaleTimeString() 
          };
        }
        
        return;
      }
      
      // All checks passed
      setStatus('online');
      setStatusDetail(null);
      setIsWakingUp(false);
      setWakeupAttempts(0);
      clearInterval(wakeupTimerRef.current);
      
      // Store status in window object for other components to access
      if (typeof window !== 'undefined') {
        window.BACKEND_STATUS = { 
          status: 'online', 
          lastChecked: new Date().toLocaleTimeString() 
        };
      }
      
      if (onStatusChange) onStatusChange('online', result.data);
      
    } catch (error) {
      console.error('Backend status check failed:', error);
      
      if (error.name === 'AbortError') {
        setStatus('timeout');
        setStatusDetail('Connection timed out');
      } else {
        setStatus('error');
        setStatusDetail(error.message);
      }
      
      // Store status in window object
      if (typeof window !== 'undefined') {
        window.BACKEND_STATUS = { 
          status: error.name === 'AbortError' ? 'timeout' : 'error',
          lastChecked: new Date().toLocaleTimeString(),
          error: error.message
        };
      }
      
      if (onStatusChange) onStatusChange(error.name === 'AbortError' ? 'timeout' : 'error');
    }
  }, [checkBackendStatus, onStatusChange]);
  
  // Automatic status check on component mount
  useEffect(() => {
    checkStatus();
    
    // Set up interval to check status every 60 seconds
    const intervalId = setInterval(() => {
      checkStatus();
    }, 60000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(wakeupTimerRef.current);
    };
  }, [checkStatus]);
  
  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    checkStatus();
  }, [checkStatus]);
  
  // Skip rendering if online
  if (status === 'online') return null;
  
  // Render a prominent notification when backend is offline
  return (
    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-300">
              {status === 'waking_up' ? 'Backend Server is Starting Up' : 'Backend Server is Offline'}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              {status === 'waking_up' 
                ? 'This can take up to 30-60 seconds as the server initializes.'
                : 'The backend server is currently offline. Click the button to wake it up.'}
            </p>
          </div>
        </div>
        
        <div className="w-full sm:w-auto">
          <Button
            onClick={handleRefresh}
            disabled={isWakingUp && wakeupProgress < 95}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isWakingUp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Waking Up... ({Math.min(wakeupProgress, 95)}%)
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {wakeupAttempts > 0 ? 'Try Again' : 'Wake Up API'}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isWakingUp && (
        <div className="mt-3">
          <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(wakeupProgress, 95)}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {statusDetail && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
          Details: {statusDetail}
        </p>
      )}
      
      <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 italic">
        The backend API automatically spins down after periods of inactivity to save resources. 
        This is why it may take up to a minute to "wake up" when you first visit the site.
      </p>
    </div>
  );
}; 