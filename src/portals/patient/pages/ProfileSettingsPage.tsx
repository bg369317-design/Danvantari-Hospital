import React, { useState } from 'react';
import { PatientProfile } from '@/types/patientPortal';
import { User, Phone, Lock, Bell, CheckCircle2 } from 'lucide-react';

interface ProfilePageProps {
  profile: PatientProfile;
}

export const ProfileSettingsPage: React.FC<ProfilePageProps> = ({ profile }) => {
  const [notificationPref, setNotificationPref] = useState<'both' | 'sms' | 'email'>('both');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Demonstration profile settings updated successfully in local session.');
    setTimeout(() => {
      setSaveStatus(null);
    }, 4000);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
          Profile &amp; Account Settings
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Registered patient demographics, emergency contacts, notification preferences, and account security.
        </p>
      </div>

      {saveStatus && (
        <div
          role="status"
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            color: '#15803D',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Demographic Details Summary */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <User size={18} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Personal Demographics</h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Full Name:
            </span>
            <strong>{profile.fullName}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Universal Health ID (UHID):
            </span>
            <strong style={{ color: 'var(--color-primary)' }}>{profile.uhid}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Age &amp; Gender:
            </span>
            <strong>{profile.age} Years • {profile.gender}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Blood Group:
            </span>
            <strong style={{ color: 'var(--color-error)' }}>{profile.bloodGroup}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Telephone:
            </span>
            <span>{profile.phone}</span>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Email Address:
            </span>
            <span>{profile.email}</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact & Branch Preference */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Phone size={18} color="var(--color-teal)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Emergency Contact &amp; Campus</h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Registered Emergency Contact:
            </span>
            <strong>{profile.emergencyContact}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
              Primary Hospital Facility:
            </span>
            <strong>{profile.primaryBranchName}</strong>
          </div>
        </div>
      </div>

      {/* Contact & Notification Preferences */}
      <form
        onSubmit={handleSavePreferences}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Bell size={18} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Appointment Notifications &amp; Reminders</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="notification"
              checked={notificationPref === 'both'}
              onChange={() => setNotificationPref('both')}
            />
            <span>SMS &amp; Email Reminders (48 hours &amp; 2 hours prior to consultation)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="notification"
              checked={notificationPref === 'sms'}
              onChange={() => setNotificationPref('sms')}
            />
            <span>SMS Only</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="notification"
              checked={notificationPref === 'email'}
              onChange={() => setNotificationPref('email')}
            />
            <span>Email Only</span>
          </label>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: 'var(--color-teal)',
            color: '#FFFFFF',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Save Preferences
        </button>
      </form>

      {/* Security & Password UI Placeholders */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Lock size={18} color="#D97706" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Security &amp; Portal Credentials</h3>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          In future development phases, authentic Supabase Auth MFA and password reset workflows will be integrated.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => alert('Security placeholder: Authentication provider will be configured in future milestones.')}
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Change Portal Password (Demo)
          </button>
          <button
            type="button"
            onClick={() => alert('Security placeholder: Multi-Factor Authentication (MFA) will be configured via Supabase.')}
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Enable Two-Factor Auth (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};
