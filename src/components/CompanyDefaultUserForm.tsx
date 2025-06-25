
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ICompany } from '@/types/api';
import { updateCompanyDefaultUserPassword } from '@/api/services/company-service';

interface CompanyDefaultUserFormProps {
  company: ICompany;
  onCancel: () => void;
}

const CompanyDefaultUserForm = ({ company, onCancel }: CompanyDefaultUserFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await updateCompanyDefaultUserPassword(company.defaultUser.uuid, newPassword);

      if (res.status === 'success') {
        toast({
          title: "Success",
          description: "Default user password has been changed successfully",
        });

        setNewPassword('');
        setConfirmPassword('');
        onCancel();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div className="md:col-span-2">
          <Label className="text-sm font-medium text-gray-500">Default User Email</Label>
          <p className="mt-1 text-sm text-gray-900">{company.defaultUser.emailAddress}</p>
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter new password"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Confirm new password"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
            {submitting ? 'Changing Password' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDefaultUserForm;
