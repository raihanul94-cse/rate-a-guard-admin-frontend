import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ITeamMember } from '@/types/api';
import { deleteTeamMember, getTeamMembers, inviteTeamMember } from '@/api/services/company-service';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { AxiosError } from 'axios';

interface InviteFormData {
    emailAddress: string;
}

const TeamMembers = () => {
    const { toast } = useToast();
    const { openDialog, Dialog: ConfirmDialog } = useConfirmDialog();
    const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [reload, setReload] = useState(0);

    const form = useForm<InviteFormData>({
        defaultValues: {
            emailAddress: ''
        }
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await getTeamMembers();

                if (res.status === 'success' && Array.isArray(res.data)) {
                    setTeamMembers(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [reload]);

    const handleReload = () => {
        setReload(Math.random());
    };

    const onSubmit = async (data: InviteFormData) => {
        try {
            const res = await inviteTeamMember(data.emailAddress);

            if (res.status === 'success') {
                toast({
                    title: "Invitation Sent",
                    description: `Invitation sent to ${data.emailAddress}`
                });
                setIsInviteDialogOpen(false);
                form.reset();
                handleReload();
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
        }
    };

    const handleDelete = async (uuid: string, emailAddress: string) => {
        try {
            const res = await deleteTeamMember(uuid);

            if (res.status === 'success') {
                toast({
                    title: "Member Removed",
                    description: `${emailAddress} has been removed from the team`
                });
                handleReload();
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
        }
    };

    const InviteForm = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter email address to invite"
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setIsInviteDialogOpen(false);
                            form.reset();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4" />
                        Send Invitation
                    </Button>
                </div>
            </form>
        </Form>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-gray-600 mt-2">Invite team members via email</p>
                </div>
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4" />
                            Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                        </DialogHeader>
                        <InviteForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member) => (
                            <TableRow key={member.uuid}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    {member.emailAddress}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {member.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            openDialog(() => handleDelete(member.uuid, member.emailAddress), {
                                                title: 'Delete this company?',
                                                description: 'This action will permanently remove the team member and cannot be undone.',
                                                confirmText: 'Delete',
                                                cancelText: 'Cancel',
                                            })
                                        }
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {ConfirmDialog}
        </div>
    );
};

export default TeamMembers;