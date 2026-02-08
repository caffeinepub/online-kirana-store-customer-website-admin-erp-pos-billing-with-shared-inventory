import { Card, CardContent } from '@/components/ui/card';
import { Store, Users, Heart, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Shree Kirana</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted neighborhood store for quality groceries since 2020
          </p>
        </div>

        {/* Image */}
        <div className="mb-12 rounded-xl overflow-hidden">
          <img
            src="/assets/generated/storefront-illustration.dim_1200x800.png"
            alt="Shree Kirana storefront"
            className="w-full h-auto"
          />
        </div>

        {/* Story */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            Shree Kirana has been serving our community with fresh, quality groceries and daily essentials for years. 
            We believe in providing our customers with the best products at fair prices, delivered with a smile.
          </p>
          <p className="text-lg leading-relaxed">
            From traditional staples like rice, atta, and dal to modern packaged goods, we stock everything you need 
            for your household. Our commitment to quality and customer satisfaction has made us a trusted name in the neighborhood.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quality Products</h3>
              <p className="text-sm text-muted-foreground">
                We source only the best quality products for our customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Community First</h3>
              <p className="text-sm text-muted-foreground">
                Serving our local community with dedication and care
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Customer Care</h3>
              <p className="text-sm text-muted-foreground">
                Your satisfaction is our top priority
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Trusted Brand</h3>
              <p className="text-sm text-muted-foreground">
                Years of experience and thousands of happy customers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
