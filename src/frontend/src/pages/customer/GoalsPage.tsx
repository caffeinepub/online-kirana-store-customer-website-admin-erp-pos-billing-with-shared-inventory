import { Card, CardContent } from '@/components/ui/card';
import { Target, Leaf, Users, TrendingUp } from 'lucide-react';

export default function GoalsPage() {
  return (
    <div className="container px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Mission & Goals</h1>
          <p className="text-xl text-muted-foreground">
            Building a better future for our community, one grocery at a time
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  To provide our community with access to fresh, quality groceries at affordable prices while 
                  maintaining the highest standards of customer service. We strive to be more than just a store – 
                  we aim to be a trusted partner in every household's daily life.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <div className="mb-12 rounded-xl overflow-hidden">
          <img
            src="/assets/generated/storefront-illustration.dim_1200x800.png"
            alt="Our Store"
            className="w-full h-auto"
          />
        </div>

        {/* Goals */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">Our Goals</h2>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We are committed to reducing our environmental impact by sourcing locally when possible, 
                    minimizing packaging waste, and promoting eco-friendly products. Our goal is to become 
                    a zero-waste store by 2030.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe in giving back to the community that supports us. Through partnerships with 
                    local food banks, sponsoring community events, and supporting local producers, we aim to 
                    strengthen the bonds that make our neighborhood special.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We are constantly working to improve our services, expand our product range, and enhance 
                    the shopping experience. Your feedback helps us grow and serve you better every day. 
                    Our goal is to be the most customer-centric store in the region.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
