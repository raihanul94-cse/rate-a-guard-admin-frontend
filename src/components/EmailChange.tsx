import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Shield, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateAdminEmailAddress } from "@/api/services/company-service";
import { AxiosError } from "axios";

const EmailChange = () => {
  const [newEmail, setNewEmail] = useState("");
  const [step, setStep] = useState<'input' | 'verify' | 'success'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await updateAdminEmailAddress(newEmail);

      if (res.status === 'success') {
        toast({
          title: "Email Changed Successfully",
          description: "Your email address has been updated",
        });
        setStep('success');
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: { message: string } }>;

      if (error?.response?.data) {
        toast({
          title: "Error",
          description: error?.response?.data?.error?.message ?? 'Something went wrong',
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Mail className="w-8 h-8 text-blue-600" />
          Change Email Address
        </h1>
        <p className="text-gray-600 mt-2">
          Update your admin account email address
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "input" && (
            <form onSubmit={handleEmailChange} className="space-y-6">
              <div>
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your new email address"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating Email Address..." : "Update Email Address"}
                </Button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <Check className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                Email Changed Successfully!
              </h3>
              <p className="text-gray-600">
                Your email address has been updated to:
              </p>
              <p className="font-medium text-gray-900">{newEmail}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailChange;
