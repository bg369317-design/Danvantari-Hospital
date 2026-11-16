import React, { useState } from 'react';
import { QueuePatientItem, QueueStatus, DoctorTab } from '@/types/doctorPortal';
import { HospitalBranch } from '@/types/publicWebsite';
import {
  Users,
  Search,
  PlayCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Info,
  Building2,
  RotateCcw,
} from 'lucide-react';

interface DoctorPatientQueuePageProps {
  queue: QueuePatientItem[];
  onUpdateQueueStatus: (queueId: string, newStatus: QueueStatus) => void;
  onStartConsultation: (patient: QueuePatientItem) => void;
  onViewPatientChart: (patientId: string) => void;
  branches: HospitalBranch[];
  selectedBranchId: string;
  onNavigateTab: (tab: DoctorTab) => void;
}

export const DoctorPatientQueuePage: React.FC<DoctorPatientQueuePageProps> = ({
  queue,
  onUpdateQueueStatus,
  onStartConsultation,
  onViewPatientChart,
  branches,
  selectedBranchId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | QueueStatus>('All');
  const [branchFilter, setBranchFilter] = useState<string>(selectedBranchId);
  const [selectedPatientModal, setSelectedPatientModal] = useState<QueuePatientItem | null>(null);

  // Filter queue
  const filteredQueue = queue.filter((item) => {
    // Branch filter
    if (branchFilter !== 'all' && item.branchId !== branchFilter) return false;
    // Status filter
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.patientUhid.toLowerCase().includes(q) ||
        item.tokenNumber.toLowerCase().includes(q) ||
        item.appointmentCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'In Consultation':
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
            <span>In Consultation</span>
          </span>
        );
      case 'Waiting':
        return (
          <span
            style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Users size={12} />
            <span>Waiting in Lounge</span>
          </span>
        );
      case 'Scheduled':
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
            <Clock size={12} />
            <span>Scheduled Today</span>
          </span>
        );
      case 'Completed':
        return (
          <span
            style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
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
            <span>Completed (Demo)</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span
            style={{
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <XCircle size={12} />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
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
              <Users size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                OPD Clinical Patient Queue
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Real-time outpatient tokens, triage vitals, consultation status controls, and seamless EHR chart handoff.
            </p>
          </div>

          {/* Quick Queue Stats */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }}>
                {queue.filter((q) => q.status === 'Waiting').length}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>WAITING</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D' }}>
                {queue.filter((q) => q.status === 'In Consultation').length}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>IN ROOM</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#334155' }}>
                {queue.filter((q) => q.status === 'Completed').length}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>COMPLETED</div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <input
              type="text"
              placeholder="Search by patient name, UHID, or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.825rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                boxSizing: 'border-box',
              }}
            />
            <Search
              size={14}
              color="#94A3B8"
              style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Branch Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={16} color="var(--color-primary)" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontWeight: 600,
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Hospital Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name.replace(' (Demonstration Facility)', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {(['All', 'Waiting', 'In Consultation', 'Scheduled', 'Completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: statusFilter === filter ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: statusFilter === filter ? 'var(--color-primary)' : '#FFFFFF',
                  color: statusFilter === filter ? '#FFFFFF' : 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patients Table */}
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
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', width: '70px' }}>TOKEN</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>PATIENT DEMOGRAPHICS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>TIME / TYPE</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>TRIAGE VITALS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>STATUS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', textAlign: 'right' }}>
                  CLINICAL ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    <Users size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#475569' }}>No Patients Found</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      No patients match the active branch and status filter.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: item.status === 'In Consultation' ? '#F0FDF4' : 'transparent',
                    }}
                  >
                    {/* Token */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          backgroundColor: item.status === 'In Consultation' ? '#166534' : 'var(--color-primary-dark)',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        {item.tokenNumber}
                      </span>
                    </td>

                    {/* Patient Name & UHID */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{item.patientName}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                        UHID: {item.patientUhid} • {item.age} Y / {item.gender}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.15rem' }}>
                        Reason: {item.reasonForVisit}
                      </div>
                    </td>

                    {/* Time & Consultation Type */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.appointmentTime}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                        {item.consultationType}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {item.branchName.split(' ')[1]} Campus
                      </div>
                    </td>

                    {/* Triage Vitals */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      {item.vitals ? (
                        <div style={{ fontSize: '0.725rem', color: '#334155', lineHeight: 1.4 }}>
                          <div>BP: <strong>{item.vitals.bp}</strong></div>
                          <div>Pulse: <strong>{item.vitals.pulse}</strong> • SpO2: <strong>{item.vitals.spo2}</strong></div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                          Vitals pending
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Action Buttons */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {/* Start Consultation button */}
                        {item.status === 'Waiting' && (
                          <button
                            onClick={() => onStartConsultation(item)}
                            style={{
                              backgroundColor: 'var(--color-primary)',
                              color: '#FFFFFF',
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <PlayCircle size={13} />
                            <span>Start Consult</span>
                          </button>
                        )}

                        {/* Complete button */}
                        {item.status === 'In Consultation' && (
                          <button
                            onClick={() => onUpdateQueueStatus(item.id, 'Completed')}
                            style={{
                              backgroundColor: '#16A34A',
                              color: '#FFFFFF',
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Complete</span>
                          </button>
                        )}

                        {/* Reset Demo button for completed patient */}
                        {item.status === 'Completed' && (
                          <button
                            onClick={() => onUpdateQueueStatus(item.id, 'Waiting')}
                            title="Reset state for demonstration testing"
                            style={{
                              backgroundColor: '#F8FAFC',
                              color: '#475569',
                              border: '1px solid var(--color-border)',
                              padding: '0.35rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.725rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <RotateCcw size={12} />
                            <span>Reopen (Demo)</span>
                          </button>
                        )}

                        {/* View Chart */}
                        <button
                          onClick={() => onViewPatientChart(item.patientId)}
                          style={{
                            backgroundColor: '#F8FAFC',
                            color: 'var(--color-primary)',
                            border: '1px solid var(--color-border)',
                            padding: '0.35rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <FileText size={13} />
                          <span>Chart</span>
                        </button>

                        {/* Details Modal */}
                        <button
                          onClick={() => setSelectedPatientModal(item)}
                          style={{
                            backgroundColor: '#F8FAFC',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            padding: '0.35rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                          aria-label="View queue details"
                        >
                          <Info size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedPatientModal && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span
                  style={{
                    backgroundColor: 'var(--color-primary-dark)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  Token: {selectedPatientModal.tokenNumber}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '0.4rem' }}>
                  {selectedPatientModal.patientName}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  UHID: {selectedPatientModal.patientUhid} • {selectedPatientModal.age} Y / {selectedPatientModal.gender}
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>APPOINTMENT REF</div>
                <div style={{ fontWeight: 700 }}>{selectedPatientModal.appointmentCode} ({selectedPatientModal.consultationType})</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>CHIEF COMPLAINT</div>
                <div>{selectedPatientModal.reasonForVisit}</div>
              </div>

              {selectedPatientModal.vitals && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600, marginBottom: '0.3rem' }}>
                    TRIAGE VITALS (RECORDED AT NURSE STATION)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    <div>Blood Pressure: <strong>{selectedPatientModal.vitals.bp}</strong></div>
                    <div>Pulse Rate: <strong>{selectedPatientModal.vitals.pulse}</strong></div>
                    <div>Body Temp: <strong>{selectedPatientModal.vitals.temp}</strong></div>
                    <div>Oxygen Saturation: <strong>{selectedPatientModal.vitals.spo2}</strong></div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Current Status:</span>
                {getStatusBadge(selectedPatientModal.status)}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  const pat = selectedPatientModal;
                  setSelectedPatientModal(null);
                  onViewPatientChart(pat.patientId);
                }}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Open Full Chart
              </button>
              <button
                onClick={() => setSelectedPatientModal(null)}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: 'var(--color-text)',
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
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
