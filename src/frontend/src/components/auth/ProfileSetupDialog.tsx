import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSaveCallerUserProfile, useRegisterCustomer } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { UserProfile, CustomerAccount } from '../../backend';
import { Variant_customer_staff } from '../../backend';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'customer' | 'staff'>('customer');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const saveProfile = useSaveCallerUserProfile();
  const registerCustomer = useRegisterCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (userType === 'customer' && !mobile.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }

    try {
      if (userType === 'customer') {
        // Generate a unique customer ID (timestamp-based)
        const customerId = BigInt(Date.now());
        
        const customer: CustomerAccount = {
          id: customerId,
          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim() || undefined,
        };

        await registerCustomer.mutateAsync(customer);
        toast.success('Welcome! Your account has been created.');
      } else {
        // For staff, just save the profile (admin will need to register them properly)
        const profile: UserProfile = {
          name: name.trim(),
          userType: Variant_customer_staff.staff,
          accountId: undefined,
        };

        await saveProfile.mutateAsync(profile);
        toast.info('Profile saved. Please contact admin to complete staff registration.');
      }
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast.error(error.message || 'Failed to setup profile');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome!</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label>I am a *</Label>
            <RadioGroup value={userType} onValueChange={(v) => setUserType(v as 'customer' | 'staff')}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="flex-1 cursor-pointer">
                  Customer - Shop for groceries
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="staff" id="staff" />
                <Label htmlFor="staff" className="flex-1 cursor-pointer">
                  Staff Member - Work at the store
                </Label>
              </div>
            </RadioGroup>
          </div>

          {userType === 'customer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 text-base"
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base"
            disabled={saveProfile.isPending || registerCustomer.isPending}
          >
            {saveProfile.isPending || registerCustomer.isPending ? 'Setting up...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
