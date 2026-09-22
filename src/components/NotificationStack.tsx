'use client';

import { useNotifications } from '@/context/NotificationContext';

const ICONS: Record<string, string> = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
};

export default function NotificationStack() {
  const { notifications, dismiss } = useNotifications();

  if (!notifications.length) return null;

  return (
    <div className="pa-notif-stack" role="status" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={`pa-notif ${n.type}`}>
          <i className={`bi ${ICONS[n.type] || ICONS.info}`} aria-hidden />
          <div className="pa-notif-body">
            <span>{n.message}</span>
            {n.action && (
              <button className="pa-notif-action" onClick={n.action.onClick} type="button">
                {n.action.label}
              </button>
            )}
          </div>
          <button className="pa-notif-close" onClick={() => dismiss(n.id)} aria-label="close" type="button">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      ))}
    </div>
  );
}