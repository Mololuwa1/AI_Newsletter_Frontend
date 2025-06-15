import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { UserSubscription } from '../types/subscription';

interface GenerationLimitBannerProps {
  subscription: UserSubscription;
  onUpgrade: () => void;
}

const GenerationLimitBanner: React.FC<GenerationLimitBannerProps> = ({
  subscription,
  onUpgrade
}) => {
  if (subscription.tier !== 'free' || !subscription.generationsLimit) {
    return null;
  }

  const remaining = subscription.generationsLimit - subscription.generationsUsed;
  const isLow = remaining <= 1;
  const isExhausted = remaining <= 0;

  return (
    <div className={`rounded-lg border p-4 mb-6 ${
      isExhausted 
        ? 'bg-red-50 border-red-200' 
        : isLow 
        ? 'bg-yellow-50 border-yellow-200'
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertCircle className={`w-5 h-5 ${
            isExhausted ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-blue-500'
          }`} />
          <div>
            <h3 className={`font-medium ${
              isExhausted ? 'text-red-800' : isLow ? 'text-yellow-800' : 'text-blue-800'
            }`}>
              {isExhausted 
                ? 'Generation limit reached' 
                : `${remaining} generation${remaining === 1 ? '' : 's'} remaining`
              }
            </h3>
            <p className={`text-sm ${
              isExhausted ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-blue-600'
            }`}>
              {isExhausted 
                ? 'Upgrade to continue creating newsletters'
                : 'Upgrade for unlimited generations and advanced features'
              }
            </p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isExhausted 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <span>Upgrade</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GenerationLimitBanner;