import { SubscriptionPlan } from '../types/subscription';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    period: 'forever',
    description: 'Get started with essential newsletter generation and basic data insights.',
    features: [
      '3 newsletter generations per month',
      'Basic chart types (Line, Bar)',
      'Standard AI-generated narratives',
      'Email export',
      'Community support'
    ],
    limitations: [
      'Watermarked newsletters',
      'Limited customization',
      'Basic templates only'
    ],
    chartTypes: ['Line', 'Bar'],
    customization: {
      colors: false,
      fonts: false,
      branding: false,
      templates: false
    },
    exports: ['Email'],
    support: 'Community'
  },
  {
    id: 'basic',
    name: 'Newsletter Maker',
    price: 9.99,
    period: 'month',
    description: 'Easy-to-use AI newsletter tool with enhanced chart capabilities and customization.',
    features: [
      'Unlimited newsletter generations',
      'All Free features +',
      'Gauge charts enabled',
      'Basic color customization',
      'No watermarks',
      'Standard templates',
      'Email support'
    ],
    popular: true,
    chartTypes: ['Line', 'Bar', 'Gauge', 'Area'],
    customization: {
      colors: true,
      fonts: false,
      branding: false,
      templates: true
    },
    exports: ['Email', 'PDF'],
    support: 'Email'
  },
  {
    id: 'pro',
    name: 'Pro Newsletter Maker',
    price: 39.99,
    period: 'month',
    description: 'Advanced features including premium charts, full customization, and priority support.',
    features: [
      'All Newsletter Maker features +',
      'Advanced chart types (Scatter, Pie, Treemap)',
      'Full customization options',
      'Premium templates',
      'Custom branding & logos',
      'Advanced export options',
      'Priority support',
      'API access',
      'Team collaboration'
    ],
    chartTypes: ['Line', 'Bar', 'Gauge', 'Area', 'Pie', 'Scatter', 'Treemap', 'Radar'],
    customization: {
      colors: true,
      fonts: true,
      branding: true,
      templates: true
    },
    exports: ['Email', 'PDF', 'PNG', 'SVG', 'PowerPoint'],
    support: 'Priority'
  }
];