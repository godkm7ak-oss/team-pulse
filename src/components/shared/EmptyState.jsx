export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-heading font-semibold text-lg text-white mb-2">{title}</h3>
      {description && <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary px-6 py-3 text-sm">
          {action.label}
        </button>
      )}
    </div>
  )
}
