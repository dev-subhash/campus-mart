import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getMessages, sendMessage as sendMessageApi } from '../services/chatService';
import MessageBubble from './MessageBubble';
import Loading from './Loading';
import Avatar from './Avatar';
import { SendIcon } from './Icons';

const ChatWindow = ({ conversation }) => {
  const { user } = useAuth();
  const { socket, onlineUserIds } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherTyping, setOtherTyping] = useState(false);
  const bottomRef = useRef(null);
  const composerRef = useRef(null);
  const typingTimeout = useRef(null);

  const other = conversation.participants.find((p) => p._id !== user._id);

  useEffect(() => {
    setLoading(true);
    getMessages(conversation._id)
      .then(({ data }) => setMessages(data.messages))
      .finally(() => setLoading(false));
  }, [conversation._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return undefined;

    const onNewMessage = (message) => {
      if (message.conversationId === conversation._id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    const onTypingStart = ({ conversationId, fromUserId }) => {
      if (conversationId === conversation._id && fromUserId === other._id) setOtherTyping(true);
    };
    const onTypingStop = ({ conversationId, fromUserId }) => {
      if (conversationId === conversation._id && fromUserId === other._id) setOtherTyping(false);
    };

    socket.on('message:new', onNewMessage);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);

    return () => {
      socket.off('message:new', onNewMessage);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
    };
  }, [socket, conversation._id, other._id]);

  const handleTyping = (value) => {
    setText(value);
    if (composerRef.current) {
      composerRef.current.style.height = 'auto';
      composerRef.current.style.height = `${Math.min(composerRef.current.scrollHeight, 112)}px`;
    }
    if (!socket) return;
    socket.emit('typing:start', { conversationId: conversation._id, toUserId: other._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId: conversation._id, toUserId: other._id });
    }, 1500);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    if (composerRef.current) composerRef.current.style.height = 'auto';
    const { data } = await sendMessageApi(conversation._id, trimmed);
    setMessages((prev) => [...prev, data.message]);
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form.requestSubmit();
    }
  };

  const isOnline = onlineUserIds?.has(other._id);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-ink/[.06] bg-white px-4 py-3">
        <div className="relative">
          <Avatar person={other} size={40} ring={false} />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold">{other.name}</p>
          <p className={`text-xs font-medium ${otherTyping || isOnline ? 'text-emerald-600' : 'text-ink-mute'}`}>
            {otherTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="chat-wallpaper scroll-quiet min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-5">
        {loading ? (
          <Loading label="Loading messages..." />
        ) : messages.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-mute">
            Say hello to start the conversation 👋
          </p>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m._id} message={m} isOwn={m.sender._id === user._id} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-ink/[.06] bg-white p-3">
        <textarea
          ref={composerRef}
          className="input min-h-12 max-h-28 min-w-0 !resize-none !rounded-2xl !bg-paper !px-4 !py-3 !leading-5 !ring-0 focus:!ring-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleComposerKeyDown}
          rows={1}
          style={{ resize: 'none', overflowY: 'auto', overflowWrap: 'anywhere' }}
          aria-label="Message"
        />
        <button
          type="submit"
          className="btn-primary shrink-0 !rounded-full !px-5"
          disabled={!text.trim()}
          aria-label="Send"
        >
          <span className="hidden sm:inline">Send</span>
          <SendIcon size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
