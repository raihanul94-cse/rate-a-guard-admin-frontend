
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ICompany } from '@/types/api';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CompanyDetailsProps {
  company: ICompany;
}

const CompanyDetails = ({ company }: CompanyDetailsProps) => {
  return (
    <div className="space-y-6">
      <ScrollArea className="h-[220px] w-full overflow-hidden">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">License Number</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.licenseNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">License Type</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.licenseType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">License Expiration Date</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.licenseExpirationDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Address</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">City</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.city}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">State</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.state}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Zip</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.zip}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Country</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Agent Name</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.registeredAgentFirstName} {company.registeredAgentLastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Agent Email</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.emailAddress}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Agent Phone</Label>
                  <p className="mt-1 text-sm text-gray-900">{company.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ScrollBar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200"
        />
      </ScrollArea>
    </div>
  );
};

export default CompanyDetails;
