'use client';

import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error';
  children?: React.ReactNode;
}

export default function Modal({ open, onClose, title, message, type = 'success', children }: ModalProps) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="pa-modal-backdrop" onClick={onClose}>
      <div className="pa-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        <div className={`pa-modal-icon ${type}`}>
          <i className={`bi ${type === 'success' ? 'bi-check-lg' : 'bi-x-lg'}`} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        {children}
        <button className="pa-btn pa-btn-primary" onClick={onClose} type="button">
          OK
        </button>
      </div>
    </div>
  );
}