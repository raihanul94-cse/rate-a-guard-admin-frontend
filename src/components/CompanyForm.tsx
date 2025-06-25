
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ICompany } from '@/types/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMPANY_LICENSE_TYPE, US_STATES } from '@/utils/enums';

interface CompanyFormProps {
  company: ICompany | null;
  onSave: (company: ICompany) => void;
  onCancel: () => void;
  submitting: boolean;
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type CustomChangeEvent = { name: string; value: string };

const CompanyForm = ({ company, onSave, onCancel, submitting }: CompanyFormProps) => {
  const [formData, setFormData] = useState<ICompany>({
    uuid: '',
    companyName: '',
    licenseNumber: '',
    licenseType: '',
    licenseExpirationDate: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    registeredAgentFirstName: '',
    registeredAgentLastName: '',
    emailAddress: '',
    phoneNumber: '',
    status: '',
    defaultUser: {
      uuid: '',
      emailAddress: '',
      password: '',
      status: ''
    }
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData({
        uuid: '',
        companyName: '',
        licenseNumber: '',
        licenseType: '',
        licenseExpirationDate: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        registeredAgentFirstName: '',
        registeredAgentLastName: '',
        emailAddress: '',
        phoneNumber: '',
        status: '',
        defaultUser: {
          uuid: '',
          emailAddress: '',
          password: '',
          status: ''
        }
      });
    }
  }, [company]);

  const handleChange = (
    e: InputChangeEvent | CustomChangeEvent
  ) => {
    const name = 'target' in e ? e.target.name : e.name;
    const value = 'target' in e ? e.target.value : e.value;

    setFormData(prev => {
      const keys = name.split('.');
      if (keys.length === 1) {
        return {
          ...prev,
          [name]: value
        };
      } else {
        const [firstKey, ...restKeys] = keys;

        return {
          ...prev,
          [firstKey]: updateNestedValue(prev[firstKey] || {}, restKeys, value)
        };
      }
    });
  };

  const updateNestedValue = (obj: object, keys: string[], value: string): unknown => {
    if (keys.length === 0) return value;

    const [key, ...rest] = keys;

    return {
      ...obj,
      [key]: updateNestedValue(obj[key] || {}, rest, value)
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="licenseType">License Type</Label>

          <Select
            value={formData.licenseType}
            onValueChange={(value) => handleChange({ name: 'licenseType', value: value })}
            defaultValue={formData.licenseType}
            required
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_LICENSE_TYPE.map((licenseType) => (
                <SelectItem
                  key={licenseType.abbreviation}
                  value={licenseType.abbreviation}
                >
                  {licenseType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="licenseExpirationDate">License Expiration Date</Label>
          <Input
            id="licenseExpirationDate"
            name="licenseExpirationDate"
            type="date"
            value={formData.licenseExpirationDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="registeredAgentFirstName">Agent First Name</Label>
          <Input
            id="registeredAgentFirstName"
            name="registeredAgentFirstName"
            value={formData.registeredAgentFirstName}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="registeredAgentLastName">Agent Last Name</Label>
          <Input
            id="registeredAgentLastName"
            name="registeredAgentLastName"
            value={formData.registeredAgentLastName}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="state" className="mb-1">State</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => { handleChange({ name: 'state', value: value }) }}
            defaultValue={formData.state}
            required
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="zip">Zip</Label>
          <Input
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        {
          !company &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <span className="font-bold text-sm md:col-span-2">Default User</span>
            <div>
              <Label htmlFor="country">Email Address</Label>
              <Input
                id="defaultUser.emailAddress"
                name="defaultUser.emailAddress"
                type="email"
                value={formData.defaultUser.emailAddress}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="country">Password</Label>
              <Input
                id="defaultUser.password"
                name="defaultUser.password"
                type="password"
                value={formData.defaultUser.password}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>
        }
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
          {submitting ? 'Submitting' : company ? 'Update Company' : 'Add Company'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
