import React from 'react';
import { X, Check, Crown, Zap, Star } from 'lucide-react';
import { subscriptionPlans } from "../subscriptionPlans";
import { SubscriptionTier } from '../types/subscription';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (tier: SubscriptionTier) => void;
  currentTier: SubscriptionTier;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  currentTier
}) => {
  if (!isOpen) return null;

  const getIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free': return Star;
      case 'basic': return Zap;
      case 'pro': return Crown;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
              <p className="text-gray-600 mt-2">Unlock powerful features to create professional newsletters</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const Icon = getIcon(plan.id);
              const isCurrentPlan = plan.id === currentTier;
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                    isPopular
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.id === 'free' ? 'bg-gray-100' :
                      plan.id === 'basic' ? 'bg-blue-100' :
                      'bg-gradient-to-r from-purple-100 to-pink-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        plan.id === 'free' ? 'text-gray-600' :
                        plan.id === 'basic' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations && (
                    <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700">Limitations:</h4>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-xs text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.id === 'free'
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : plan.id === 'basic'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    }`}
                  >
                    {isCurrentPlan ? 'Current Plan' : `Choose ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              All plans include a 14-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;