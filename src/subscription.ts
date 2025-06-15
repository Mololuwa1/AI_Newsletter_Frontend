export type SubscriptionTier = 'free' | 'basic' | 'pro';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  chartTypes: string[];
  customization: {
    colors: boolean;
    fonts: boolean;
    branding: boolean;
    templates: boolean;
  };
  exports: string[];
  support: string;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  generationsUsed: number;
  generationsLimit: number | null;
  expiresAt?: Date;
}