import { useState, useEffect } from 'react';
import { SubscriptionTier, UserSubscription } from '../types/subscription';

// Mock subscription data - in production, this would come from your backend
const mockUserSubscription: UserSubscription = {
  tier: 'free',
  generationsUsed: 1,
  generationsLimit: 3,
  expiresAt: undefined
};

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription>(mockUserSubscription);
  const [loading, setLoading] = useState(false);

  const canGenerate = () => {
    if (subscription.tier === 'free') {
      return subscription.generationsUsed < (subscription.generationsLimit || 0);
    }
    return true; // Basic and Pro have unlimited generations
  };

  const incrementGeneration = () => {
    setSubscription(prev => ({
      ...prev,
      generationsUsed: prev.generationsUsed + 1
    }));
  };

  const upgradeSubscription = async (newTier: SubscriptionTier) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubscription(prev => ({
      ...prev,
      tier: newTier,
      generationsLimit: newTier === 'free' ? 3 : null,
      expiresAt: newTier !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
    }));
    
    setLoading(false);
  };

  return {
    subscription,
    canGenerate,
    incrementGeneration,
    upgradeSubscription,
    loading
  };
};