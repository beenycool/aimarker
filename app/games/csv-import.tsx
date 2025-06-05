"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Player } from './types';
import { FileSpreadsheet, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface CSVImportProps {
  onImportPlayers: (players: Player[]) => void;
}

export function CSVImport({ onImportPlayers }: CSVImportProps) {
  const [csvData, setCsvData] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const sampleCSV = `Name,Position,Pace,Shooting,Passing,Dribbling,Defending,Physical
Cristiano Ronaldo,ST,85,95,82,88,35,88
Lionel Messi,RW,88,92,95,96,38,75
Kevin De Bruyne,CAM,75,88,96,90,65,82
Virgil van Dijk,CB,82,50,85,70,95,92
Alisson,GK,60,30,75,50,94,88`;

  const downloadSampleCSV = () => {
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(sampleCSV);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'sample_players.csv');
    linkElement.click();
  };

  const parseCSV = (csvText: string): Player[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have header row and at least one player');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'position', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
    
    // Check if all required headers are present
    const missingHeaders = requiredHeaders.filter(header => 
      !headers.some(h => h.includes(header.toLowerCase()))
    );
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const players: Player[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;

      try {
        const playerData: any = {};
        headers.forEach((header, index) => {
          playerData[header] = values[index];
        });

        // Validate position
        const validPositions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
        const position = playerData.position?.toUpperCase();
        if (!validPositions.includes(position)) {
          throw new Error(`Invalid position "${playerData.position}" for player ${playerData.name}`);
        }

        // Parse numeric stats
        const pace = parseInt(playerData.pace);
        const shooting = parseInt(playerData.shooting);
        const passing = parseInt(playerData.passing);
        const dribbling = parseInt(playerData.dribbling);
        const defending = parseInt(playerData.defending);
        const physical = parseInt(playerData.physical);

        // Validate stats are numbers between 1-99
        const stats = { pace, shooting, passing, dribbling, defending, physical };
        for (const [statName, statValue] of Object.entries(stats)) {
          if (isNaN(statValue) || statValue < 1 || statValue > 99) {
            throw new Error(`Invalid ${statName} value for ${playerData.name}: must be 1-99`);
          }
        }

        const player: Player = {
          id: `${Date.now()}-${i}`,
          name: playerData.name,
          position: position as Player['position'],
          pace,
          shooting,
          passing,
          dribbling,
          defending,
          physical,
          overallRating: Math.round((pace + shooting + passing + dribbling + defending + physical) / 6),
          goals: 0,
          assists: 0,
          appearances: 0,
          ...(position === 'GK' && { cleanSheets: 0 })
        };

        players.push(player);
      } catch (error) {
        throw new Error(`Error parsing row ${i + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
      }
    }

    return players;
  };

  const handleImport = () => {
    try {
      setImportStatus('idle');
      
      if (!csvData.trim()) {
        throw new Error('Please enter CSV data');
      }

      const players = parseCSV(csvData);
      
      if (players.length === 0) {
        throw new Error('No valid players found in CSV');
      }

      onImportPlayers(players);
      setImportStatus('success');
      setImportMessage(`Successfully imported ${players.length} players!`);
      setCsvData('');
      
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Import failed');
      setTimeout(() => setImportStatus('idle'), 5000);
    }
  };

  const loadSampleData = () => {
    setCsvData(sampleCSV);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="text-green-500" />
          CSV Bulk Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Import multiple players at once using CSV format. Perfect for creating entire teams quickly!</p>
          <p><strong>Required columns:</strong> Name, Position, Pace, Shooting, Passing, Dribbling, Defending, Physical</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={downloadSampleCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Sample CSV
          </Button>
          <Button onClick={loadSampleData} variant="outline" size="sm">
            Load Sample Data
          </Button>
        </div>

        <div>
          <Label htmlFor="csv-data">CSV Data</Label>
          <Textarea
            id="csv-data"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="Paste your CSV data here or use the sample..."
            rows={10}
            className="font-mono text-xs"
          />
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

        <Button 
          onClick={handleImport} 
          className="w-full" 
          disabled={!csvData.trim() || importStatus === 'success'}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Import Players from CSV
        </Button>

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <strong>Tips:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Positions: GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST</li>
            <li>• Stats must be numbers between 1-99</li>
            <li>• Use commas to separate values</li>
            <li>• First row must be headers</li>
            <li>• You can copy-paste from Excel/Google Sheets</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}