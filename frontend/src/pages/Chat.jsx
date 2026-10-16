import { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { useSocket } from '../context/SocketContext';
import { getConversations, getConversationById } from '../services/chatService';

const Chat = () => {
  const location = useLocation();
  const { conversationId } = useParams();
  const { socket, onlineUserIds } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getConversations();
      setConversations(data.conversations);

      const preselectId = conversationId || location.state?.conversationId;
      if (preselectId) {
        const match = data.conversations.find((c) => c._id === preselectId);
        if (match) {
          setActive(match);
        } else {
          const { data: single } = await getConversationById(preselectId);
          setActive(single.conversation);
        }
      } else if (data.conversations.length > 0) {
        setActive((prev) => prev || data.conversations[0]);
      }
    } finally {
      setLoading(false);
    }
  }, [conversationId, location.state]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!socket) return undefined;
    const handler = () => load();
    socket.on('message:new', handler);
    return () => socket.off('message:new', handler);
  }, [socket, load]);

  const handleSelect = (c) => {
    setActive(c);
    setConversations((prev) => prev.map((x) => (x._id === c._id ? { ...x, unreadCount: 0 } : x)));
  };

  return (
    <MainLayout hideFooter>
      <div className="card grid h-[calc(100vh-6rem)] min-h-[28rem] grid-cols-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden md:grid-cols-3 md:grid-rows-1">
        <div className="scroll-quiet max-h-60 overflow-y-auto border-b border-ink/[.06] md:col-span-1 md:max-h-none md:border-b-0 md:border-r">
          {loading ? (
            <Loading />
          ) : (
            <ChatList
              conversations={conversations}
              activeId={active?._id}
              onSelect={handleSelect}
              onlineUserIds={onlineUserIds}
            />
          )}
        </div>
        <div className="min-h-0 md:col-span-2 md:h-full">
          {active ? (
            <ChatWindow conversation={active} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                title="Select a conversation"
                description="Choose a conversation from the list, or message a seller from a product page."
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
