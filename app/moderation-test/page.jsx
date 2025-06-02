'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ModerationTestPage() {
  const [testContent, setTestContent] = useState('');
  const [moderationResult, setModerationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  // Check moderation system status
  const checkSystemStatus = async () => {
    try {
      const response = await fetch('/api/moderation/health');
      const data = await response.json();
      setSystemStatus(data);
    } catch (error) {
      console.error('Failed to check system status:', error);
      setSystemStatus({ status: 'error', error: error.message });
    }
  };

  // Test content moderation
  const testModeration = async () => {
    if (!testContent.trim()) return;
    
    setLoading(true);
    setModerationResult(null);
    
    try {
      // Simulate the same request format as the AI endpoints
      const response = await fetch('/api/github/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: testContent
            }
          ],
          model: 'test-moderation'
        })
      });

      if (response.ok) {
        setModerationResult({
          safe: true,
          message: 'Content passed moderation checks',
          status: 'approved'
        });
      } else {
        const errorData = await response.json();
        setModerationResult({
          safe: false,
          message: errorData.message || 'Content was flagged',
          details: errorData.details,
          status: 'flagged'
        });
      }
    } catch (error) {
      console.error('Moderation test failed:', error);
      setModerationResult({
        safe: false,
        message: 'Test failed: ' + error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'flagged':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Shield className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      configured: 'default',
      not_configured: 'destructive',
      error: 'destructive'
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status?.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Moderation Test</h1>
        <p className="text-muted-foreground">
          Test the LlamaGuard content moderation system powered by Cloudflare Workers AI
        </p>
      </div>

      {/* System Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Moderation System Status
          </CardTitle>
          <CardDescription>
            Current status of the content moderation service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span>System Status:</span>
            <div className="flex items-center gap-2">
              {systemStatus ? getStatusBadge(systemStatus.status) : 
                <Badge variant="secondary">Not Checked</Badge>
              }
              <Button variant="outline" size="sm" onClick={checkSystemStatus}>
                Check Status
              </Button>
            </div>
          </div>
          
          {systemStatus && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="font-mono">{systemStatus.service}</span>
              </div>
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="font-mono">{systemStatus.model}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Limit:</span>
                <span className="font-mono">{systemStatus.dailyLimit}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost:</span>
                <span className="font-mono">{systemStatus.costPerRequest}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Testing Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Content Moderation</CardTitle>
          <CardDescription>
            Enter content to test against the moderation system. This simulates what happens when students submit questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="test-content" className="text-sm font-medium">
              Content to Test
            </label>
            <Textarea
              id="test-content"
              placeholder="Enter a question or message to test moderation..."
              value={testContent}
              onChange={(e) => setTestContent(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button 
            onClick={testModeration} 
            disabled={!testContent.trim() || loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Moderation'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Card */}
      {moderationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(moderationResult.status)}
              Moderation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={moderationResult.safe ? 'border-green-200' : 'border-red-200'}>
              <AlertDescription>
                {moderationResult.message}
              </AlertDescription>
            </Alert>
            
            {moderationResult.details && (
              <div className="mt-4 space-y-2 text-sm">
                <h4 className="font-medium">Details:</h4>
                <div className="bg-muted p-3 rounded">
                  <div className="flex justify-between">
                    <span>Reason:</span>
                    <span className="font-mono">{moderationResult.details.reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flagged For:</span>
                    <span className="font-mono">{moderationResult.details.flaggedFor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-mono">{moderationResult.details.service}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Example Test Cases */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Example Test Cases</CardTitle>
          <CardDescription>
            Try these examples to see how the moderation system works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Should Pass ✓</h4>
              <div className="space-y-1 text-sm">
                <button 
                  className="block w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => setTestContent("Can you help me understand quadratic equations for my GCSE maths exam?")}
                >
                  "Can you help me understand quadratic equations for my GCSE maths exam?"
                </button>
                <button 
                  className="block w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => setTestContent("What are the causes of World War 1 for my history coursework?")}
                >
                  "What are the causes of World War 1 for my history coursework?"
                </button>
                <button 
                  className="block w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => setTestContent("Explain photosynthesis in plants for biology GCSE")}
                >
                  "Explain photosynthesis in plants for biology GCSE"
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Should Be Flagged ✗</h4>
              <div className="space-y-1 text-sm">
                <button 
                  className="block w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => setTestContent("Can you help me cheat on my exam tomorrow?")}
                >
                  "Can you help me cheat on my exam tomorrow?"
                </button>
                <button 
                  className="block w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => setTestContent("I hate my teacher, they are so stupid")}
                >
                  "I hate my teacher, they are so stupid"
                </button>
                <button 
                  className="block w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => setTestContent("Buy cheap drugs online here!!!")}
                >
                  "Buy cheap drugs online here!!!"
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}