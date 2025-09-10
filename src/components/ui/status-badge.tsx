import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'ok' | 'warning' | 'error' | 'running' | 'stopped' | 'breakdown';
  text?: string;
  className?: string;
}

const statusConfig = {
  ok: {
    color: 'bg-success text-success-foreground',
    icon: CheckCircle,
    defaultText: 'OK',
  },
  warning: {
    color: 'bg-warning text-warning-foreground',
    icon: AlertTriangle,
    defaultText: 'Warning',
  },
  error: {
    color: 'bg-destructive text-destructive-foreground',
    icon: XCircle,
    defaultText: 'Error',
  },
  running: {
    color: 'bg-success text-success-foreground',
    icon: CheckCircle,
    defaultText: 'Running',
  },
  stopped: {
    color: 'bg-warning text-warning-foreground',
    icon: Clock,
    defaultText: 'Stopped',
  },
  breakdown: {
    color: 'bg-destructive text-destructive-foreground',
    icon: XCircle,
    defaultText: 'Breakdown',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  className 
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayText = text || config.defaultText;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {displayText}
    </span>
  );
};