import React, { useState, useMemo } from 'react';
import {
  DoctorTab,
  QueuePatientItem,
  QueueStatus,
  DoctorAppointment,
  PatientChart,
  SoapNote,
  DoctorPrescription,
  DiagnosticOrderItem,
  DiagnosticOrderStatus,
  DoctorLabResultItem,
  ClinicalReferral,
  ReferralStatus,
  DoctorRosterSlot,
  DoctorConversation,
  DoctorNotification,
  DoctorProfileData,
} from '@/types/doctorPortal';
import { SAMPLE_BRANCHES } from '@/config/publicSampleData';
import {
  INITIAL_DOCTOR_PROFILE,
  INITIAL_DOCTOR_QUEUE,
  INITIAL_DOCTOR_APPOINTMENTS,
  SAMPLE_PATIENT_CHARTS,
  INITIAL_SOAP_NOTES,
  INITIAL_DOCTOR_PRESCRIPTIONS,
  INITIAL_DIAGNOSTIC_ORDERS,
  INITIAL_DOCTOR_LAB_RESULTS,
  INITIAL_REFERRALS,
  INITIAL_DOCTOR_ROSTER,
  INITIAL_DOCTOR_CONVERSATIONS,
  INITIAL_DOCTOR_NOTIFICATIONS,
} from '@/config/doctorSampleData';

import {
  getAssignedBranchesForDoctor,
  isDoctorAssignedToBranch,
  evaluateBranchAccess,
  filterItemsByBranchAccess,
  getHydratedDoctorProfile,
} from '@/services/doctorBranchAccessService';

import { DoctorLayout } from '../layouts/DoctorLayout';
import { DoctorBranchAccessDenied } from '../components/DoctorBranchAccessDenied';
import { DoctorDashboard } from './DoctorDashboard';
import { DoctorPatientQueuePage } from './DoctorPatientQueuePage';
import { DoctorAppointmentsPage } from './DoctorAppointmentsPage';
import { DoctorPatientRecordsPage } from './DoctorPatientRecordsPage';
import { DoctorConsultationNotesPage } from './DoctorConsultationNotesPage';
import { DoctorPrescriptionsPage } from './DoctorPrescriptionsPage';
import { DoctorDiagnosticOrdersPage } from './DoctorDiagnosticOrdersPage';
import { DoctorLabResultsPage } from './DoctorLabResultsPage';
import { DoctorReferralsPage } from './DoctorReferralsPage';
import { DoctorRosterPage } from './DoctorRosterPage';
import { DoctorMessagesPage } from './DoctorMessagesPage';
import { DoctorProfilePage } from './DoctorProfilePage';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface DoctorPortalViewProps {
  onExitToPublic?: () => void;
}

export const DoctorPortalView: React.FC<DoctorPortalViewProps> = ({ onExitToPublic }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<DoctorTab>('dashboard');

  // Core Doctor Profile (defaults to Dr. Aarav Sharma with Central + North assignments)
  const [doctor, setDoctor] = useState<DoctorProfileData>(INITIAL_DOCTOR_PROFILE);

  // Active Assigned Branches for the current doctor (computed dynamically from centralized registry)
  const assignedBranches = useMemo(
    () => getAssignedBranchesForDoctor(doctor.id),
    [doctor.id]
  );

  const assignedBranchIds = useMemo(
    () => assignedBranches.map((b) => b.id),
    [assignedBranches]
  );

  // Selected branch in header: 'all' or a specific branch ID
  // Defaults to 'all' (or the doctor's primary assigned branch)
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  // Core Clinical State
  const [queue, setQueue] = useState<QueuePatientItem[]>(INITIAL_DOCTOR_QUEUE);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(INITIAL_DOCTOR_APPOINTMENTS);
  const [patientCharts] = useState<Record<string, PatientChart>>(SAMPLE_PATIENT_CHARTS);
  const [activePatientId, setActivePatientId] = useState<string>('pt-1');
  const [activeConsultationPatient, setActiveConsultationPatient] = useState<QueuePatientItem | null>(null);

  const [soapNotes, setSoapNotes] = useState<SoapNote[]>(INITIAL_SOAP_NOTES);
  const [prescriptions, setPrescriptions] = useState<DoctorPrescription[]>(INITIAL_DOCTOR_PRESCRIPTIONS);
  const [diagnosticOrders, setDiagnosticOrders] = useState<DiagnosticOrderItem[]>(INITIAL_DIAGNOSTIC_ORDERS);
  const [labResults, setLabResults] = useState<DoctorLabResultItem[]>(INITIAL_DOCTOR_LAB_RESULTS);
  const [referrals, setReferrals] = useState<ClinicalReferral[]>(INITIAL_REFERRALS);
  const [roster, setRoster] = useState<DoctorRosterSlot[]>(INITIAL_DOCTOR_ROSTER);
  const [conversations, setConversations] = useState<DoctorConversation[]>(INITIAL_DOCTOR_CONVERSATIONS);
  const [notifications, setNotifications] = useState<DoctorNotification[]>(INITIAL_DOCTOR_NOTIFICATIONS);

  // -------------------------------------------------------------------------
  // Branch Access Verification & Guard
  // -------------------------------------------------------------------------
  const branchAccessEvaluation = useMemo(
    () => evaluateBranchAccess(doctor.id, selectedBranchId),
    [doctor.id, selectedBranchId]
  );

  // -------------------------------------------------------------------------
  // Branch-Based Filtering across All 9 Clinical Workflows
  // -------------------------------------------------------------------------

  // 1. Queue: Filter by assigned branches and active branch selection
  const filteredQueue = useMemo(() => {
    return filterItemsByBranchAccess(
      queue,
      (item) => item.branchId,
      selectedBranchId,
      assignedBranchIds
    );
  }, [queue, selectedBranchId, assignedBranchIds]);

  // 2. Appointments: Filter by assigned branches and active branch selection
  const filteredAppointments = useMemo(() => {
    return filterItemsByBranchAccess(
      appointments,
      (item) => item.branchId,
      selectedBranchId,
      assignedBranchIds
    );
  }, [appointments, selectedBranchId, assignedBranchIds]);

  // 3. Patient Charts: Only patients registered at doctor's assigned branches
  const filteredPatientCharts = useMemo(() => {
    const result: Record<string, PatientChart> = {};
    for (const [key, chart] of Object.entries(patientCharts)) {
      if (assignedBranchIds.includes(chart.demographics.primaryBranchId)) {
        if (selectedBranchId === 'all' || chart.demographics.primaryBranchId === selectedBranchId) {
          result[key] = chart;
        }
      }
    }
    return result;
  }, [patientCharts, selectedBranchId, assignedBranchIds]);

  // 4. Consultation Notes (SOAP)
  const filteredSoapNotes = useMemo(() => {
    return filterItemsByBranchAccess(
      soapNotes,
      (item) => item.branchId,
      selectedBranchId,
      assignedBranchIds
    );
  }, [soapNotes, selectedBranchId, assignedBranchIds]);

  // 5. Prescriptions
  const filteredPrescriptions = useMemo(() => {
    return filterItemsByBranchAccess(
      prescriptions,
      (item) => item.branchId,
      selectedBranchId,
      assignedBranchIds
    );
  }, [prescriptions, selectedBranchId, assignedBranchIds]);

  // 6. Diagnostic Orders
  const filteredDiagnosticOrders = useMemo(() => {
    return filterItemsByBranchAccess(
      diagnosticOrders,
      (item) => item.branchId,
      selectedBranchId,
      assignedBranchIds
    );
  }, [diagnosticOrders, selectedBranchId, assignedBranchIds]);

  // 7. Lab Results
  const filteredLabResults = useMemo(() => {
    return filterItemsByBranchAccess(
      labResults,
      (item) => item.branchId,
      selectedBranchId,
      assignedBranchIds
    );
  }, [labResults, selectedBranchId, assignedBranchIds]);

  // 8. Referrals: Visible if either origin or destination is in assigned branches
  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => {
      const isOriginAssigned = assignedBranchIds.includes(r.originBranchId);
      const isDestAssigned = assignedBranchIds.includes(r.destinationBranchId);
      if (!isOriginAssigned && !isDestAssigned) return false;

      if (selectedBranchId !== 'all') {
        return (
          r.originBranchId === selectedBranchId ||
          r.destinationBranchId === selectedBranchId
        );
      }
      return true;
    });
  }, [referrals, selectedBranchId, assignedBranchIds]);

  // 9. Roster & On-Call
  const filteredRoster = useMemo(() => {
    return filterItemsByBranchAccess(
      roster,
      (item) => item.branchId,
      selectedBranchId,
      assignedBranchIds
    );
  }, [roster, selectedBranchId, assignedBranchIds]);

  // Derived metrics
  const queueWaitingCount = useMemo(
    () => filteredQueue.filter((p) => p.status === 'Waiting').length,
    [filteredQueue]
  );

  const unreadLabCount = useMemo(
    () => filteredLabResults.filter((l) => l.isAbnormal && !l.doctorReviewNote).length,
    [filteredLabResults]
  );

  const selectedBranchName = useMemo(() => {
    if (selectedBranchId === 'all') {
      return `All Assigned Branches (${assignedBranches.length})`;
    }
    const found = SAMPLE_BRANCHES.find((b) => b.id === selectedBranchId);
    return found ? found.name : 'Unknown Branch';
  }, [selectedBranchId, assignedBranches]);

  // -------------------------------------------------------------------------
  // Handlers & Actions
  // -------------------------------------------------------------------------

  // Switch demonstration doctor for testing access control
  const handleSwitchDemoDoctor = (targetDoctorId: string) => {
    const newDoc = getHydratedDoctorProfile(targetDoctorId);
    setDoctor(newDoc);
    const newBranches = getAssignedBranchesForDoctor(targetDoctorId);
    // Reset selected branch to 'all' or first assigned
    setSelectedBranchId('all');

    // Reset active patient to first authorized patient
    const authorizedPatient = Object.values(SAMPLE_PATIENT_CHARTS).find((p) =>
      newBranches.some((b) => b.id === p.demographics.primaryBranchId)
    );
    if (authorizedPatient) {
      setActivePatientId(authorizedPatient.demographics.id);
    }
  };

  // Queue actions
  const handleUpdateQueueStatus = (queueId: string, newStatus: QueueStatus) => {
    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === queueId) {
          if (newStatus === 'In Consultation') {
            setActiveConsultationPatient(item);
            if (patientCharts[item.patientId]) {
              setActivePatientId(item.patientId);
            }
          }
          return { ...item, status: newStatus };
        }
        return item;
      })
    );

    // Sync appointment status if code matches
    const targetPatient = queue.find((p) => p.id === queueId);
    if (targetPatient) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentCode === targetPatient.appointmentCode
            ? { ...apt, status: newStatus }
            : apt
        )
      );
    }
  };

  const handleStartConsultation = (patient: QueuePatientItem) => {
    // Access check: patient's branch must be assigned
    if (!isDoctorAssignedToBranch(doctor.id, patient.branchId)) {
      alert(
        `Access Denied: You are not authorized for consultations at ${patient.branchName}.`
      );
      return;
    }

    handleUpdateQueueStatus(patient.id, 'In Consultation');
    setActiveConsultationPatient(patient);
    if (patientCharts[patient.patientId]) {
      setActivePatientId(patient.patientId);
    }
    setActiveTab('consultation-notes');

    const newNotif: DoctorNotification = {
      id: `notif-${Date.now()}`,
      title: 'Consultation In Progress',
      description: `Active clinical consult started for ${patient.patientName} (${patient.tokenNumber}) at ${patient.branchName}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'queue_update',
      targetTab: 'consultation-notes',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Appointments actions
  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'Scheduled' } : apt
      )
    );
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
      )
    );
  };

  const handleRescheduleAppointment = (
    appointmentId: string,
    newDate: string,
    newTimeSlot: string
  ): boolean => {
    const conflict = appointments.some(
      (a) =>
        a.id !== appointmentId &&
        a.date === newDate &&
        a.timeSlot === newTimeSlot &&
        a.status !== 'Cancelled'
    );

    if (conflict) {
      return false;
    }

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, date: newDate, timeSlot: newTimeSlot, status: 'Scheduled' }
          : apt
      )
    );

    const rescheduledApt = appointments.find((a) => a.id === appointmentId);
    if (rescheduledApt) {
      const notif: DoctorNotification = {
        id: `notif-${Date.now()}`,
        title: 'Appointment Rescheduled',
        description: `Consult for ${rescheduledApt.patientName} moved to ${newDate} at ${newTimeSlot}.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'appointment_rescheduled',
        targetTab: 'appointments',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return true;
  };

  // Patient chart inspector
  const handleViewPatientChart = (patientId: string) => {
    setActivePatientId(patientId);
    setActiveTab('records');
  };

  // SOAP Note actions
  const handleSaveSoapNote = (note: SoapNote) => {
    setSoapNotes((prev) => {
      const existingIdx = prev.findIndex((n) => n.id === note.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = note;
        return copy;
      }
      return [note, ...prev];
    });

    if (note.status === 'Finalized (Demo)') {
      if (activeConsultationPatient) {
        handleUpdateQueueStatus(activeConsultationPatient.id, 'Completed');
        setActiveConsultationPatient(null);
      }
    }
  };

  const handleCompleteConsultation = (noteId: string) => {
    setSoapNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, status: 'Finalized (Demo)' } : n))
    );

    if (activeConsultationPatient) {
      handleUpdateQueueStatus(activeConsultationPatient.id, 'Completed');
      setActiveConsultationPatient(null);
    }
    setActiveTab('queue');
  };

  // Prescription actions
  const handleSavePrescription = (newRx: DoctorPrescription) => {
    setPrescriptions((prev) => [newRx, ...prev]);
    const notif: DoctorNotification = {
      id: `notif-${Date.now()}`,
      title: 'Electronic Prescription Dispatched',
      description: `Rx ${newRx.rxCode} signed and recorded for ${newRx.patientName}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'general',
      targetTab: 'prescriptions',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Diagnostic Orders actions
  const handleAddDiagnosticOrder = (newOrder: DiagnosticOrderItem) => {
    setDiagnosticOrders((prev) => [newOrder, ...prev]);
    const notif: DoctorNotification = {
      id: `notif-${Date.now()}`,
      title: 'Diagnostic Requisition Sent',
      description: `Order ${newOrder.orderCode} (${newOrder.testName}) generated for ${newOrder.patientName}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'general',
      targetTab: 'diagnostic-orders',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: DiagnosticOrderStatus) => {
    setDiagnosticOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Lab Results actions
  const handleSaveDoctorReviewNote = (reportId: string, note: string) => {
    setLabResults((prev) =>
      prev.map((item) =>
        item.id === reportId
          ? {
              ...item,
              doctorReviewNote: note,
              reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : item
      )
    );
  };

  // Referrals actions
  const handleCreateReferral = (
    refData: Omit<ClinicalReferral, 'id' | 'referralCode' | 'referralDate' | 'status'>
  ) => {
    const newRef: ClinicalReferral = {
      ...refData,
      id: `ref-${Date.now()}`,
      referralCode: `REF-DEMO-${Math.floor(100 + Math.random() * 900)}`,
      referralDate: new Date().toISOString().split('T')[0] || '2026-11-17',
      status: 'Sent (Demo)',
    };
    setReferrals((prev) => [newRef, ...prev]);

    const notif: DoctorNotification = {
      id: `notif-${Date.now()}`,
      title: 'Specialist Referral Created',
      description: `Cross-consultation ${newRef.referralCode} dispatched to ${newRef.receivingDoctor}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'referral_received',
      targetTab: 'referrals',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateReferralStatus = (id: string, status: ReferralStatus) => {
    setReferrals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  // Roster actions
  const handleToggleOnCall = (slotId: string) => {
    setRoster((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          const nextOnCall = !slot.isOnCall;
          return {
            ...slot,
            isOnCall: nextOnCall,
            status: nextOnCall ? 'On Call' : 'Available',
          };
        }
        return slot;
      })
    );
  };

  const handleRequestLeave = (slotId: string, _reason: string) => {
    setRoster((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, status: 'Leave / Unavailable', isOnCall: false }
          : slot
      )
    );
  };

  // Messages actions
  const handleSendMessage = (patientId: string, content: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.patientId === patientId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            patientId,
            patientName: conv.patientName,
            patientUhid: conv.patientUhid,
            sender: 'doctor' as const,
            timestamp,
            content,
          };
          return {
            ...conv,
            lastMessage: content,
            lastTimestamp: timestamp,
            unreadCount: 0,
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  };

  // Profile actions
  const handleUpdateProfile = (updated: Partial<DoctorProfileData>) => {
    setDoctor((prev) => ({ ...prev, ...updated }));
  };

  // Notifications
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Search Patient handler from header
  const handleSearchPatient = (query: string) => {
    const q = query.toLowerCase().trim();
    const foundPatientId = Object.keys(patientCharts).find((id) => {
      const c = patientCharts[id];
      return (
        c &&
        (c.demographics.fullName.toLowerCase().includes(q) ||
          c.demographics.uhid.toLowerCase().includes(q))
      );
    });

    if (foundPatientId) {
      setActivePatientId(foundPatientId);
      setActiveTab('records');
    }
  };

  // Action shortcuts from records to SOAP/Rx/Orders
  const handlePrepareSoapForPatient = (patientId: string) => {
    const chart = patientCharts[patientId];
    if (chart) {
      const matchedQueuePatient = queue.find((p) => p.patientId === patientId);
      if (matchedQueuePatient) {
        setActiveConsultationPatient(matchedQueuePatient);
      }
    }
    setActiveTab('consultation-notes');
  };

  const handlePreparePrescriptionForPatient = (_patientId: string) => {
    setActiveTab('prescriptions');
  };

  const handlePrepareDiagnosticOrderForPatient = (_patientId: string) => {
    setActiveTab('diagnostic-orders');
  };

  // Check whether the currently inspected patient chart is authorized
  const activePatientChart = patientCharts[activePatientId];
  const isPatientChartUnauthorized =
    activePatientChart &&
    !assignedBranchIds.includes(activePatientChart.demographics.primaryBranchId);

  return (
    <DoctorLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      doctor={doctor}
      branches={assignedBranches}
      selectedBranchId={selectedBranchId}
      onSelectBranch={setSelectedBranchId}
      notifications={notifications}
      onMarkNotificationAsRead={handleMarkNotificationAsRead}
      onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      onExitPortal={onExitToPublic}
      queueWaitingCount={queueWaitingCount}
      unreadLabCount={unreadLabCount}
      onSearchPatient={handleSearchPatient}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Demonstration Verification & Branch Assignment Control Bar */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          padding: '0.65rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: '#EFF6FF',
              color: 'var(--color-primary)',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
            }}
          >
            <ShieldCheck size={14} />
            <span>Branch Access Control:</span>
          </span>
          <span style={{ color: 'var(--color-text)' }}>
            Signed in as <strong>{doctor.fullName}</strong> | Assigned Campuses:{' '}
            <strong style={{ color: 'var(--color-teal)' }}>
              {assignedBranches.map((b) => b.name.replace(' (Demonstration Facility)', '')).join(', ')}
            </strong>{' '}
            ({assignedBranches.length} {assignedBranches.length === 1 ? 'branch' : 'branches'})
          </span>
        </div>

        {/* Doctor Switcher Pills for Testing Single vs Multi-Branch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
            Switch Test Doctor:
          </span>
          <button
            type="button"
            onClick={() => handleSwitchDemoDoctor('doc-1')}
            style={{
              padding: '0.2rem 0.55rem',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid',
              cursor: 'pointer',
              backgroundColor: doctor.id === 'doc-1' ? '#EFF6FF' : '#F8FAFC',
              borderColor: doctor.id === 'doc-1' ? 'var(--color-primary)' : 'var(--color-border)',
              color: doctor.id === 'doc-1' ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: doctor.id === 'doc-1' ? 700 : 400,
            }}
          >
            Dr. Aarav (2 Branches: Central &amp; North)
          </button>

          <button
            type="button"
            onClick={() => handleSwitchDemoDoctor('doc-2')}
            style={{
              padding: '0.2rem 0.55rem',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid',
              cursor: 'pointer',
              backgroundColor: doctor.id === 'doc-2' ? '#EFF6FF' : '#F8FAFC',
              borderColor: doctor.id === 'doc-2' ? 'var(--color-primary)' : 'var(--color-border)',
              color: doctor.id === 'doc-2' ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: doctor.id === 'doc-2' ? 700 : 400,
            }}
          >
            Dr. Priya (1 Branch: North Only)
          </button>

          <button
            type="button"
            onClick={() => handleSwitchDemoDoctor('doc-4')}
            style={{
              padding: '0.2rem 0.55rem',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid',
              cursor: 'pointer',
              backgroundColor: doctor.id === 'doc-4' ? '#EFF6FF' : '#F8FAFC',
              borderColor: doctor.id === 'doc-4' ? 'var(--color-primary)' : 'var(--color-border)',
              color: doctor.id === 'doc-4' ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: doctor.id === 'doc-4' ? 700 : 400,
            }}
          >
            Dr. Ananya (1 Branch: South Only)
          </button>

          {/* Test Unauthorized Access Trigger */}
          <button
            type="button"
            onClick={() => setSelectedBranchId('branch-south')}
            title="Simulate selecting an unassigned branch via manipulated parameter or state"
            style={{
              padding: '0.2rem 0.55rem',
              fontSize: '0.725rem',
              borderRadius: '4px',
              border: '1px solid #FECACA',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <ShieldAlert size={12} />
            <span>Test Unauthorized Branch (South)</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ACCESS CONTROL GUARD: Block unauthorized branch views */}
      {/* ------------------------------------------------------------------ */}
      {!branchAccessEvaluation.allowed ? (
        <DoctorBranchAccessDenied
          doctorName={doctor.fullName}
          doctorSpecialty={doctor.specialtyName}
          attemptedBranchId={selectedBranchId}
          attemptedBranchName={branchAccessEvaluation.requestedBranchName}
          assignedBranches={assignedBranches}
          onSelectAuthorizedBranch={(bid) => setSelectedBranchId(bid)}
          onReturnToDashboard={() => {
            setSelectedBranchId('all');
            setActiveTab('dashboard');
          }}
          contextMessage={branchAccessEvaluation.denialReason}
        />
      ) : (
        <>
          {/* 1. Dashboard */}
          {activeTab === 'dashboard' && (
            <DoctorDashboard
              doctor={doctor}
              queue={filteredQueue}
              appointments={filteredAppointments}
              labResults={filteredLabResults}
              onNavigateTab={setActiveTab}
              onStartConsultation={handleStartConsultation}
              selectedBranchName={selectedBranchName}
            />
          )}

          {/* 2. Patient Queue */}
          {activeTab === 'queue' && (
            <DoctorPatientQueuePage
              queue={filteredQueue}
              onUpdateQueueStatus={handleUpdateQueueStatus}
              onStartConsultation={handleStartConsultation}
              onViewPatientChart={handleViewPatientChart}
              branches={assignedBranches}
              selectedBranchId={selectedBranchId}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* 3. Appointments */}
          {activeTab === 'appointments' && (
            <DoctorAppointmentsPage
              appointments={filteredAppointments}
              onConfirmAppointment={handleConfirmAppointment}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              onViewPatientChart={handleViewPatientChart}
              branches={assignedBranches}
              selectedBranchId={selectedBranchId}
            />
          )}

          {/* 4. Patient Medical Charts */}
          {activeTab === 'records' && (
            isPatientChartUnauthorized && activePatientChart ? (
              <DoctorBranchAccessDenied
                doctorName={doctor.fullName}
                doctorSpecialty={doctor.specialtyName}
                attemptedBranchId={activePatientChart.demographics.primaryBranchId}
                attemptedBranchName={activePatientChart.demographics.primaryBranchName}
                assignedBranches={assignedBranches}
                onSelectAuthorizedBranch={(bid) => {
                  setSelectedBranchId(bid);
                  const firstAuth = Object.values(patientCharts).find(
                    (p) => p.demographics.primaryBranchId === bid
                  );
                  if (firstAuth) setActivePatientId(firstAuth.demographics.id);
                }}
                onReturnToDashboard={() => {
                  setSelectedBranchId('all');
                  setActiveTab('dashboard');
                }}
                contextMessage={`Access Denied to Patient Record ${activePatientChart.demographics.uhid} (${activePatientChart.demographics.fullName}). This patient is registered and treated exclusively at ${activePatientChart.demographics.primaryBranchName}. Dr. ${doctor.fullName} is only credentialed for ${assignedBranches.map((b) => b.name).join(' & ')}.`}
              />
            ) : (
              <DoctorPatientRecordsPage
                patientCharts={filteredPatientCharts}
                activePatientId={activePatientId}
                onSelectPatient={setActivePatientId}
                onNavigateTab={setActiveTab}
                onPrepareSoapForPatient={handlePrepareSoapForPatient}
                onPreparePrescriptionForPatient={handlePreparePrescriptionForPatient}
                onPrepareDiagnosticOrderForPatient={handlePrepareDiagnosticOrderForPatient}
              />
            )
          )}

          {/* 5. Consultation Notes (SOAP) */}
          {activeTab === 'consultation-notes' && (
            <DoctorConsultationNotesPage
              soapNotes={filteredSoapNotes}
              activePatient={activeConsultationPatient}
              onSaveSoapNote={handleSaveSoapNote}
              onCompleteConsultation={handleCompleteConsultation}
            />
          )}

          {/* 6. Prescriptions */}
          {activeTab === 'prescriptions' && (
            <DoctorPrescriptionsPage
              prescriptions={filteredPrescriptions}
              onSavePrescription={handleSavePrescription}
              defaultPatientId={activePatientId}
              defaultPatientName={
                activeConsultationPatient?.patientName ||
                patientCharts[activePatientId]?.demographics.fullName ||
                'Vikram Joshi (Sample Patient)'
              }
              defaultPatientUhid={
                activeConsultationPatient?.patientUhid ||
                patientCharts[activePatientId]?.demographics.uhid ||
                'DH-DEMO-2026-90412'
              }
            />
          )}

          {/* 7. Diagnostic Orders */}
          {activeTab === 'diagnostic-orders' && (
            <DoctorDiagnosticOrdersPage
              orders={filteredDiagnosticOrders}
              onAddDiagnosticOrder={handleAddDiagnosticOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              branches={assignedBranches}
              selectedBranchId={selectedBranchId}
            />
          )}

          {/* 8. Lab Results */}
          {activeTab === 'lab-results' && (
            <DoctorLabResultsPage
              labResults={filteredLabResults}
              onSaveDoctorReviewNote={handleSaveDoctorReviewNote}
              onOpenPatientRecords={handleViewPatientChart}
            />
          )}

          {/* 9. Specialist Referrals */}
          {activeTab === 'referrals' && (
            <DoctorReferralsPage
              referrals={filteredReferrals}
              onCreateReferral={handleCreateReferral}
              onUpdateReferralStatus={handleUpdateReferralStatus}
            />
          )}

          {/* 10. Roster & On-Call */}
          {activeTab === 'roster' && (
            <DoctorRosterPage
              roster={filteredRoster}
              onToggleOnCall={handleToggleOnCall}
              onRequestLeave={handleRequestLeave}
              doctorName={doctor.fullName}
              doctorSpecialty={doctor.specialtyName}
            />
          )}

          {/* 11. Patient Inquiries & Messages */}
          {activeTab === 'messages' && (
            <DoctorMessagesPage
              conversations={conversations}
              onSendMessage={handleSendMessage}
              onOpenPatientRecords={handleViewPatientChart}
            />
          )}

          {/* 12. Physician Profile & Settings */}
          {activeTab === 'profile' && (
            <DoctorProfilePage
              profile={doctor}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </>
      )}
    </DoctorLayout>
  );
};
