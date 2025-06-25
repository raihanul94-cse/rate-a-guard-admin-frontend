'use client';

import { useState, useCallback } from 'react';
import { ConfirmDialog, ConfirmDialogProps } from '@/components/ui/confirm-dialog.tsx';

type DialogOptions = Omit<Partial<ConfirmDialogProps>, 'open' | 'onOpenChange' | 'onConfirm'>;

export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState<() => void | Promise<void>>(() => () => {});
    const [options, setOptions] = useState<DialogOptions>({});

    const openDialog = useCallback((confirmCallback: () => void | Promise<void>, dialogOptions?: DialogOptions) => {
        setOnConfirm(() => confirmCallback);
        setOptions(dialogOptions || {});
        setIsOpen(true);
    }, []);

    const Dialog = (
        <ConfirmDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            title={options.title}
            description={options.description}
            confirmText={options.confirmText}
            cancelText={options.cancelText}
            onConfirm={onConfirm}
        />
    );

    return { openDialog, Dialog };
}
