import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createContext, useContext, useState, type ReactNode } from 'react';

type IConfirmContext = {
  confirm: (onConfirm: () => void, config?: IconfirmOptions['config']) => void;
};

type IconfirmOptions = {
  onConfirm: () => void;
  config?: { message?: string; variant?: 'primary' | 'destructive' };
};

type IConfirmDialog = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  variant?: 'primary' | 'destructive';
};

const ConfirmContext = createContext<IConfirmContext | undefined>(undefined);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<IconfirmOptions | null>(null);

  function confirm(onConfirm: () => void, config?: IconfirmOptions['config']) {
    setOptions({ onConfirm, config });
  }

  function handleConfirm() {
    options?.onConfirm();
    setOptions(null);
  }

  function handleCancel() {
    setOptions(null);
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <ConfirmDialog
          isOpen={Boolean(options)}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          title={options.config?.message}
          variant={options.config?.variant}
        />
      )}
    </ConfirmContext.Provider>
  );
}

function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Do you really want to proceed?',
  variant = 'primary',
}: IConfirmDialog) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Action buttons */}
        <DialogFooter className="flex flex-row justify-end">
          <button
            onClick={onCancel}
            className="border border-muted-foreground/70 text-muted-foreground/70 px-5 py-2 rounded-full font-medium">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${
              variant == 'destructive' ? 'bg-destructive' : 'bg-primary'
            } text-white px-5 py-2 rounded-full font-medium disabled:bg-muted-foreground/30`}>
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
