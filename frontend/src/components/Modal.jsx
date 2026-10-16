import { CloseIcon } from './Icons';

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-pop animate-pop sm:rounded-3xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="-mr-2 -mt-1 rounded-full p-2 text-ink-mute transition hover:bg-paper hover:text-ink"
            aria-label="Close"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="text-ink-soft">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
