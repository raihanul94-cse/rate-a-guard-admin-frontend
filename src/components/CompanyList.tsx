
import { useEffect, useState } from 'react';
import { Edit, Eye, Trash2, Plus, Check, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CompanyForm from './CompanyForm';
import CompanyDetails from './CompanyDetails';
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
  updateStatusCompany
} from '@/api/services/company-service';
import { ICompany } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useConfirmDialog } from "@/hooks/use-confirm-dialog.tsx";
import {AxiosError} from "axios";
import CompanyDefaultUserForm from "@/components/CompanyDefaultUserForm.tsx";

const CompanyList = () => {
  const { toast } = useToast();
  const { openDialog, Dialog: ConfirmDialog } = useConfirmDialog();
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDefaultUserDialogOpen, setIsDefaultUserDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reload, setReload] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCompanies({ licenseNumber: searchTerm });

        if (res.status === 'success' && Array.isArray(res.data)) {
          setCompanies(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [reload, searchTerm]);

  const handleReload = () => {
    setReload(Math.random());
  };

  const handleEdit = (company: ICompany) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDefaultUser = (company: ICompany) => {
    setSelectedCompany(company);
    setIsDefaultUserDialogOpen(true);
  };

  const handleView = (company: ICompany) => {
    setSelectedCompany(company);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    try{
      const res = await deleteCompany(uuid);

      if (res.status === 'success'){
        toast({
          title: "Success",
          description: "Company deleted successfully",
        });
        handleReload();
      }
    }catch (err: unknown){
      const error = err as AxiosError<{ error: { message: string } }>;

      if (error?.response?.data){
        toast({
          title: "Error",
          description: error?.response?.data?.error?.message ?? 'Something went wrong',
          variant: "destructive",
        });
      }
    }
  };

  const handleApprove = async (uuid: string) => {
    try{
      const res = await updateStatusCompany(uuid, "approved");

      if (res.status === 'success'){
        toast({
          title: "Success",
          description: "Company approved successfully",
        });
        handleReload();
      }
    }catch (err: unknown){
      const error = err as AxiosError<{ error: { message: string } }>;

      if (error?.response?.data){
        toast({
          title: "Error",
          description: error?.response?.data?.error?.message ?? 'Something went wrong',
          variant: "destructive",
        });
      }
    }
  };

  const handleRejectClick = (company: ICompany) => {
    setSelectedCompany(company);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (selectedCompany && rejectionReason.trim()) {
      try{
        const res = await updateStatusCompany(selectedCompany.uuid, "rejected", rejectionReason);

        if (res.status === 'success'){
          toast({
            title: "Success",
            description: "Company rejected successfully",
          });
          handleReload();
          setIsRejectDialogOpen(false);
          setSelectedCompany(null);
          setRejectionReason('');
        }
      }catch (err: unknown){
        const error = err as AxiosError<{ error: { message: string } }>;

        if (error?.response?.data){
          toast({
            title: "Error",
            description: error?.response?.data?.error?.message ?? 'Something went wrong',
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleSave = async (updatedCompany: ICompany) => {
    if (updatedCompany.uuid) {
      setSubmitting(true);

      try {
        const res = await updateCompany(updatedCompany.uuid, {
          ...updatedCompany
        });

        if (res.status === 'success') {
          toast({
            title: "Success",
            description: "Company updated successfully",
          });
          setIsEditDialogOpen(false);
          setSelectedCompany(null);
          handleReload();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(true);

      try {
        const res = await createCompany({
          ...updatedCompany,
          defaultUserEmailAddress: updatedCompany.defaultUser.emailAddress,
          defaultUserPassword: updatedCompany.defaultUser.password
        });

        if (res.status === 'success') {
          toast({
            title: "Success",
            description: "Company added successfully",
          });
          setIsEditDialogOpen(false);
          setSelectedCompany(null);
          handleReload();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleAdd = () => {
    setSelectedCompany(null);
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: ICompany['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Agent Name</TableHead>
              <TableHead>Agent Email</TableHead>
              <TableHead>Agent Phone</TableHead>
              <TableHead>Default User Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.uuid}>
                <TableCell className="font-medium">{company.companyName}</TableCell>
                <TableCell>{company.registeredAgentFirstName} {company.registeredAgentLastName}</TableCell>
                <TableCell>{company.emailAddress}</TableCell>
                <TableCell>{company.phoneNumber}</TableCell>
                <TableCell>{company.defaultUser.emailAddress}</TableCell>
                <TableCell>
                  <span className={getStatusBadge(company.status)}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(company)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(company)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDefaultUser(company)}
                    >
                      <Lock className="w-4 h-4" />
                    </Button>
                    {company.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                              openDialog(() => handleApprove(company.uuid), {
                                title: 'Approve this company?',
                                description: 'Are you sure you want to approve this company? This action can be undone later if needed.',
                                confirmText: 'Approve',
                                cancelText: 'Cancel',
                              })
                          }
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectClick(company)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                          openDialog(() => handleDelete(company.uuid), {
                            title: 'Delete this company?',
                            description: 'This action will permanently remove the company and cannot be undone.',
                            confirmText: 'Delete',
                            cancelText: 'Cancel',
                          })
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {companies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No companies found matching your search.
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCompany ? 'Edit Company' : 'Add Company'}
            </DialogTitle>
          </DialogHeader>
          <CompanyForm
            company={selectedCompany}
            onSave={handleSave}
            onCancel={() => setIsEditDialogOpen(false)}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>
          {selectedCompany && <CompanyDetails company={selectedCompany} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isDefaultUserDialogOpen} onOpenChange={setIsDefaultUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Default User Password</DialogTitle>
          </DialogHeader>
          {selectedCompany && <CompanyDefaultUserForm company={selectedCompany} onCancel={() => setIsDefaultUserDialogOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {ConfirmDialog}
    </div>
  );
};

export default CompanyList;
