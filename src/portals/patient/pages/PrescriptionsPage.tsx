import React, { useState } from 'react';
import { PrescriptionItem, PrescriptionStatus } from '@/types/patientPortal';
import {
  Pill,
  Printer,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  CheckCircle2,
  User,
  Info,
  X,
} from 'lucide-react';

interface PrescriptionsPageProps {
  prescriptions: PrescriptionItem[];
}

export const PrescriptionsPage: React.FC<PrescriptionsPageProps> = ({ prescriptions }) => {
  const [statusFilter, setStatusFilter] = useState<'All' | PrescriptionStatus>('All');
  const [selectedRxIds, setSelectedRxIds] = useState<string[]>([]);
  const [viewingRx, setViewingRx] = useState<PrescriptionItem | null>(null);

  const filteredPrescriptions = prescriptions.filter((rx) =>
    statusFilter === 'All' ? true : rx.status === statusFilter
  );

  const toggleSelectRx = (id: string) => {
    setSelectedRxIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredPrescriptions.map((rx) => rx.id);
    setSelectedRxIds(visibleIds);
  };

  const handleClearSelection = () => {
    setSelectedRxIds([]);
  };

  const handlePrintSelected = () => {
    const selectedItems = prescriptions.filter((rx) => selectedRxIds.includes(rx.id));
    if (selectedItems.length === 0) return;

    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      alert('Pop-up was blocked. Please allow pop-ups for this site to view the printable patient copy.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Prescription Summary – Danvantari Hospital (Patient Copy Demo)</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.45;
            margin: 0;
            padding: 20px;
            font-size: 13px;
          }
          .header {
            border-bottom: 2px solid #0284c7;
            padding-bottom: 12px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .hospital-name {
            font-size: 20px;
            font-weight: 800;
            color: #0369a1;
            letter-spacing: -0.5px;
          }
          .hospital-sub {
            font-size: 11px;
            color: #64748b;
          }
          .demo-banner {
            background-color: #fef2f2;
            border: 1.5px dashed #ef4444;
            color: #991b1b;
            padding: 8px 12px;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            border-radius: 4px;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .patient-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 10px 14px;
            margin-bottom: 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 12px;
          }
          .rx-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 14px;
            page-break-inside: avoid;
          }
          .rx-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }
          .rx-title {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
          }
          .rx-meta {
            font-size: 11px;
            color: #64748b;
          }
          .rx-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 12px;
            margin-top: 8px;
            font-size: 12px;
          }
          .label {
            font-weight: 600;
            color: #475569;
          }
          .instructions-box {
            margin-top: 8px;
            background-color: #f1f5f9;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 11px;
            color: #334155;
          }
          .footer {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #64748b;
            text-align: center;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">DANVANTARI HOSPITAL</div>
            <div class="hospital-sub">Comprehensive Clinical Healthcare Network (Demonstration System)</div>
            <div class="hospital-sub">Central Outpatient Pharmacy Registry</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: #0f172a;">PATIENT MEDICATION SUMMARY</div>
            <div class="hospital-sub">Print Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        <div class="demo-banner">
          Patient Copy – Demonstration Only – Not a Valid Prescription for Dispensing
        </div>

        <div class="patient-box">
          <div><strong>Patient Name:</strong> Rahul Sharma (Simulated)</div>
          <div><strong>Patient UHID:</strong> DH-BLR-2026-44910</div>
          <div><strong>Age / Gender:</strong> 42 Yrs / Male</div>
          <div><strong>Total Prescriptions Selected:</strong> ${selectedItems.length}</div>
        </div>

        ${selectedItems
          .map(
            (rx, idx) => `
          <div class="rx-card">
            <div class="rx-header">
              <div>
                <span style="font-weight: 800; color: #0284c7; margin-right: 6px;">#${idx + 1}</span>
                <span class="rx-title">${rx.medicationName}</span>
              </div>
              <div class="rx-meta">
                Ref Code: <strong>${rx.rxCode}</strong> | Status: <strong>${rx.status}</strong>
              </div>
            </div>
            <div class="rx-details-grid">
              <div><span class="label">Dosage & Strength:</span> ${rx.dosage}</div>
              <div><span class="label">Frequency:</span> ${rx.frequency}</div>
              <div><span class="label">Duration:</span> ${rx.duration}</div>
              <div><span class="label">Prescribed Date:</span> ${rx.prescribedDate}</div>
              <div style="grid-column: 1 / -1;"><span class="label">Prescribing Physician:</span> ${rx.doctorName} (${rx.doctorSpecialty})</div>
            </div>
            <div class="instructions-box">
              <strong>Instructions:</strong> ${rx.instructions}
            </div>
          </div>
        `
          )
          .join('')}

        <div class="footer">
          <p>Important Notice: This printed document is generated as an archival patient demonstration record. It is not an authorized medical e-prescription and cannot be filled, substituted, or dispensed by commercial or hospital pharmacies.</p>
          <p>Danvantari Hospital Demonstration Network • Department of Pharmacy Information Systems</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Clock size={12} />
            <span>Active Regimen</span>
          </span>
        );
      case 'Completed':
        return (
          <span
            style={{
              backgroundColor: '#EFF6FF',
              color: 'var(--color-primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <CheckCircle2 size={12} />
            <span>Completed Course</span>
          </span>
        );
      case 'Inactive / Expired':
        return (
          <span
            style={{
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <AlertCircle size={12} />
            <span>Inactive / Expired</span>
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Pill size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Prescriptions &amp; Medication Schedules
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Verified physician consultation medication records, active dosage regimens, and printable patient copies.
            </p>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {selectedRxIds.length > 0 && (
              <button
                type="button"
                onClick={handlePrintSelected}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Printer size={16} />
                <span>Print Selected ({selectedRxIds.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={selectedRxIds.length === filteredPrescriptions.length ? handleClearSelection : handleSelectAllVisible}
              style={{
                backgroundColor: '#F8FAFC',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
              }}
            >
              {selectedRxIds.length === filteredPrescriptions.length && filteredPrescriptions.length > 0 ? (
                <>
                  <Square size={16} />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <CheckSquare size={16} />
                  <span>Select All Visible</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {(['All', 'Active', 'Completed', 'Inactive / Expired'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: statusFilter === filter ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: statusFilter === filter ? 'var(--color-primary)' : '#FFFFFF',
                color: statusFilter === filter ? '#FFFFFF' : 'var(--color-text)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {filter}
              {filter !== 'All' && (
                <span style={{ marginLeft: '0.35rem', opacity: 0.8 }}>
                  ({prescriptions.filter((p) => p.status === filter).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Demonstration Pharmacy Watermark Notice */}
      <div
        role="alert"
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1.25rem',
          fontSize: '0.8rem',
          color: '#92400E',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
        <div>
          <strong>Patient Copy Safety Notice:</strong> These digital medication records are illustrative demonstration samples. In actual practice, prescription changes or refills require in-person physician evaluation.
        </div>
      </div>

      {/* Prescription Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredPrescriptions.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <Pill size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              No Prescriptions Found
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              There are no prescription records matching the selected status filter ({statusFilter}).
            </p>
          </div>
        ) : (
          filteredPrescriptions.map((rx) => {
            const isSelected = selectedRxIds.includes(rx.id);

            return (
              <div
                key={rx.id}
                id={`rx-row-${rx.rxCode}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border 0.15s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  {/* Left: Checkbox & Name */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleSelectRx(rx.id)}
                      aria-label={`Select ${rx.medicationName}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.15rem',
                        color: isSelected ? 'var(--color-primary)' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                          {rx.medicationName}
                        </h3>
                        {getStatusBadge(rx.status)}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--color-text-muted)',
                          marginTop: '0.2rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        Rx Ref Code: <strong style={{ color: 'var(--color-primary)' }}>{rx.rxCode}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right: Print Single or View Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setViewingRx(rx)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: '#F8FAFC',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Info size={14} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      DOSAGE &amp; STRENGTH
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', marginTop: '0.15rem' }}>
                      {rx.dosage}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      FREQUENCY / SCHEDULE
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', marginTop: '0.15rem' }}>
                      {rx.frequency}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      PRESCRIBED DURATION
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', marginTop: '0.15rem' }}>
                      {rx.duration}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      PRESCRIBED &amp; EXPIRY DATE
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', marginTop: '0.15rem' }}>
                      {rx.prescribedDate} → {rx.expiryDate}
                    </div>
                  </div>
                </div>

                {/* Instructions Box */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.825rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <User size={15} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {rx.doctorName} ({rx.doctorSpecialty}):
                    </span>{' '}
                    <span style={{ color: 'var(--color-text)' }}>{rx.instructions}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Individual Prescription Modal */}
      {viewingRx && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '650px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pill size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    {viewingRx.medicationName}
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Prescription Reference: <strong style={{ color: 'var(--color-primary)' }}>{viewingRx.rxCode}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingRx(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>DOSAGE</div>
                  <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{viewingRx.dosage}</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>FREQUENCY</div>
                  <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{viewingRx.frequency}</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>DURATION</div>
                  <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{viewingRx.duration}</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>REGIMEN STATUS</div>
                  <div style={{ marginTop: '0.2rem' }}>{getStatusBadge(viewingRx.status)}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>PRESCRIBING PHYSICIAN</div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: '0.2rem' }}>
                  {viewingRx.doctorName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{viewingRx.doctorSpecialty}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>USAGE INSTRUCTIONS</div>
                <p style={{ marginTop: '0.25rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {viewingRx.instructions}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #BFDBFE',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} color="var(--color-primary)" />
                <span>Valid from {viewingRx.prescribedDate} until {viewingRx.expiryDate}. For demonstration purposes only.</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '1.5rem',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '1rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedRxIds([viewingRx.id]);
                  setTimeout(() => handlePrintSelected(), 50);
                }}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Printer size={15} />
                <span>Print Patient Copy</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingRx(null)}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: 'var(--color-text)',
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
