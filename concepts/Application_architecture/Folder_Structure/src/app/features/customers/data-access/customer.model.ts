export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  tier: 'Standard' | 'Premium' | 'Enterprise';
  joinedDate: string;
}
