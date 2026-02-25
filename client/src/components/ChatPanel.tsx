import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useSubscription } from '@apollo/client';
import { X, Send, Bot, User } from 'lucide-react';
import { SEND_MESSAGE } from '../graphql/mutations';
import { MESSAGE_SENT } from '../graphql/subscriptions';
import StatusIndicator from './StatusIndicator';
import {
  colors,
  chatPanelStyles,
  inputStyles,
  avatarStyles,
  spacing,
  typography,
  radius,
} from '../styles/theme';
import type { Employee, ChatMessage } from '../types';

interface ChatPanelProps {
  employee: Employee | null;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ employee, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      const msg = data.sendMessage as ChatMessage;
      setMessages((prev) => [...prev, msg]);
    },
  });

  // Subscribe to incoming messages
  useSubscription(MESSAGE_SENT, {
    variables: { recipientId: 'user' },
    skip: !employee,
    onData: ({ data: subscriptionData }) => {
      if (!subscriptionData.data) return;
      const msg = subscriptionData.data.messageSent as ChatMessage;
      if (employee && msg.senderId === employee.id) {
        setMessages((prev) => [...prev, msg]);
      }
    },
  });

  // Reset messages when switching employees
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [employee?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !employee) return;

    sendMessage({
      variables: {
        input: {
          recipientId: employee.id,
          content: input.trim(),
        },
      },
    });
    setInput('');
  };

  return (
    <AnimatePresence>
      {employee && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={chatPanelStyles}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              padding: `${spacing.lg} ${spacing.xl}`,
              borderBottom: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}
          >
            <div style={{ position: 'relative' }}>
              <div style={avatarStyles(40, employee.avatarColor)}>
                {employee.initials}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: colors.bgCard,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StatusIndicator status={employee.status} size={8} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  ...typography.h3,
                  fontSize: '15px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {employee.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                {employee.type === 'ai' ? (
                  <Bot size={11} style={{ color: colors.textMuted }} />
                ) : (
                  <User size={11} style={{ color: colors.textMuted }} />
                )}
                <span
                  style={{
                    ...typography.caption,
                    color: colors.textMuted,
                    fontSize: '11px',
                  }}
                >
                  {employee.title}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: colors.textMuted,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
              }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: spacing.xl,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.md,
                  color: colors.textMuted,
                }}
              >
                <div style={avatarStyles(64, employee.avatarColor)}>
                  {employee.initials}
                </div>
                <div style={{ ...typography.body, textAlign: 'center' }}>
                  Start a conversation with {employee.name}
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isOwn = msg.senderId === 'user' || msg.senderId !== employee.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderRadius: radius.lg,
                      backgroundColor: isOwn
                        ? colors.tealMuted
                        : colors.bgSurface,
                      border: `1px solid ${
                        isOwn ? 'rgba(42,181,178,0.3)' : colors.border
                      }`,
                      color: colors.textPrimary,
                      fontSize: '13px',
                      fontFamily: typography.fontFamily,
                      lineHeight: '20px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                    <div
                      style={{
                        ...typography.caption,
                        fontSize: '10px',
                        color: colors.textMuted,
                        marginTop: spacing.xs,
                        textAlign: isOwn ? 'right' : 'left',
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSend}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.lg} ${spacing.xl}`,
              borderTop: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}
          >
            <input
              style={{
                ...inputStyles,
                flex: 1,
                borderRadius: radius.full,
                paddingLeft: spacing.xl,
                paddingRight: spacing.xl,
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${employee.name}...`}
              disabled={sending}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={sending || !input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: radius.full,
                backgroundColor: input.trim() ? colors.teal : colors.bgInput,
                border: 'none',
                color: input.trim() ? colors.white : colors.textMuted,
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
