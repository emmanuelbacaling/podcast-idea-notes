import { AlertTriangle } from 'lucide-react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-5 backdrop-blur-xs"
      role="presentation"
    >
      <div
        className="flex w-full max-w-80 flex-col items-center rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-3.5 rounded-full bg-red-50 p-3 text-red-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
        <div className="mt-5 flex w-full gap-2.5">
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-xl bg-red-500 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
