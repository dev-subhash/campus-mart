const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex min-w-0 ${isOwn ? 'justify-end' : 'justify-start'} mb-2.5 px-1`}>
    <div
      className={`min-w-0 w-fit max-w-[min(75%,34rem)] px-4 py-2.5 text-sm shadow-sm ${
        isOwn
          ? 'rounded-2xl rounded-br-md bg-[#d9fdd3] text-ink'
          : 'rounded-2xl rounded-bl-md bg-white text-ink ring-1 ring-ink/[.06]'
      }`}
    >
      <p className="whitespace-pre-wrap [overflow-wrap:anywhere] leading-relaxed">{message.text}</p>
      <p className={`mt-1 text-[10px] font-medium ${isOwn ? 'text-ink-soft' : 'text-ink-mute'}`}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {isOwn && message.status === 'read' ? ' · Read' : ''}
      </p>
    </div>
  </div>
);

export default MessageBubble;
