import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Clock,
  Award,
  Target,
  Brain,
  Code,
  FileText,
  Upload,
  Download,
  Share2,
  Copy,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Rocket,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  RefreshCw,
  Bookmark,
  History,
  Layers,
  Grid3X3,
  List,
  Calendar,
  Tag
} from 'lucide-react';

// Enhanced Animation Variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Enhanced Card Components
interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: string;
  onClick?: () => void;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient,
  onClick
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`relative ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <Card className={`
        card-elevated overflow-hidden transition-all duration-300
        ${hover ? 'hover:shadow-2xl hover:border-primary/20' : ''}
        ${glow ? 'shadow-lg shadow-primary/10' : ''}
        ${className}
      `}>
        {gradient && (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 hover:opacity-10 transition-opacity`} />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    </motion.div>
  );
};

// Enhanced Button Components
interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<any>;
  loading?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  glow = false,
  className = '',
  onClick,
  disabled = false
}) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'hover:bg-muted text-foreground',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${glow ? 'shadow-lg shadow-primary/25' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        rounded-lg font-medium flex items-center justify-center gap-2
      `}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {Icon && !loading && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
};

// Enhanced Progress Component
interface EnhancedProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedProgress: React.FC<EnhancedProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'bg-primary',
  animated = true,
  size = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && <span className="text-muted-foreground">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`${color} ${sizeClasses[size]} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{ width: '20%' }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced Stats Display
interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: number;
  description?: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon: Icon,
  color,
  trend,
  description
}) => {
  return (
    <EnhancedCard hover glow gradient={color}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className={`h-4 w-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {trend >= 0 ? '+' : ''}{trend}%
                </span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </EnhancedCard>
  );
};

// Enhanced File Upload Area
interface EnhancedUploadAreaProps {
  onFileSelect: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  isDragActive?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const EnhancedUploadArea: React.FC<EnhancedUploadAreaProps> = ({
  onFileSelect,
  accept = '*',
  multiple = false,
  maxSize = 10,
  isDragActive = false,
  isUploading = false,
  uploadProgress = 0
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <motion.div
      animate={{ 
        scale: isDragActive ? 1.02 : 1,
        borderColor: isDragActive ? 'rgb(59 130 246)' : 'rgb(229 231 235)'
      }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <Card className={`
        border-2 border-dashed transition-all duration-300 overflow-hidden
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
      `}>
        <CardContent className="p-8 text-center space-y-4">
          <AnimatePresence>
            {isUploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Upload className="h-8 w-8 text-primary" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Uploading files...</p>
                  <EnhancedProgress value={uploadProgress} animated />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <motion.div
                  animate={{ y: isDragActive ? -5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Upload className="h-8 w-8 text-primary" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {isDragActive ? 'Drop files here' : 'Drag files here or click to upload'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Support for multiple file types up to {maxSize}MB
                  </p>
                </div>

                <EnhancedButton variant="gradient" icon={Upload}>
                  Choose Files
                </EnhancedButton>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced Search and Filter Bar
interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<any>;
    active: boolean;
    onClick: () => void;
  }>;
  sortOptions?: Array<{
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
  }>;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  filters = [],
  sortOptions = []
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="pl-10 h-12 bg-muted/20 border-0 focus:bg-background transition-colors"
        />
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={filter.onClick}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  flex items-center gap-2
                  ${filter.active 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {filter.label}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Enhanced Tooltip
interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  side = 'top',
  delay = 0
}) => {
  return (
    <Tooltip delayDuration={delay}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className="bg-popover border shadow-lg">
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

// Enhanced Loading States
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full`}
    />
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`bg-muted rounded ${className}`}
    />
  );
};

// Enhanced Notification/Toast
interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

export const EnhancedNotification: React.FC<NotificationProps> = ({
  type,
  title,
  description,
  action,
  onClose
}) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800'
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`p-4 rounded-lg border shadow-lg ${colors[type]}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <h4 className="font-medium">{title}</h4>
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

// All components and animations are already exported above 