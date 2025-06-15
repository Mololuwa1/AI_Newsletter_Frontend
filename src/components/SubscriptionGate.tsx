import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { SubscriptionTier } from '../types/subscription';
import SubscriptionBadge from './SubscriptionBadge';

interface SubscriptionGateProps {
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  featureName: string;
  onUpgrade: () => void;
  children?: React.ReactNode;
}

const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  requiredTier,
  currentTier,
  featureName,
  onUpgrade,
  children
}) => {
  const tierOrder = { free: 0, basic: 1, pro: 2 };
  const hasAccess = tierOrder[currentTier] >= tierOrder[requiredTier];

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upgrade to Access {featureName}
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            This feature requires a <SubscriptionBadge tier={requiredTier} size="sm" /> subscription or higher.
          </p>
          <button
            onClick={onUpgrade}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default SubscriptionGate;