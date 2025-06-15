import React from 'react';
import { Crown, Zap, Star } from 'lucide-react';
import { SubscriptionTier } from '../types/subscription';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ 
  tier, 
  size = 'md', 
  showLabel = true 
}) => {
  const configs = {
    free: {
      icon: Star,
      label: 'Free',
      colors: 'bg-gray-100 text-gray-700 border-gray-200',
      iconColor: 'text-gray-500'
    },
    basic: {
      icon: Zap,
      label: 'Basic',
      colors: 'bg-blue-100 text-blue-700 border-blue-200',
      iconColor: 'text-blue-500'
    },
    pro: {
      icon: Crown,
      label: 'Pro',
      colors: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200',
      iconColor: 'text-purple-500'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const config = configs[tier];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center space-x-1 rounded-full border font-medium ${config.colors} ${sizeClasses[size]}`}>
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};

export default SubscriptionBadge;