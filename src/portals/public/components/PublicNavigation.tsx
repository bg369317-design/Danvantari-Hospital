import React, { useState } from 'react';
import { APP_CONFIG } from '@/config/app.config';
import { HospitalBranch } from '@/types/publicWebsite';
import {
  PhoneCall,
  Menu,
  X,
  Building,
  HeartPulse,
  Stethoscope,
  Shield,
  Calendar,
  ChevronDown,
} from 'lucide-react';

interface PublicNavigationProps {
  branches: HospitalBranch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  onNavigatePortal: (portalId: 'patient' | 'doctor' | 'admin') => void;
}

export const PublicNavigation: React.FC<PublicNavigationProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  onNavigatePortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState<boolean>(false);

  const activeBranch =
    branches.find((b) => b.id === selectedBranchId) ?? branches[0];

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Branches', href: '#branches' },
    { label: 'Specialties', href: '#specialties' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Health Packages', href: '#packages' },
    { label: 'Emergency', href: '#emergency' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top Clinical Strip: Demo Notice & Emergency */}
      <div
        style={{
          backgroundColor: 'var(--color-primary-dark)',
          color: '#FFFFFF',
          padding: '0.35rem 1.5rem',
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              backgroundColor: '#F59E0B',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.65rem',
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
            }}
          >
            DEMO
          </span>
          <span>Sample Information Platform — Non-Production Evaluation Build</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="#emergency"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#FCA5A5',
              fontWeight: 600,
            }}
          >
            <PhoneCall size={13} />
            <span>Emergency: Non-operational demo (Call 112 / 108 for real emergencies)</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#overview"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            +
          </div>
          <div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--color-primary-dark)',
                lineHeight: 1.1,
              }}
            >
              {APP_CONFIG.name}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--color-teal)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Public Healthcare Portal
            </div>
          </div>
        </a>

        {/* Branch Selector Quick Toggle (Desktop & Tablet) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <Building size={14} color="var(--color-primary)" />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeBranch?.name.split(' (')[0]}
            </span>
            <ChevronDown size={14} />
          </button>

          {branchDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                minWidth: '280px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.5rem',
                }}
              >
                Select Hospital Branch:
              </div>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onSelectBranch(b.id);
                    setBranchDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: b.id === selectedBranchId ? 700 : 500,
                    color: b.id === selectedBranchId ? 'var(--color-primary)' : 'var(--color-text)',
                    backgroundColor: b.id === selectedBranchId ? 'var(--color-primary-light)' : 'transparent',
                    display: 'block',
                  }}
                >
                  {b.name.replace(' (Sample Location)', '')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Anchor Navigation Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav-links"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                transition: 'color 0.15s ease',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Buttons: Book Consultation & Portal Access */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a
            href="#booking"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Calendar size={14} />
            <span>Book Appointment</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Responsive Inline Navigation Menu (Mobile & Tablet) */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  padding: '0.35rem 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Quick Shortcuts to Hospital Management Portals */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Switch to Hospital Portals:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigatePortal('patient');
                }}
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-dark)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <HeartPulse size={14} />
                <span>Patient Portal</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigatePortal('doctor');
                }}
                style={{
                  backgroundColor: 'var(--color-teal-light)',
                  color: 'var(--color-teal)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Stethoscope size={14} />
                <span>Doctor Portal</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigatePortal('admin');
                }}
                style={{
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Shield size={14} />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
