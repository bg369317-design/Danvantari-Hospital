import React, { useState } from 'react';
import { SupportMessage } from '@/types/patientPortal';
import { MessageSquare, Send } from 'lucide-react';

interface MessagesPageProps {
  initialMessages: SupportMessage[];
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');

    // Simulate auto desk response
    setTimeout(() => {
      const replyMsg: SupportMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'desk',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content:
          'Thank you for your message. Your enquiry has been received by the hospital front desk demonstration queue. An administrative coordinator will follow up.',
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} color="var(--color-teal)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Patient Support &amp; Enquiries (Demo Conversation)
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Non-operational simulated communication channel.
            </p>
          </div>
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
            }}
          >
            Coordinator Active (Demo)
          </span>
        </div>

        {/* Message Stream */}
        <div
          style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#F8FAFC',
          }}
        >
          {messages.map((msg) => {
            const isPatient = msg.sender === 'patient';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    textAlign: 'center',
                    margin: '0.25rem auto',
                    maxWidth: '85%',
                  }}
                >
                  {msg.content}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isPatient ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    backgroundColor: isPatient ? 'var(--color-primary)' : '#FFFFFF',
                    color: isPatient ? '#FFFFFF' : 'var(--color-text)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    border: isPatient ? 'none' : '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isPatient ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-teal)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {isPatient ? 'You (Patient)' : 'Hospital Desk Coordinator'} • {msg.timestamp}
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write a message to hospital support (demo)..."
            aria-label="Write a message to hospital support"
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              fontSize: '0.875rem',
              outline: 'none',
              color: 'var(--color-text)',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Send size={15} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
