import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  FileText,
  Settings,
  HelpCircle,
  Zap,
  Clock,
  Star,
  TrendingUp,
  Activity,
  Users,
  BookOpen,
  Target,
  Award,
  Lightbulb,
  Sparkles,
  Brain,
  Rocket,
  Globe,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  User,
  Moon,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  showSidebar?: boolean;
  showStats?: boolean;
  currentUser?: {
    name: string;
    avatar?: string;
    tier?: string;
  };
  stats?: {
    totalAnalyses: number;
    averageGrade: string;
    timeSpent: string;
    streak: number;
  };
}

const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: Home, href: '/' },
  { id: 'analyze', label: 'AI Marker', icon: Brain, href: '/aimarker' },
  { id: 'history', label: 'History', icon: Clock, href: '/history' },
  { id: 'favorites', label: 'Favorites', icon: Star, href: '/favorites' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'help', label: 'Help', icon: HelpCircle, href: '/help' }
];

const QUICK_STATS = [
  { id: 'analyses', label: 'Analyses', icon: FileText, color: 'text-blue-500' },
  { id: 'grade', label: 'Avg Grade', icon: Award, color: 'text-green-500' },
  { id: 'time', label: 'Time Spent', icon: Clock, color: 'text-purple-500' },
  { id: 'streak', label: 'Streak', icon: TrendingUp, color: 'text-orange-500' }
];

export const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({
  children,
  sidebar,
  header,
  showSidebar = true,
  showStats = true,
  currentUser,
  stats = {
    totalAnalyses: 0,
    averageGrade: 'N/A',
    timeSpent: '0h',
    streak: 0
  }
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState('analyze');

  useEffect(() => {
    const savedTheme = localStorage.getItem('aimarker-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('aimarker-theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const StatCard = ({ stat, value, icon: Icon, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="card-interactive">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-muted/20 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              {showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">AI Code Mentor</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Intelligent code analysis and feedback
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={toggleTheme}>
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Switch to {darkMode ? 'light' : 'dark'} mode
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                </TooltipContent>
              </Tooltip>

              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              {currentUser && (
                <div className="flex items-center gap-2 ml-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    {currentUser.tier && (
                      <Badge variant="secondary" className="text-xs">
                        {currentUser.tier}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Enhanced Sidebar */}
          {showSidebar && (
            <motion.aside
              initial={false}
              animate={{ width: sidebarCollapsed ? 60 : 280 }}
              transition={{ duration: 0.3 }}
              className="sticky top-16 h-[calc(100vh-4rem)] border-r bg-muted/20 hidden lg:block"
            >
              <div className="p-4 space-y-4">
                {/* Quick Stats */}
                {showStats && !sidebarCollapsed && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_STATS.map((item, index) => {
                        const Icon = item.icon;
                        const values = [stats.totalAnalyses, stats.averageGrade, stats.timeSpent, stats.streak];
                        return (
                          <div key={item.id} className="p-2 rounded-lg bg-background border text-center">
                            <Icon className={`h-4 w-4 mx-auto mb-1 ${item.color}`} />
                            <p className="text-xs font-medium">{values[index]}</p>
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Navigation */}
                <nav className="space-y-2">
                  {NAVIGATION_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <Tooltip key={item.id} delayDuration={sidebarCollapsed ? 0 : 1000}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
                            onClick={() => setActiveSection(item.id)}
                          >
                            <Icon className="h-4 w-4" />
                            {!sidebarCollapsed && (
                              <span className="ml-2">{item.label}</span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        {sidebarCollapsed && (
                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </nav>

                {!sidebarCollapsed && (
                  <>
                    <Separator />
                    
                    {/* Recent Activity */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground">Recent Activity</h3>
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-background border">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <p className="text-xs">Analysis completed</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                        </div>
                        <div className="p-2 rounded-lg bg-background border">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <p className="text-xs">New preset saved</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-h-[calc(100vh-4rem)]">
            <div className="container mx-auto p-4 space-y-6">
              {/* Custom Header Content */}
              {header && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {header}
                </motion.div>
              )}

              {/* Stats Overview (Mobile) */}
              {showStats && (
                <div className="lg:hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard 
                      stat="Analyses" 
                      value={stats.totalAnalyses} 
                      icon={FileText} 
                      color="text-blue-500" 
                    />
                    <StatCard 
                      stat="Avg Grade" 
                      value={stats.averageGrade} 
                      icon={Award} 
                      color="text-green-500" 
                    />
                    <StatCard 
                      stat="Time Spent" 
                      value={stats.timeSpent} 
                      icon={Clock} 
                      color="text-purple-500" 
                    />
                    <StatCard 
                      stat="Streak" 
                      value={stats.streak} 
                      icon={TrendingUp} 
                      color="text-orange-500" 
                    />
                  </div>
                </div>
              )}

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-6"
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>

        {/* Custom Sidebar Content */}
        {sidebar && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="sticky top-16 h-[calc(100vh-4rem)] w-80 border-l bg-muted/20 hidden xl:block overflow-y-auto"
          >
            <div className="p-4">
              {sidebar}
            </div>
          </motion.aside>
        )}
      </div>
    </TooltipProvider>
  );
}; 