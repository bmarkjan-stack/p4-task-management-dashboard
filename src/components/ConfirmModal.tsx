import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Generic confirmation dialog, used in place of window.confirm() for
 * destructive actions that can't easily be undone (e.g. deleting a whole
 * board along with every task in it). Single-task deletes use an optimistic
 * delete + undo toast instead — see Toast.tsx.
 */
function ConfirmModal({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <div className="modal-overlay" role="presentation" onClick={onCancel}>
            <div
                className="modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-icon">
                    <AlertTriangle size={22} />
                </div>
                <h2 id="confirm-modal-title">{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className="danger-button"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
