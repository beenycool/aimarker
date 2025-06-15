import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Save, Trash2, Edit, Plus, User, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalConfig {
  id: string;
  name: string;
  description?: string;
  subject: string;
  examBoard: string;
  questionType: string;
  totalMarks: string;
  markScheme?: string;
  userType: string;
  tier?: string;
  createdAt: string;
  updatedAt: string;
}

interface PersonalConfigsProps {
  currentConfig: {
    subject: string;
    examBoard: string;
    questionType: string;
    totalMarks: string;
    markScheme: string;
    userType: string;
    tier: string;
  };
  onApplyConfig: (config: PersonalConfig) => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

export const PersonalConfigs: React.FC<PersonalConfigsProps> = ({
  currentConfig,
  onApplyConfig,
  isLoggedIn,
  onLoginRequired
}) => {
  const [configs, setConfigs] = useState<PersonalConfig[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PersonalConfig | null>(null);
  const [configName, setConfigName] = useState('');
  const [configDescription, setConfigDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Load saved configs from localStorage (in real app, this would be from API)
  useEffect(() => {
    if (isLoggedIn) {
      const savedConfigs = localStorage.getItem('aimarker_personal_configs');
      if (savedConfigs) {
        try {
          setConfigs(JSON.parse(savedConfigs));
        } catch (error) {
          console.error('Error loading personal configs:', error);
        }
      }
    }
  }, [isLoggedIn]);

  // Save configs to localStorage (in real app, this would be API call)
  const saveConfigsToStorage = (newConfigs: PersonalConfig[]) => {
    localStorage.setItem('aimarker_personal_configs', JSON.stringify(newConfigs));
    setConfigs(newConfigs);
  };

  const handleSaveConfig = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!configName.trim()) {
      toast.error('Please enter a name for your configuration');
      return;
    }

    setLoading(true);
    try {
      const newConfig: PersonalConfig = {
        id: Date.now().toString(),
        name: configName.trim(),
        description: configDescription.trim() || undefined,
        subject: currentConfig.subject,
        examBoard: currentConfig.examBoard,
        questionType: currentConfig.questionType,
        totalMarks: currentConfig.totalMarks,
        markScheme: currentConfig.markScheme || undefined,
        userType: currentConfig.userType,
        tier: currentConfig.tier,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedConfigs = [...configs, newConfig];
      saveConfigsToStorage(updatedConfigs);
      
      toast.success(`Configuration "${configName}" saved successfully`);
      setShowSaveDialog(false);
      setConfigName('');
      setConfigDescription('');
    } catch (error) {
      toast.error('Failed to save configuration');
      console.error('Error saving config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    if (!editingConfig) return;

    setLoading(true);
    try {
      const updatedConfig: PersonalConfig = {
        ...editingConfig,
        name: configName.trim(),
        description: configDescription.trim() || undefined,
        updatedAt: new Date().toISOString()
      };

      const updatedConfigs = configs.map(config => 
        config.id === editingConfig.id ? updatedConfig : config
      );
      saveConfigsToStorage(updatedConfigs);
      
      toast.success(`Configuration "${configName}" updated successfully`);
      setShowEditDialog(false);
      setEditingConfig(null);
      setConfigName('');
      setConfigDescription('');
    } catch (error) {
      toast.error('Failed to update configuration');
      console.error('Error updating config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    try {
      const updatedConfigs = configs.filter(config => config.id !== configId);
      saveConfigsToStorage(updatedConfigs);
      toast.success('Configuration deleted successfully');
    } catch (error) {
      toast.error('Failed to delete configuration');
      console.error('Error deleting config:', error);
    }
  };

  const handleEditConfig = (config: PersonalConfig) => {
    setEditingConfig(config);
    setConfigName(config.name);
    setConfigDescription(config.description || '');
    setShowEditDialog(true);
  };

  const handleApplyConfig = (config: PersonalConfig) => {
    onApplyConfig(config);
    toast.success(`Applied configuration: ${config.name}`);
  };

  if (!isLoggedIn) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-gray-700">
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Login Required</h3>
              <p className="text-gray-400 mb-4">
                Save and manage your personal marking configurations by logging in.
              </p>
              <Button onClick={onLoginRequired} className="bg-blue-600 hover:bg-blue-700">
                <User className="h-4 w-4 mr-2" />
                Login to Save Configs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Save Current Config */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Current Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full border-gray-600 hover:border-gray-500">
                <Plus className="h-4 w-4 mr-2" />
                Save Current Setup
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Save Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="config-name" className="text-white">Configuration Name</Label>
                  <Input
                    id="config-name"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="e.g., English AQA Paper 1 Setup"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="config-description" className="text-white">Description (Optional)</Label>
                  <Textarea
                    id="config-description"
                    value={configDescription}
                    onChange={(e) => setConfigDescription(e.target.value)}
                    placeholder="Brief description of this configuration..."
                    className="bg-gray-700 border-gray-600 text-white resize-none"
                    rows={3}
                  />
                </div>
                <div className="bg-gray-700/50 p-3 rounded border border-gray-600">
                  <p className="text-xs text-gray-400 mb-2">Current Configuration:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span className="text-gray-300">Subject: <span className="text-white">{currentConfig.subject}</span></span>
                    <span className="text-gray-300">Board: <span className="text-white">{currentConfig.examBoard}</span></span>
                    <span className="text-gray-300">Type: <span className="text-white">{currentConfig.questionType}</span></span>
                    <span className="text-gray-300">Marks: <span className="text-white">{currentConfig.totalMarks || 'Not set'}</span></span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConfig} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Saved Configurations */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-white">
            Saved Configurations ({configs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No saved configurations yet. Save your current setup to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div key={config.id} className="bg-gray-700/50 p-3 rounded border border-gray-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{config.name}</h4>
                      {config.description && (
                        <p className="text-gray-400 text-xs mt-1">{config.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                          {config.subject}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                          {config.examBoard}
                        </Badge>
                        {config.totalMarks && (
                          <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                            {config.totalMarks} marks
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {new Date(config.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApplyConfig(config)}
                        className="h-8 w-8 p-0 hover:bg-gray-600"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditConfig(config)}
                        className="h-8 w-8 p-0 hover:bg-gray-600"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConfig(config.id)}
                        className="h-8 w-8 p-0 hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-config-name" className="text-white">Configuration Name</Label>
              <Input
                id="edit-config-name"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-config-description" className="text-white">Description (Optional)</Label>
              <Textarea
                id="edit-config-description"
                value={configDescription}
                onChange={(e) => setConfigDescription(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateConfig} disabled={loading}>
              {loading ? 'Updating...' : 'Update Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 