import { useAuth } from '../context/AuthContext';
import EmptyState from './EmptyState';
import Avatar from './Avatar';

const ChatList = ({ conversations, activeId, onSelect, onlineUserIds }) => {
  const { user } = useAuth();

  if (!conversations || conversations.length === 0) {
    return (
      <EmptyState
        title="No conversations yet"
        description="Message a seller from a product page to start chatting."
      />
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map((c) => {
        const other = c.participants.find((p) => p._id !== user._id);
        const isOnline = onlineUserIds?.has(other?._id);
        const isActive = activeId === c._id;
        return (
          <button
            key={c._id}
            onClick={() => onSelect(c)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
              isActive ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-paper'
            }`}
          >
            <div className="relative shrink-0">
              <Avatar person={other} size={42} ring={false} />
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold">{other?.name}</p>
                {c.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-marigold px-1.5 text-[10px] font-extrabold text-ink">
                    {c.unreadCount}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-ink-soft">
                {c.lastMessage?.text || 'Say hello 👋'}
              </p>
              {c.product && (
                <p className="mt-0.5 truncate text-[11px] font-semibold text-brand-600">Re: {c.product.title}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChatList;
