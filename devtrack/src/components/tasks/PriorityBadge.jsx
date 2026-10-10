import React from 'react';
import { ArrowUp, Minus, ArrowDown } from 'lucide-react';
import Badge from '../common/Badge';

export default function PriorityBadge({ priority = 'low' }) {
  const normalizedPriority = priority.toLowerCase();
  
  const config = {
    high: { variant: 'danger', icon: ArrowUp },
    medium: { variant: 'warning', icon: Minus },
    low: { variant: 'success', icon: ArrowDown }
  };
  
  const { variant, icon: Icon } = config[normalizedPriority] || config.low;
  
  return (
    <Badge variant={variant} className="flex items-center gap-1 capitalize">
      <Icon size={12} strokeWidth={2.5} />
      {priority}
    </Badge>
  );
}
