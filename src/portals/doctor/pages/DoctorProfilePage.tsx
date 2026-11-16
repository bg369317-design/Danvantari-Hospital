import React, { useState } from 'react';
import {
  User,
  Award,
  Building2,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle,
  Bell,
  Stethoscope,
  Info,
} from 'lucide-react';
import { DoctorProfileData } from '@/types/doctorPortal';

interface DoctorProfilePageProps {
  profile: DoctorProfileData;
  onUpdateProfile: (updated: Partial<DoctorProfileData>) => void;
}

export const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    title: profile.title,
    bio: profile.bio,
    opdTimings: profile.opdTimings,
    consultationFee: profile.consultationFee,
    phone: profile.phone,
    email: profile.email,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    statLabAlerts: true,
    emergencyReferrals: true,
    teleconsultReminders: true,
  });

  const [slotDuration, setSlotDuration] = useState('20');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveBanner('Physician profile and clinical practice preferences updated successfully (Demonstration Session).');
    setTimeout(() => setSaveBanner(null), 3500);
  };

  return (
    <div className="doctor-page-container" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
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
            <User size={14} />
            <span>Staff Credentialing &amp; Settings</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Physician Profile &amp; Settings
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage your credentials, departmental affiliation, OPD schedule, and clinical practice preferences.
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
          <span>Fictional Demonstration Physician Profile</span>
        </div>
      </div>

      {/* Success Notification */}
      {saveBanner && (
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <CheckCircle size={16} />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Profile Card Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            border: '2px solid #BFDBFE',
          }}
        >
          <Stethoscope size={40} />
        </div>

        <div style={{ flex: '1 1 320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {profile.fullName}
            </h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: '#F0FDF4',
                color: '#16A34A',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                border: '1px solid #DCFCE7',
              }}
            >
              <ShieldCheck size={12} />
              <span>Verified Credentialed Staff (Demo)</span>
            </span>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
            {profile.title} — {profile.specialtyName}
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={14} />
              Registration: <strong style={{ color: 'var(--color-text)' }}>{profile.registrationNumber}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              Clinical Experience: <strong style={{ color: 'var(--color-text)' }}>{profile.experienceYears}+ Years</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building2 size={14} />
              Branches: <strong style={{ color: 'var(--color-text)' }}>{profile.assignedBranches.length} Campuses</strong>
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Clinical Profile Information */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Professional Credentials
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Physician Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Designation / Academic Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Medical Council Registration No. (Demonstration)
                </label>
                <input
                  type="text"
                  disabled
                  value={profile.registrationNumber}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#F8FAFC',
                    color: 'var(--color-text-muted)',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  Fictional medical license identifier for demonstration testing.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Academic Qualifications
                </label>
                <input
                  type="text"
                  disabled
                  value={profile.qualifications}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#F8FAFC',
                    color: 'var(--color-text-muted)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Clinical Biography &amp; Areas of Focus
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Outpatient Practice & Settings */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Practice Preferences &amp; Schedule
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Standard OPD Hours
                </label>
                <input
                  type="text"
                  value={formData.opdTimings}
                  onChange={(e) => setFormData({ ...formData, opdTimings: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Outpatient Consultation Fee (Demonstration)
                </label>
                <input
                  type="text"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                    Contact Phone
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.55rem 0.55rem 2rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                    Hospital Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.55rem 0.55rem 2rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Default Consultation Slot Duration
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="15">15 Minutes (Brief Follow-up)</option>
                  <option value="20">20 Minutes (Standard Clinical Review)</option>
                  <option value="30">30 Minutes (Comprehensive Cardiology Initial)</option>
                </select>
              </div>

              {/* Assigned Branches Section */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={15} color="var(--color-teal)" />
                  <span>Credentialed Branch Assignments ({profile.assignedBranches.length})</span>
                </h4>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Hospital facilities where this physician holds active clinical privileges. Admin users manage these assignments.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.assignedBranches.map((branch) => (
                    <div
                      key={branch.id}
                      style={{
                        padding: '0.6rem 0.85rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-text)' }}>
                          {branch.name}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                          {branch.address}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: '#DCFCE7',
                          color: '#15803D',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                        }}
                      >
                        Active Privileges
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={15} color="var(--color-primary)" />
                  <span>Clinical Alert Notifications</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.statLabAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, statLabAlerts: e.target.checked })}
                    />
                    <span>Notify immediately on STAT abnormal pathology results</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emergencyReferrals}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emergencyReferrals: e.target.checked })}
                    />
                    <span>Priority alerts for inpatient &amp; emergency referrals</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.teleconsultReminders}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, teleconsultReminders: e.target.checked })}
                    />
                    <span>Send appointment queue reminder 10 minutes prior</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <Save size={16} />
            <span>Save Profile &amp; Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
