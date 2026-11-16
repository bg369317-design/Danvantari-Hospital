import React, { useState } from 'react';
import { HospitalBranch, ContactFormState } from '@/types/publicWebsite';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';
import { DemoBadge } from '@/portals/public/components/DemoBadge';

interface ContactSectionProps {
  branches: HospitalBranch[];
  selectedBranchId: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  branches,
  selectedBranchId,
}) => {
  const [formData, setFormData] = useState<ContactFormState>({
    fullName: '',
    phone: '',
    email: '',
    branchId: selectedBranchId,
    subject: 'General Clinical Enquiry',
    message: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setValidationError('Please complete your name, telephone, and enquiry message.');
      return;
    }

    setValidationError(null);
    setIsSent(true);
  };

  return (
    <section
      id="contact"
      style={{
        padding: '4rem 1.5rem',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <DemoBadge label="Contact Desk &amp; Campus Locations" />
          </div>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Get in Touch &amp; Campus Locations
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Have questions regarding patient admissions, diagnostic test timings, or doctor schedules? Our administrative helpdesk is available across all hospital locations.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Left Column: Branch Contact Cards */}
          <div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-primary-dark)',
                marginBottom: '1rem',
              }}
            >
              Hospital Campuses Directory
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {branches.map((b) => (
                <div
                  key={b.id}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Building size={18} color="var(--color-primary)" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      {b.name.replace(' (Sample Location)', '')}
                    </h4>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    {b.address}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>
                    <div style={{ marginBottom: '0.2rem' }}>
                      <strong>Helpline:</strong> {b.phone}
                    </div>
                    <div>
                      <strong>Casualty:</strong> <span style={{ color: 'var(--color-error)' }}>{b.emergencyPhone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-primary-dark)',
                marginBottom: '0.5rem',
              }}
            >
              Send an Administrative Enquiry
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              For non-emergency questions, feedback, or health check-up queries.
            </p>

            {isSent ? (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.75rem',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={36} color="#15803D" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ color: '#166534', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Demo Message Received
                </h4>
                <p style={{ color: '#166534', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  This is a demonstration form simulation. In production, this enquiry will be routed to the respective hospital branch administration team.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                  }}
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {validationError && (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      color: 'var(--color-error)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <AlertCircle size={15} />
                    <span>{validationError}</span>
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <label
                    htmlFor="contact-name"
                    style={{
                      display: 'block',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sunita Devi"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--color-bg)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <label
                      htmlFor="contact-phone"
                      style={{
                        display: 'block',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Telephone *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 00000"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.875rem',
                        backgroundColor: 'var(--color-bg)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-branch"
                      style={{
                        display: 'block',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Target Branch
                    </label>
                    <select
                      id="contact-branch"
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.875rem',
                        backgroundColor: 'var(--color-bg)',
                        outline: 'none',
                      }}
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name.replace(' (Sample Location)', '')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label
                    htmlFor="contact-message"
                    style={{
                      display: 'block',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Your Message / Question *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please write your questions here..."
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--color-bg)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--color-teal)',
                    color: '#FFFFFF',
                    padding: '0.65rem 1.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Send size={16} />
                  <span>Send Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
