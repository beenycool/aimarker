"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Team } from './types';
import { Download, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface TeamExportProps {
  team: Team;
  onImportTeam: (team: Team) => void;
}

export function TeamExport({ team, onImportTeam }: TeamExportProps) {
  const [importData, setImportData] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const exportTeam = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      team: {
        name: team.name,
        players: team.players,
        matches: team.matches
      },
      metadata: {
        totalPlayers: team.players.length,
        totalMatches: team.matches.length,
        averageRating: team.players.length > 0 
          ? Math.round(team.players.reduce((sum, p) => sum + p.overallRating, 0) / team.players.length)
          : 0
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${team.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboard = async () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      team: {
        name: team.name,
        players: team.players,
        matches: team.matches
      }
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      setImportStatus('success');
      setImportMessage('Team data copied to clipboard!');
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (err) {
      setImportStatus('error');
      setImportMessage('Failed to copy to clipboard');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      
      // Validate the import data structure
      if (!data.team || !data.team.name || !Array.isArray(data.team.players)) {
        throw new Error('Invalid team data format');
      }

      // Validate players have required fields
      const requiredPlayerFields = ['id', 'name', 'position', 'overallRating', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
      for (const player of data.team.players) {
        for (const field of requiredPlayerFields) {
          if (player[field] === undefined) {
            throw new Error(`Player missing required field: ${field}`);
          }
        }
      }

      // Create the imported team
      const importedTeam: Team = {
        name: data.team.name,
        players: data.team.players.map((player: any) => ({
          ...player,
          goals: player.goals || 0,
          assists: player.assists || 0,
          appearances: player.appearances || 0,
          ...(player.position === 'GK' && { cleanSheets: player.cleanSheets || 0 })
        })),
        matches: data.team.matches || []
      };

      onImportTeam(importedTeam);
      setImportStatus('success');
      setImportMessage(`Successfully imported team "${importedTeam.name}" with ${importedTeam.players.length} players!`);
      setImportData('');
      setTimeout(() => {
        setImportStatus('idle');
        setIsImportOpen(false);
      }, 2000);

    } catch (error) {
      setImportStatus('error');
      setImportMessage(`Import failed: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
      setTimeout(() => setImportStatus('idle'), 5000);
    }
  };

  const loadFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImportData(text);
      setImportStatus('success');
      setImportMessage('Data loaded from clipboard');
      setTimeout(() => setImportStatus('idle'), 2000);
    } catch (err) {
      setImportStatus('error');
      setImportMessage('Failed to read from clipboard');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="text-blue-500" />
            Export Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Team Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <div className="font-medium">{team.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Players:</span>
                  <div className="font-medium">{team.players.length}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Matches:</span>
                  <div className="font-medium">{team.matches.length}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Rating:</span>
                  <div className="font-medium">
                    {team.players.length > 0 
                      ? Math.round(team.players.reduce((sum, p) => sum + p.overallRating, 0) / team.players.length)
                      : 0}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button onClick={exportTeam} className="flex items-center gap-2">
                <Download size={16} />
                Download JSON File
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                <FileText size={16} />
                Copy to Clipboard
              </Button>
            </div>

            {importStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle size={16} />
                {importMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="text-green-500" />
            Import Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload size={16} />
                Import Team Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Team</DialogTitle>
                <DialogDescription>
                  Paste your team JSON data below to import a team with all players and match history.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="import-data">Team JSON Data</Label>
                  <Textarea
                    id="import-data"
                    placeholder="Paste your exported team JSON data here..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={12}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={loadFromClipboard} variant="outline" size="sm">
                    Paste from Clipboard
                  </Button>
                </div>

                {importStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {importMessage}
                  </div>
                )}

                {importStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle size={16} />
                    {importMessage}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={!importData.trim() || importStatus === 'success'}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Import Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>💡 <strong>Export Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>JSON files can be shared with friends</li>
              <li>Use clipboard for quick sharing</li>
              <li>Exports include all player stats and match history</li>
              <li>Compatible with future versions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}