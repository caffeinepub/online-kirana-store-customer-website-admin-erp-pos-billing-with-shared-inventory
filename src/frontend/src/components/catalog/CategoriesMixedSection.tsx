import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getCategoryIcon } from './categoryIcons';
import { Package, Apple, Coffee, Droplet, Sparkles, ShoppingBasket } from 'lucide-react';

interface CategoriesMixedSectionProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoriesMixedSection({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesMixedSectionProps) {
  // Featured categories for grid display (first 4 non-"all" categories)
  const featuredCategories = categories.filter(c => c !== 'all').slice(0, 4);
  // Remaining categories for carousel
  const remainingCategories = categories.filter(c => c !== 'all').slice(4);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'grains': 'from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30',
      'pulses': 'from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30',
      'spices': 'from-red-100 to-pink-100 dark:from-red-950/30 dark:to-pink-950/30',
      'oils': 'from-yellow-100 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30',
      'beverages': 'from-green-100 to-teal-100 dark:from-green-950/30 dark:to-teal-950/30',
      'snacks': 'from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30',
      'household': 'from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30',
      'personal-care': 'from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30',
    };
    return colors[category.toLowerCase()] || 'from-gray-100 to-slate-100 dark:from-gray-950/30 dark:to-slate-950/30';
  };

  return (
    <div className="space-y-8">
      {/* "All" Category - Prominent Display */}
      <div className="flex justify-center">
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
            selectedCategory === 'all'
              ? 'ring-4 ring-primary shadow-2xl scale-105'
              : 'hover:ring-2 hover:ring-primary/50'
          }`}
          onClick={() => onSelectCategory('all')}
        >
          <CardContent className="p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-orange-200/20 dark:from-primary/30 dark:to-orange-800/30 flex items-center justify-center ${
              selectedCategory === 'all' ? 'animate-pulse' : ''
            }`}>
              <ShoppingBasket className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">All Products</h3>
            <p className="text-sm text-muted-foreground">Browse everything</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Categories Grid */}
      {featuredCategories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((category) => {
            const Icon = getCategoryIcon(category);
            const isSelected = selectedCategory === category;
            
            return (
              <Card
                key={category}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isSelected
                    ? 'ring-4 ring-primary shadow-xl scale-105'
                    : 'hover:ring-2 hover:ring-primary/50'
                }`}
                onClick={() => onSelectCategory(category)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center shadow-md ${
                    isSelected ? 'animate-pulse' : ''
                  }`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold capitalize text-base mb-1">{category}</h3>
                  <Badge variant={isSelected ? 'default' : 'outline'} className="text-xs">
                    {isSelected ? 'Selected' : 'View'}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Remaining Categories Carousel */}
      {remainingCategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">More Categories</h3>
          <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-card shadow-md">
            <div className="flex gap-4 p-4">
              {remainingCategories.map((category) => {
                const Icon = getCategoryIcon(category);
                const isSelected = selectedCategory === category;
                
                return (
                  <Card
                    key={category}
                    className={`inline-block cursor-pointer transition-all duration-300 hover:shadow-lg min-w-[160px] ${
                      isSelected
                        ? 'ring-4 ring-primary shadow-xl scale-105'
                        : 'hover:ring-2 hover:ring-primary/50'
                    }`}
                    onClick={() => onSelectCategory(category)}
                  >
                    <CardContent className="p-5 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center shadow-sm ${
                        isSelected ? 'animate-pulse' : ''
                      }`}>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium capitalize text-sm mb-1">{category}</h4>
                      <Badge variant={isSelected ? 'default' : 'secondary'} className="text-xs">
                        {isSelected ? '✓' : 'View'}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
