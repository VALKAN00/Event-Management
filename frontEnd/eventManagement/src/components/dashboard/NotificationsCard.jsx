export default function NotificationsCard({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <img src={icon} alt={title} className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900 leading-tight truncate">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-700 leading-tight truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
