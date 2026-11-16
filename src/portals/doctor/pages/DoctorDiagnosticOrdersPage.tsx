import React, { useState } from 'react';
import {
  DiagnosticOrderItem,
  DiagnosticCategory,
  DiagnosticOrderStatus,
} from '@/types/doctorPortal';
import { HospitalBranch } from '@/types/publicWebsite';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

interface DoctorDiagnosticOrdersPageProps {
  orders: DiagnosticOrderItem[];
  onAddDiagnosticOrder: (order: DiagnosticOrderItem) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: DiagnosticOrderStatus) => void;
  branches: HospitalBranch[];
  selectedBranchId: string;
}

export const DoctorDiagnosticOrdersPage: React.FC<DoctorDiagnosticOrdersPageProps> = ({
  orders,
  onAddDiagnosticOrder,
  onUpdateOrderStatus,
  branches,
  selectedBranchId,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'Laboratory' | 'Imaging'>('all');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  // Form State
  const patientName = 'Vikram Joshi (Sample Patient)';
  const patientUhid = 'DH-DEMO-2026-90412';
  const [category, setCategory] = useState<DiagnosticCategory>('Laboratory');
  const [testName, setTestName] = useState<string>('Complete Blood Count (CBC) with Differential');
  const [clinicalIndication, setClinicalIndication] = useState<string>('');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'STAT'>('Routine');
  const [branchId, setBranchId] = useState<string>(selectedBranchId === 'all' ? 'branch-central' : selectedBranchId);

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const labOptions = [
    'Complete Blood Count (CBC) with Differential',
    'Complete Lipid Profile (Fasting)',
    'Liver Function Test (LFT, 11 Parameters)',
    'Kidney Function Test (Serum Creatinine & Electrolytes)',
    'Glycated Hemoglobin (HbA1c) & Fasting Plasma Glucose',
    'Thyroid Stimulating Hormone (TSH, Ultrasensitive)',
    'Complete Urine Routine & Microscopy',
    'Serum 25-OH Vitamin D Total',
  ];

  const imagingOptions = [
    'Digital Chest X-Ray (PA View)',
    'Echocardiogram (2D Doppler Transthoracic)',
    'Ultrasound Whole Abdomen & Pelvis',
    'MRI Brain with Contrast (1.5 Tesla)',
    'CT Scan Pulmonary Angiography',
    'Orthopedic Radiography (Bilateral Knee)',
  ];

  const currentTestOptions = category === 'Laboratory' ? labOptions : imagingOptions;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalIndication.trim()) {
      setFormError('Please specify the clinical indication / reason for this diagnostic investigation.');
      return;
    }

    // Duplicate Order Prevention Check:
    const isDuplicate = orders.some(
      (o) =>
        o.patientUhid === patientUhid &&
        o.testName.toLowerCase() === testName.toLowerCase() &&
        o.orderDate === '2026-11-16' &&
        o.status !== 'Cancelled'
    );

    if (isDuplicate) {
      setFormError(`Duplicate Order Alert: An active diagnostic request for "${testName}" has already been logged for this patient today.`);
      return;
    }

    setFormError(null);

    const targetBranch = branches.find((b) => b.id === branchId);

    const newOrder: DiagnosticOrderItem = {
      id: `dx-${Date.now()}`,
      orderCode: `DX-DEMO-${Math.floor(705 + Math.random() * 100)}`,
      patientId: 'pt-1',
      patientName,
      patientUhid,
      orderingDoctor: 'Dr. Aarav Sharma',
      branchId,
      branchName: targetBranch ? targetBranch.name : 'Danvantari Central Campus',
      category,
      testName,
      clinicalIndication,
      priority,
      orderDate: '2026-11-16',
      status: 'Ordered (Demo)',
    };

    onAddDiagnosticOrder(newOrder);
    setIsOrderModalOpen(false);
    setClinicalIndication('');
    setSuccessMsg(`Diagnostic order ${newOrder.orderCode} successfully requisitioned for ${patientName}.`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.category === activeTab;
  });

  const getStatusBadge = (status: DiagnosticOrderStatus) => {
    switch (status) {
      case 'Ordered (Demo)':
        return (
          <span style={{ backgroundColor: '#EFF6FF', color: 'var(--color-primary)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 700 }}>
            Ordered (Demo)
          </span>
        );
      case 'Sample Collected (Demo)':
        return (
          <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 700 }}>
            Sample Collected
          </span>
        );
      case 'Processing (Demo)':
        return (
          <span style={{ backgroundColor: '#F3E8FF', color: '#7E22CE', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 700 }}>
            Processing in Lab
          </span>
        );
      case 'Completed (Demo)':
        return (
          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 700 }}>
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 700 }}>
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <FlaskConical size={22} color="var(--color-teal)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Diagnostic Pathology &amp; Imaging Requisition
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Order blood chemistry panels, microbiology cultures, and clinical imaging with real-time laboratory tracking.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setIsOrderModalOpen(true);
            }}
            style={{
              backgroundColor: 'var(--color-teal)',
              color: '#FFFFFF',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Plus size={16} />
            <span>Order Diagnostic Test</span>
          </button>
        </div>

        {successMsg && (
          <div
            role="status"
            style={{
              marginTop: '1rem',
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
          {(['all', 'Laboratory', 'Imaging'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: activeTab === tab ? '1px solid var(--color-teal)' : '1px solid var(--color-border)',
                backgroundColor: activeTab === tab ? 'var(--color-teal)' : '#FFFFFF',
                color: activeTab === tab ? '#FFFFFF' : 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              {tab === 'all' ? 'All Orders' : `${tab} Orders`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>ORDER CODE</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>PATIENT DEMOGRAPHICS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>TEST &amp; CATEGORY</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>CLINICAL INDICATION</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>PRIORITY</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>STATUS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    No diagnostic orders under this category.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)' }}>{ord.orderCode}</span>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{ord.orderDate}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{ord.patientName}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>UHID: {ord.patientUhid}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{ord.testName}</div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: ord.category === 'Laboratory' ? '#EFF6FF' : '#F0FDF4',
                          color: ord.category === 'Laboratory' ? 'var(--color-primary)' : 'var(--color-teal)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        {ord.category}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', maxWidth: '240px' }}>
                      <div style={{ fontSize: '0.78rem', color: '#334155' }}>{ord.clinicalIndication}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          color: ord.priority === 'Urgent' || ord.priority === 'STAT' ? '#DC2626' : '#475569',
                        }}
                      >
                        {ord.priority}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      {getStatusBadge(ord.status)}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      {ord.status === 'Ordered (Demo)' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Sample Collected (Demo)')}
                          style={{
                            backgroundColor: '#F8FAFC',
                            border: '1px solid var(--color-border)',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.725rem',
                            cursor: 'pointer',
                          }}
                        >
                          Collect Sample (Demo)
                        </button>
                      )}
                      {ord.status === 'Sample Collected (Demo)' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Completed (Demo)')}
                          style={{
                            backgroundColor: '#DCFCE7',
                            color: '#15803D',
                            border: '1px solid #86EFAC',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.725rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          Mark Analyzed (Demo)
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {isOrderModalOpen && (
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
              maxWidth: '540px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FlaskConical size={20} color="var(--color-teal)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  Requisition Diagnostic Investigation
                </h3>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Patient *
                </label>
                <input
                  type="text"
                  value={`${patientName} (${patientUhid})`}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Diagnostic Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as DiagnosticCategory;
                      setCategory(newCat);
                      setTestName(newCat === 'Laboratory' ? labOptions[0]! : imagingOptions[0]!);
                    }}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Laboratory">Laboratory &amp; Pathology</option>
                    <option value="Imaging">Clinical Imaging / Radiology</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Priority Level *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'Routine' | 'Urgent' | 'STAT')}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT">STAT (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Testing Branch Facility *
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Target Investigation Panel *
                </label>
                <select
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                >
                  {currentTestOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Clinical Indication / Reason for Requisition *
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the diagnostic doubt or reason (e.g. Annual lipid screening; exclude nephropathy; follow-up)..."
                  value={clinicalIndication}
                  onChange={(e) => setClinicalIndication(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', cursor: 'pointer', fontSize: '0.825rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--color-teal)', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer', fontSize: '0.825rem' }}
                >
                  Issue Diagnostic Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
