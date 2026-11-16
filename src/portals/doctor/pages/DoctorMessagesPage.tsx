import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  User,
  Send,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DoctorConversation } from '@/types/doctorPortal';

interface DoctorMessagesPageProps {
  conversations: DoctorConversation[];
  onSendMessage: (patientId: string, content: string) => void;
  onOpenPatientRecords: (patientId: string) => void;
}

const CLINICAL_REPLY_TEMPLATES = [
  'Please continue taking your prescribed medications on schedule.',
  'Your recent lab findings look stable. Keep monitoring your morning blood pressure.',
  'Please bring the hard copy of your previous ECG to the upcoming consultation.',
  'If you experience shortness of breath or persistent chest discomfort, seek immediate ER triage.',
];

export const DoctorMessagesPage: React.FC<DoctorMessagesPageProps> = ({
  conversations,
  onSendMessage,
  onOpenPatientRecords,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    conversations[0]?.patientId || 'pt-1'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const activeConversation = conversations.find((c) => c.patientId === selectedPatientId) || conversations[0];

  const filteredConversations = conversations.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientUhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    onSendMessage(activeConversation.patientId, messageInput.trim());
    setMessageInput('');
  };

  const handleApplyTemplate = (tmpl: string) => {
    setMessageInput(tmpl);
  };

  return (
    <div className="doctor-page-container" style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#EFF6FF',
              color: 'var(--color-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '0.5rem',
            }}
          >
            <MessageSquare size={14} />
            <span>Secure Clinical Communications</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Patient Inquiries &amp; Messages
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Asynchronous post-consultation queries, medication clarifications, and follow-up guidance.
          </p>
        </div>

        {/* Demo pill */}
        <div
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            color: '#92400E',
            fontSize: '0.75rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Info size={14} />
          <span>Demonstration Chat — Not for Emergency Use</span>
        </div>
      </div>

      {/* Main Chat Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 340px) 1fr',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          minHeight: '620px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {/* Left Sidebar: Conversations List */}
        <div
          style={{
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F8FAFC',
          }}
        >
          {/* Search Box */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Conversation List Items */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.patientId === conv.patientId;
                return (
                  <div
                    key={conv.patientId}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPatientId(conv.patientId)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedPatientId(conv.patientId)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--color-primary)' : '4px solid transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>
                        {conv.patientName}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginBottom: '0.35rem' }}>
                      {conv.patientUhid}
                    </div>

                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {conv.lastMessage}
                    </div>

                    {conv.unreadCount > 0 && (
                      <div style={{ marginTop: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: 'var(--color-primary)',
                            color: '#FFFFFF',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '9999px',
                          }}
                        >
                          {conv.unreadCount} new
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Conversation */}
        {activeConversation ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Conversation Header */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {activeConversation.patientName}
                  </h3>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                    ({activeConversation.patientUhid})
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Patient Inquiry Channel • Read-only external patient view available in Patient Portal
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onOpenPatientRecords(activeConversation.patientId)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    backgroundColor: '#EFF6FF',
                    color: 'var(--color-primary)',
                    border: '1px solid #BFDBFE',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <User size={14} />
                  <span>Open Chart</span>
                </button>
              </div>
            </div>

            {/* Non-Emergency Notice Banner */}
            <div
              style={{
                backgroundColor: '#FFFBEB',
                borderBottom: '1px solid #FDE68A',
                padding: '0.6rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#92400E',
              }}
            >
              <AlertTriangle size={14} />
              <span>
                <strong>Demonstration Channel:</strong> This messaging interface is for non-urgent post-consultation clarifications only. Never advise patients to use chat for emergency medical triage.
              </span>
            </div>

            {/* Messages Stream */}
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
              {activeConversation.messages.map((msg) => {
                const isDoctor = msg.sender === 'doctor';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isDoctor ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '0.85rem 1.15rem',
                        borderRadius: isDoctor ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        backgroundColor: isDoctor ? 'var(--color-primary)' : '#FFFFFF',
                        color: isDoctor ? '#FFFFFF' : 'var(--color-text)',
                        border: isDoctor ? 'none' : '1px solid var(--color-border)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          marginBottom: '0.25rem',
                          color: isDoctor ? '#93C5FD' : 'var(--color-teal)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {isDoctor ? 'Dr. Aarav Sharma (You)' : msg.patientName}
                      </div>
                      <div>{msg.content}</div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Clock size={11} />
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Response Templates */}
            <div
              style={{
                padding: '0.6rem 1rem',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                overflowX: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                <Sparkles size={13} color="var(--color-teal)" />
                <span>Quick:</span>
              </div>
              {CLINICAL_REPLY_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#F8FAFC',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  title={tmpl}
                >
                  {tmpl.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '1rem',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                placeholder="Type a clinical reply or instructions..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: messageInput.trim() ? 'var(--color-primary)' : '#CBD5E1',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                <Send size={15} />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            Select a conversation from the left to start viewing messages.
          </div>
        )}
      </div>
    </div>
  );
};
