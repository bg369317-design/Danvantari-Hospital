import React, { useState, useMemo } from 'react';
import { DoctorProfile, HospitalBranch, MedicalSpecialty } from '@/types/publicWebsite';
import {
  Search,
  Stethoscope,
  MapPin,
  GraduationCap,
  Award,
  Calendar,
  Filter,
  X,
} from 'lucide-react';
import { DemoBadge } from '@/portals/public/components/DemoBadge';

interface FindDoctorSectionProps {
  doctors: DoctorProfile[];
  branches: HospitalBranch[];
  specialties: MedicalSpecialty[];
  initialSpecialtyId?: string | null;
  onBookDoctor?: (doctor: DoctorProfile) => void;
}

export const FindDoctorSection: React.FC<FindDoctorSectionProps> = ({
  doctors,
  branches,
  specialties,
  initialSpecialtyId = null,
  onBookDoctor,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(
    initialSpecialtyId ?? 'all'
  );
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDoctorModal, setSelectedDoctorModal] = useState<DoctorProfile | null>(null);

  // Synchronize when initialSpecialtyId changes externally
  React.useEffect(() => {
    if (initialSpecialtyId) {
      setSelectedSpecialty(initialSpecialtyId);
    }
  }, [initialSpecialtyId]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialtyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'all' || doc.specialtyId === selectedSpecialty;

      const matchesBranch =
        selectedBranch === 'all' || doc.primaryBranchId === selectedBranch;

      return matchesSearch && matchesSpecialty && matchesBranch;
    });
  }, [doctors, searchTerm, selectedSpecialty, selectedBranch]);

  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name.replace(' (Sample Location)', '') : 'Hospital Campus';
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('all');
    setSelectedBranch('all');
  };

  return (
    <section
      id="doctors"
      style={{
        padding: '4rem 1.5rem',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <DemoBadge label="Sample Medical Faculty – For Evaluation" />
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
            Find a Doctor &amp; Clinical Specialists
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Search certified consultants across cardiology, neurology, orthopedics, pediatrics, and internal medicine. View qualifications, clinic schedules, and consultation availability.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                color="var(--color-text-muted)"
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doctor name or specialty..."
                aria-label="Search by doctor name or specialty"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Specialty Dropdown */}
            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                aria-label="Filter by clinical specialty"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  outline: 'none',
                }}
              >
                <option value="all">All Medical Specialties</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Dropdown */}
            <div>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                aria-label="Filter by hospital branch"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  outline: 'none',
                }}
              >
                <option value="all">All Hospital Campuses</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name.replace(' (Sample Location)', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            <div>
              <button
                onClick={handleClearFilters}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Filter size={15} />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <span>
              Showing <strong>{filteredDoctors.length}</strong> verified sample doctors
            </span>
            <span style={{ color: '#D97706' }}>
              Note: Sample profiles for demonstration only. Actual doctor credentials will be loaded in production.
            </span>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)',
            }}
          >
            <Stethoscope size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text)' }}>
              No Doctors Match Your Search Criteria
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', maxWidth: '420px', margin: '0.25rem auto 1rem auto' }}>
              Try clearing search keywords or selecting all medical specialties to browse all consultants.
            </p>
            <button
              onClick={handleClearFilters}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Show All Available Doctors
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {/* Doctor Card Top Bar */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  {/* Doctor Avatar Placeholder */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid #BFDBFE',
                    }}
                  >
                    <Stethoscope size={30} color="var(--color-primary)" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'var(--color-text)',
                          lineHeight: 1.3,
                        }}
                      >
                        {doctor.fullName}
                      </h3>
                    </div>
                    <p style={{ color: 'var(--color-teal)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                      {doctor.specialtyName}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                      {doctor.title}
                    </p>
                  </div>
                </div>

                {/* Badges and Credentials */}
                <div
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <GraduationCap size={15} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--color-text)' }}>{doctor.qualifications}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={15} color="var(--color-teal)" />
                    <span style={{ color: 'var(--color-text)' }}>
                      <strong>{doctor.experienceYears}+ Years</strong> Clinical Experience
                    </span>
                  </div>
                </div>

                {/* Location & Consultation Days */}
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <MapPin size={14} color="var(--color-primary)" />
                    <span>{getBranchName(doctor.primaryBranchId)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} color="var(--color-teal)" />
                    <span>OPD Days: {doctor.consultationDays.join(', ')}</span>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '1rem',
                    marginTop: 'auto',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    onClick={() => setSelectedDoctorModal(doctor)}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--color-teal)',
                      padding: '0.4rem 0.6rem',
                    }}
                  >
                    View Full Bio
                  </button>

                  <button
                    onClick={() => onBookDoctor?.(doctor)}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Doctor Full Profile Modal */}
        {selectedDoctorModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-doctor-name"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '560px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setSelectedDoctorModal(null)}
                aria-label="Close Doctor Profile"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <X size={18} />
              </button>

              <div style={{ marginBottom: '1rem' }}>
                <DemoBadge label="Sample Profile Data – Demo Only" />
              </div>

              <h3
                id="modal-doctor-name"
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--color-primary-dark)',
                  marginBottom: '0.25rem',
                }}
              >
                {selectedDoctorModal.fullName}
              </h3>
              <p style={{ color: 'var(--color-teal)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {selectedDoctorModal.specialtyName} • {selectedDoctorModal.title}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <p style={{ marginBottom: '0.4rem' }}>
                  <strong>Degrees &amp; Credentials:</strong> {selectedDoctorModal.qualifications}
                </p>
                <p style={{ marginBottom: '0.4rem' }}>
                  <strong>Medical Registration:</strong> {selectedDoctorModal.registrationNumber}
                </p>
                <p style={{ marginBottom: '0.4rem' }}>
                  <strong>Languages:</strong> {selectedDoctorModal.languages.join(', ')}
                </p>
                <p>
                  <strong>Estimated Sample Fee:</strong> {selectedDoctorModal.consultationFee}
                </p>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
                Clinical Background:
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {selectedDoctorModal.bio}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedDoctorModal(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const doc = selectedDoctorModal;
                    setSelectedDoctorModal(null);
                    onBookDoctor?.(doc);
                  }}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Proceed to Consultation Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
