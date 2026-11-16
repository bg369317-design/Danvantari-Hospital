import React, { useState, useMemo } from 'react';
import {
  PatientTab,
  PatientAppointment,
  ExternalMedicalHistoryItem,
  SecondOpinionRequest,
  InAppNotification,
  SearchResultItem,
} from '@/types/patientPortal';
import { PatientLayout } from '@/portals/patient/layouts/PatientLayout';
import { PatientDashboard } from '@/portals/patient/components/PatientDashboard';
import { MyAppointmentsPage } from '@/portals/patient/pages/MyAppointmentsPage';
import { BookAppointmentPage } from '@/portals/patient/pages/BookAppointmentPage';
import { MedicalRecordsPage } from '@/portals/patient/pages/MedicalRecordsPage';
import { LabReportsPage } from '@/portals/patient/pages/LabReportsPage';
import { PrescriptionsPage } from '@/portals/patient/pages/PrescriptionsPage';
import { BillingPage } from '@/portals/patient/pages/BillingPage';
import { SecondOpinionPage } from '@/portals/patient/pages/SecondOpinionPage';
import { MessagesPage } from '@/portals/patient/pages/MessagesPage';
import { ProfileSettingsPage } from '@/portals/patient/pages/ProfileSettingsPage';
import {
  SAMPLE_PATIENT_PROFILE,
  INITIAL_PATIENT_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_EXTERNAL_RECORDS,
  INITIAL_LAB_REPORTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_SECOND_OPINIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_MESSAGES,
} from '@/config/patientSampleData';
import {
  SAMPLE_BRANCHES,
  SAMPLE_SPECIALTIES,
  SAMPLE_DOCTORS,
} from '@/config/publicSampleData';

interface PatientPortalViewProps {
  onExitToPublic?: (() => void) | undefined;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({ onExitToPublic }) => {
  const [activeTab, setActiveTab] = useState<PatientTab>('dashboard');

  // Dynamic State for Patient Data
  const [appointments, setAppointments] = useState<PatientAppointment[]>(INITIAL_PATIENT_APPOINTMENTS);
  const [externalRecords, setExternalRecords] = useState<ExternalMedicalHistoryItem[]>(INITIAL_EXTERNAL_RECORDS);
  const [secondOpinions, setSecondOpinions] = useState<SecondOpinionRequest[]>(INITIAL_SECOND_OPINIONS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);

  // Read-only baseline datasets
  const hospitalRecords = INITIAL_MEDICAL_RECORDS;
  const labReports = INITIAL_LAB_REPORTS;
  const prescriptions = INITIAL_PRESCRIPTIONS;
  const invoices = INITIAL_INVOICES;

  // External Records Handlers
  const handleAddExternalRecord = (newRecord: ExternalMedicalHistoryItem) => {
    setExternalRecords((prev) => [newRecord, ...prev]);

    // Push demonstration notification
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      type: 'external_record_added',
      title: 'External Medical Record Added',
      description: `${newRecord.diagnosis} from ${newRecord.facilityName} added to your personal history file.`,
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'records',
      targetReference: newRecord.recordCode,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateExternalRecord = (updatedRecord: ExternalMedicalHistoryItem) => {
    setExternalRecords((prev) =>
      prev.map((rec) => (rec.id === updatedRecord.id ? updatedRecord : rec))
    );
  };

  const handleDeleteExternalRecord = (id: string) => {
    setExternalRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  // Appointment Booking Handler
  const handleAppointmentBooked = (newAppointment: PatientAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);

    // Push notification
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      type: 'appointment_booked',
      title: 'Appointment Booked (Demo)',
      description: `Consultation with ${newAppointment.doctorName} confirmed for ${newAppointment.date} at ${newAppointment.timeSlot}. Ref: ${newAppointment.appointmentCode}`,
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'appointments',
      targetReference: newAppointment.appointmentCode,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Second Opinion Submission Handler
  const handleSubmitSecondOpinion = (
    data: Omit<SecondOpinionRequest, 'id' | 'requestCode' | 'submissionDate' | 'status'>
  ) => {
    const newCode = `2ND-DEMO-${Math.floor(803 + Math.random() * 100)}`;
    const newSO: SecondOpinionRequest = {
      id: `so-${Date.now()}`,
      requestCode: newCode,
      submissionDate: new Date().toISOString().split('T')[0] ?? '2026-11-16',
      status: 'Submitted (Demo)',
      ...data,
    };
    setSecondOpinions((prev) => [newSO, ...prev]);

    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      type: 'second_opinion_update',
      title: 'Second Opinion Dossier Logged',
      description: `Collegiate review requested for ${data.specialtyName}. Tracking Ref: ${newCode}`,
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'second-opinion',
      targetReference: newCode,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Aggregated Searchable Records for Reference-Number Universal Search
  const allSearchableRecords = useMemo<SearchResultItem[]>(() => {
    const list: SearchResultItem[] = [];

    // 1. Appointments
    appointments.forEach((apt) => {
      list.push({
        id: apt.id,
        referenceNumber: apt.appointmentCode,
        title: `${apt.doctorName} – ${apt.specialtyName}`,
        subtitle: `${apt.date} at ${apt.timeSlot} • ${apt.branchName}`,
        category: 'Appointment',
        date: apt.date,
        targetTab: 'appointments',
      });
    });

    // 2. Hospital Records
    hospitalRecords.forEach((rec) => {
      list.push({
        id: rec.id,
        referenceNumber: rec.recordCode,
        title: rec.diagnosisSummary,
        subtitle: `${rec.doctorName} • ${rec.date} • ${rec.category}`,
        category: 'Medical Record',
        date: rec.date,
        targetTab: 'records',
      });
    });

    // 3. External Records
    externalRecords.forEach((ext) => {
      list.push({
        id: ext.id,
        referenceNumber: ext.recordCode,
        title: ext.diagnosis,
        subtitle: `${ext.facilityName} (${ext.consultantName}) • ${ext.treatmentDate}`,
        category: 'External Record',
        date: ext.treatmentDate,
        targetTab: 'records',
      });
    });

    // 4. Lab Reports
    labReports.forEach((lab) => {
      list.push({
        id: lab.id,
        referenceNumber: lab.reportCode,
        title: lab.testName,
        subtitle: `${lab.dateReported} • ${lab.status} • ${lab.branchName}`,
        category: 'Lab Report',
        date: lab.dateReported,
        targetTab: 'labs',
      });
    });

    // 5. Prescriptions
    prescriptions.forEach((rx) => {
      list.push({
        id: rx.id,
        referenceNumber: rx.rxCode,
        title: rx.medicationName,
        subtitle: `${rx.dosage} • ${rx.doctorName}`,
        category: 'Prescription',
        date: rx.prescribedDate,
        targetTab: 'prescriptions',
      });
    });

    // 6. Billing Invoices
    invoices.forEach((inv) => {
      list.push({
        id: inv.id,
        referenceNumber: inv.invoiceNumber,
        title: inv.serviceDescription,
        subtitle: `₹${inv.amount.toLocaleString('en-IN')} • ${inv.date} • ${inv.branchName}`,
        category: 'Invoice',
        date: inv.date,
        targetTab: 'billing',
      });
    });

    // 7. Second Opinions
    secondOpinions.forEach((so) => {
      list.push({
        id: so.id,
        referenceNumber: so.requestCode,
        title: `${so.specialtyName} – ${so.currentDiagnosis}`,
        subtitle: `Submitted ${so.submissionDate} • ${so.urgency}`,
        category: 'Second Opinion',
        date: so.submissionDate,
        targetTab: 'second-opinion',
      });
    });

    return list;
  }, [appointments, hospitalRecords, externalRecords, labReports, prescriptions, invoices, secondOpinions]);

  // Handle Search Result Selection: Navigate to the corresponding tab & highlight
  const handleSelectSearchResult = (result: SearchResultItem) => {
    setActiveTab(result.targetTab);

    // Scroll to matching item if on page
    setTimeout(() => {
      const ref = result.referenceNumber;
      const element = document.getElementById(`record-row-${ref}`) ||
                      document.getElementById(`rx-row-${ref}`) ||
                      document.getElementById(`opinion-row-${ref}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <PatientLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      profile={SAMPLE_PATIENT_PROFILE}
      notifications={notifications}
      onMarkNotificationAsRead={handleMarkNotificationAsRead}
      onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      allSearchableRecords={allSearchableRecords}
      onSelectSearchResult={handleSelectSearchResult}
      onExitPortal={onExitToPublic}
    >
      {activeTab === 'dashboard' && (
        <PatientDashboard
          profile={SAMPLE_PATIENT_PROFILE}
          upcomingAppointments={appointments.filter((a) => a.status === 'Upcoming')}
          recentLabs={labReports}
          activePrescriptions={prescriptions.filter((p) => p.status === 'Active')}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'appointments' && (
        <MyAppointmentsPage
          appointments={appointments}
          onNavigateToBook={() => setActiveTab('book')}
        />
      )}

      {activeTab === 'book' && (
        <BookAppointmentPage
          branches={SAMPLE_BRANCHES}
          specialties={SAMPLE_SPECIALTIES}
          doctors={SAMPLE_DOCTORS}
          onAppointmentBooked={handleAppointmentBooked}
          onNavigateToAppointments={() => setActiveTab('appointments')}
        />
      )}

      {activeTab === 'records' && (
        <MedicalRecordsPage
          hospitalRecords={hospitalRecords}
          externalRecords={externalRecords}
          onAddExternalRecord={handleAddExternalRecord}
          onUpdateExternalRecord={handleUpdateExternalRecord}
          onDeleteExternalRecord={handleDeleteExternalRecord}
        />
      )}

      {activeTab === 'labs' && (
        <LabReportsPage reports={labReports} profile={SAMPLE_PATIENT_PROFILE} />
      )}

      {activeTab === 'prescriptions' && (
        <PrescriptionsPage prescriptions={prescriptions} />
      )}

      {activeTab === 'billing' && (
        <BillingPage invoices={invoices} />
      )}

      {activeTab === 'second-opinion' && (
        <SecondOpinionPage
          branches={SAMPLE_BRANCHES}
          specialties={SAMPLE_SPECIALTIES}
          secondOpinions={secondOpinions}
          onSubmitSecondOpinion={handleSubmitSecondOpinion}
          onOpenMedicalRecord={(_recCode) => setActiveTab('records')}
        />
      )}

      {activeTab === 'messages' && (
        <MessagesPage initialMessages={INITIAL_SUPPORT_MESSAGES} />
      )}

      {activeTab === 'profile' && (
        <ProfileSettingsPage profile={SAMPLE_PATIENT_PROFILE} />
      )}
    </PatientLayout>
  );
};
