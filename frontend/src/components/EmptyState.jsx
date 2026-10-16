import { TagIcon } from './Icons';

const EmptyState = ({ title = 'Nothing here yet', description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 rotate-[-6deg]">
      <TagIcon size={28} />
    </div>
    <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
