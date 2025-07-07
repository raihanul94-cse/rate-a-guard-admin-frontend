import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTeamMember } from '@/api/services/company-service';
import { AxiosError } from 'axios';

interface InvitationFormData {
    password: string;
    confirmPassword: string;
}

const TeamInvitation = () => {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isValidCode, setIsValidCode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<InvitationFormData>({
        password: '',
        confirmPassword: ''
    });

    const emailAddress = searchParams.get('emailAddress');
    const code = searchParams.get('code');

    const handleInputChange = (field: keyof InvitationFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive"
            });
            return;
        }

        if (!formData.password) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        try {
            const res = await createTeamMember({
                emailAddress: emailAddress,
                code: code,
                password: formData.password
            });

            if (res.status === 'success') {
                toast({
                    title: "Success",
                    description: "Your account has been created successfully!"
                });

                setIsSubmitted(true);
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

    if (!emailAddress || !code) {
        setIsValidCode(false);
    }

    if (!isValidCode) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
                        <CardDescription>
                            This invitation link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/admin/login">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <CardTitle className="text-green-600">Welcome to the Team!</CardTitle>
                        <CardDescription>
                            Your account has been created successfully. You can now log in to access the admin panel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/admin/login">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>Complete Your Registration</CardTitle>
                    <CardDescription>
                        You've been invited to join the team as: <br /><strong>{emailAddress}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Submitting..." : "Complete Registration"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/admin/login" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamInvitation;