import React, { useState } from 'react';
import { BillingInvoice } from '@/types/patientPortal';
import { Download, AlertCircle } from 'lucide-react';

interface BillingPageProps {
  invoices: BillingInvoice[];
}

export const BillingPage: React.FC<BillingPageProps> = ({ invoices }) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownloadAttempt = (invoiceNum: string) => {
    setDownloadNotice(
      `PDF export for ${invoiceNum} is a demonstration placeholder. In production, authentic hospital financial receipts will be generated via your billing provider.`
    );
    setTimeout(() => {
      setDownloadNotice(null);
    }, 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          Billing, Invoices &amp; Receipts
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Consultation fees, diagnostic laboratory billing, and outpatient payment records.
        </p>
      </div>

      {downloadNotice && (
        <div
          role="status"
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: 'var(--color-primary-dark)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span>{downloadNotice}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {invoices.map((inv) => (
          <div
            key={inv.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                  }}
                >
                  {inv.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Invoice: {inv.invoiceNumber}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Date: {inv.date}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {inv.serviceDescription}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Facility: {inv.branchName} • Settled via {inv.paymentMode}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Amount Billed</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  ₹{inv.amount.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                onClick={() => handleDownloadAttempt(inv.invoiceNumber)}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Download size={14} />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
