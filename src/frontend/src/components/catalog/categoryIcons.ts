import { 
  Package, 
  Apple, 
  Coffee, 
  Droplet, 
  Sparkles, 
  Soup,
  Milk,
  Cookie,
  Beef,
  Carrot,
  Wine,
  IceCream,
  Sandwich,
  Pizza,
  type LucideIcon
} from 'lucide-react';

const categoryIconMap: Record<string, LucideIcon> = {
  'grains': Package,
  'rice': Package,
  'pulses': Soup,
  'dal': Soup,
  'spices': Sparkles,
  'oils': Droplet,
  'oil': Droplet,
  'beverages': Coffee,
  'tea': Coffee,
  'coffee': Coffee,
  'snacks': Cookie,
  'biscuits': Cookie,
  'dairy': Milk,
  'milk': Milk,
  'fruits': Apple,
  'vegetables': Carrot,
  'meat': Beef,
  'frozen': IceCream,
  'bakery': Sandwich,
  'ready-to-eat': Pizza,
  'household': Package,
  'personal-care': Sparkles,
  'atta': Package,
  'detergent': Droplet,
  'soap': Sparkles,
};

export function getCategoryIcon(category: string): LucideIcon {
  const normalized = category.toLowerCase().trim();
  return categoryIconMap[normalized] || Package;
}
