import { jsPDF } from 'jspdf';
import { LabReportItem, PatientProfile, LabParameter } from '@/types/patientPortal';

/**
 * Returns enhanced, scientifically accurate, patient-friendly educational text
 * for individual laboratory parameters.
 *
 * Adheres strictly to non-diagnostic demonstration principles:
 * - Explains what is measured and why
 * - Evaluates sample value against supplied reference interval
 * - Replaces oversimplified claims with sound physiological descriptions
 * - Clarifies composite intervals (e.g. < 100-129 mg/dL)
 * - Supplies suggested questions for treating physicians
 * - Avoids disease diagnosis or medication recommendations
 */
function getEnhancedParameterExplanation(
  param: LabParameter,
  testName: string
): {
  whatItMeasures: string;
  whyPerformed: string;
  intervalContext: string;
  statusComparison: string;
} {
  const nameLower = param.parameterName.toLowerCase();

  if (nameLower.includes('total cholesterol')) {
    return {
      whatItMeasures:
        'Quantifies the cumulative concentration of circulating sterols, comprising LDL, HDL, and very-low-density lipoproteins (VLDL) in blood serum.',
      whyPerformed:
        'Serves as an initial baseline metric to assess overall lipid distribution and systemic cardiovascular wellness.',
      intervalContext:
        'The supplied reference threshold (< 200 mg/dL) represents the established desirable target for adult non-fasting or fasting lipid panels.',
      statusComparison: param.isAbnormal
        ? `The sample value (${param.measuredValue} ${param.unit}) exceeds the standard threshold of ${param.referenceInterval}.`
        : `The sample value (${param.measuredValue} ${param.unit}) sits within the desirable reference range (${param.referenceInterval}).`,
    };
  }

  if (nameLower.includes('hdl')) {
    return {
      whatItMeasures:
        'Measures High-Density Lipoprotein particles responsible for physiological reverse cholesterol transport.',
      whyPerformed:
        'Evaluates the body’s endogenous capacity to transport excess circulating cholesterol from peripheral arterial tissues back to the liver for enzymatic catabolism, bile acid conversion, and biliary excretion.',
      intervalContext:
        'Supplied reference values (> 40 mg/dL for adult males, > 50 mg/dL for adult females) represent protective baseline minimums.',
      statusComparison: param.isAbnormal
        ? `The sample value (${param.measuredValue} ${param.unit}) is below the protective reference target of ${param.referenceInterval}.`
        : `The sample value (${param.measuredValue} ${param.unit}) meets the supplied physiological baseline target (${param.referenceInterval}).`,
    };
  }

  if (nameLower.includes('ldl')) {
    return {
      whatItMeasures:
        'Quantifies circulating Low-Density Lipoprotein particles carrying endogenous cholesterol from the liver to peripheral tissues.',
      whyPerformed:
        'Monitors atherogenic particle density. Elevated circulating LDL particles can infiltrate vascular intima under predisposing inflammatory conditions.',
      intervalContext:
        'Regarding the reference notation (< 100-129 mg/dL): Clinical laboratory guidelines designate < 100 mg/dL as optimal and 100–129 mg/dL as near-optimal/desirable for average-risk individuals.',
      statusComparison: param.isAbnormal
        ? `The sample value (${param.measuredValue} ${param.unit}) is elevated above the standard guideline threshold of ${param.referenceInterval}.`
        : `The sample value (${param.measuredValue} ${param.unit}) falls within the desirable/near-optimal clinical range (${param.referenceInterval}).`,
    };
  }

  if (nameLower.includes('triglyceride')) {
    return {
      whatItMeasures:
        'Measures circulating neutral lipid molecules synthesized from unused caloric intake, carbohydrates, and fatty acids stored in adipose tissue.',
      whyPerformed:
        'Assesses metabolic lipid turnover, energy storage regulation, and post-prandial blood clarity.',
      intervalContext:
        'The reference interval (< 150 mg/dL) designates standard normal fasting levels; values between 150–199 mg/dL are categorized as borderline.',
      statusComparison: param.isAbnormal
        ? `The sample value (${param.measuredValue} ${param.unit}) is above the normal fasting ceiling of ${param.referenceInterval}.`
        : `The sample value (${param.measuredValue} ${param.unit}) is within the normal fasting range (${param.referenceInterval}).`,
    };
  }

  if (nameLower.includes('glucose') || nameLower.includes('fbs')) {
    return {
      whatItMeasures:
        'Measures free circulating glucose in blood plasma after an overnight fasting interval of 8 to 12 hours.',
      whyPerformed:
        'Assesses basal pancreatic endocrine function, hepatic gluconeogenesis, and cellular glucose uptake sensitivity.',
      intervalContext:
        'Standard clinical laboratory fasting glucose reference is 70 – 99 mg/dL for non-diabetic individuals.',
      statusComparison: param.isAbnormal
        ? `The sample value (${param.measuredValue} ${param.unit}) lies outside the expected fasting reference interval of ${param.referenceInterval}.`
        : `The sample value (${param.measuredValue} ${param.unit}) sits within the expected fasting reference interval (${param.referenceInterval}).`,
    };
  }

  if (nameLower.includes('hba1c') || nameLower.includes('hemoglobin')) {
    return {
      whatItMeasures:
        'Measures the fraction of hemoglobin in circulating erythrocytes non-enzymatically bonded to glucose (glycated).',
      whyPerformed:
        'Provides a reliable index of weighted average blood glucose concentrations over the preceding 60 to 90 days (the average red blood cell lifespan).',
      intervalContext:
        'Reference thresholds indicate < 5.7% is standard non-diabetic; 5.7% – 6.4% indicates pre-diabetic glycemic range; ≥ 6.5% requires clinical diagnostic review.',
      statusComparison: param.isAbnormal
        ? `The sample value (${param.measuredValue} ${param.unit}) is outside standard non-diabetic limits (${param.referenceInterval}).`
        : `The sample value (${param.measuredValue} ${param.unit}) indicates normal baseline glycemic exposure over recent weeks (${param.referenceInterval}).`,
    };
  }

  // Fallback for general parameters
  return {
    whatItMeasures: `Evaluates physiological ${param.parameterName} concentrations in collected specimen.`,
    whyPerformed: `Analyzed as part of the ${testName} protocol to review baseline clinical biochemistry.`,
    intervalContext: `The reference interval (${param.referenceInterval}) represents normative data from healthy donor cohorts.`,
    statusComparison: param.isAbnormal
      ? `The measured concentration (${param.measuredValue} ${param.unit}) deviates from the standard reference interval (${param.referenceInterval}).`
      : `The measured concentration (${param.measuredValue} ${param.unit}) is within the laboratory reference interval (${param.referenceInterval}).`,
  };
}

/**
 * Generates a polished, multi-page aware, professional clinical laboratory report PDF.
 *
 * Features:
 * 1. Danvantari Hospital vector branding & department letterhead.
 * 2. Unambiguous DEMONSTRATION / SAMPLE REPORT watermarks and banners.
 * 3. Complete demographic and laboratory accession metadata without fabrication.
 * 4. Beautifully formatted, unclipped clinical parameters table.
 * 5. In-depth patient-friendly educational explanation section with suggested physician questions.
 * 6. Multi-page pagination engine with running continuation headers and dynamic "Page X of Y" footers.
 * 7. Verified non-diagnostic disclaimers.
 */
export function generateLabReportPdf(report: LabReportItem, profile: PatientProfile): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 36; // 0.5 in / 36 pt
  const contentWidth = pageWidth - 2 * margin;

  let y = margin;

  // Helper: Draw subtle diagonal watermark across page
  const drawBackgroundWatermark = () => {
    doc.saveGraphicsState();
    doc.setTextColor(244, 247, 250);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(44);
    doc.text('DEMONSTRATION SAMPLE REPORT', pageWidth / 2 - 190, pageHeight / 2 + 30, {
      angle: 38,
    });
    doc.restoreGraphicsState();
  };

  // Helper: Page Break Check
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 32) {
      doc.addPage();
      drawBackgroundWatermark();

      // Continuation Header on Page 2+
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, margin, contentWidth, 24, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 82, 186);
      doc.text(`DANVANTARI HOSPITAL • ${report.testName}`, margin + 10, margin + 15);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Ref: ${report.reportCode} • Patient: ${profile.fullName} (${profile.uhid})`, margin + 240, margin + 15);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(185, 28, 28);
      doc.text('DEMO REPORT (CONT.)', pageWidth - margin - 105, margin + 15);

      y = margin + 36;
    }
  };

  // --------------------------------------------------------------------------
  // PAGE 1 INITIALIZATION
  // --------------------------------------------------------------------------
  drawBackgroundWatermark();

  // 1. HOSPITAL BRANDING & HEADER
  // Vector Danvantari Logo Emblem (Rounded teal/blue square with white medical cross)
  const logoSize = 34;
  doc.setFillColor(15, 82, 186); // Medical Blue #0F52BA
  doc.roundedRect(margin, y, logoSize, logoSize, 5, 5, 'F');

  // Medical Cross (+) in pure white
  doc.setFillColor(255, 255, 255);
  // horizontal bar
  doc.rect(margin + 7, y + 14, 20, 6, 'F');
  // vertical bar
  doc.rect(margin + 14, y + 7, 6, 20, 'F');

  // Brand Titles beside logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 82, 186);
  doc.text('DANVANTARI HOSPITAL', margin + logoSize + 10, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(13, 148, 136); // Teal #0D9488
  doc.text('COMPASSIONATE CARE, CLINICAL EXCELLENCE', margin + logoSize + 10, y + 23);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Department of Clinical Pathology & Laboratory Medicine • ${report.branchName}`,
    margin + logoSize + 10,
    y + 32
  );

  // Top-Right Watermark / Demo Badge
  const demoBadgeWidth = 175;
  const demoBadgeX = pageWidth - margin - demoBadgeWidth;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(demoBadgeX, y, demoBadgeWidth, 34, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28);
  doc.text('DEMONSTRATION SAMPLE REPORT', demoBadgeX + 8, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(153, 27, 27);
  doc.text('NOT A VALID CLINICAL DIAGNOSTIC RECORD', demoBadgeX + 8, y + 23);
  doc.text('Synthetic patient data for evaluation only', demoBadgeX + 8, y + 30);

  y += logoSize + 12;

  // Horizontal divider line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // 2. REPORT TITLE & METADATA SECTION
  // Title Bar
  doc.setFillColor(15, 82, 186);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`LABORATORY INVESTIGATION REPORT: ${report.testName.toUpperCase()}`, margin + 10, y + 15);
  y += 28;

  // Metadata Grid Box (2 Column layout for comprehensive fields)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 88, 4, 4, 'FD');

  const metaCol1 = margin + 12;
  const metaCol2 = margin + 185;
  const metaCol3 = margin + 355;

  doc.setFontSize(7.5);

  // Row 1: Patient details
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PATIENT NAME:', metaCol1, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(profile.fullName, metaCol1 + 72, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PATIENT UHID:', metaCol2, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(profile.uhid, metaCol2 + 68, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('ACCESSION / REF:', metaCol3, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 82, 186);
  doc.text(report.reportCode, metaCol3 + 82, y + 15);

  // Row 2: Demographics & Ordering Doctor
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('AGE / GENDER:', metaCol1, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${profile.age} Yrs / ${profile.gender}`, metaCol1 + 72, y + 29);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('ORDERING DOCTOR:', metaCol2, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.orderedBy, metaCol2 + 86, y + 29);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DOCTOR SPECIALITY:', metaCol3, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.doctorSpecialty, metaCol3 + 92, y + 29);

  // Row 3: Timestamps
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('SAMPLE COLLECTED:', metaCol1, y + 43);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.dateCollected, metaCol1 + 88, y + 43);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('REPORT VERIFIED:', metaCol2, y + 43);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.dateReported, metaCol2 + 82, y + 43);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('REPORT STATUS:', metaCol3, y + 43);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52); // Green
  doc.text(report.status, metaCol3 + 74, y + 43);

  // Row 4: Specimen, Fasting State & Laboratory Department
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('SPECIMEN TYPE:', metaCol1, y + 57);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.specimenType, metaCol1 + 76, y + 57);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('FASTING STATUS:', metaCol2, y + 57);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.fastingState || 'Not available in demonstration data', metaCol2 + 78, y + 57);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DEPARTMENT:', metaCol3, y + 57);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('Clinical Biochemistry', metaCol3 + 68, y + 57);

  // Row 5: Associated OPD Ref or Note
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('ASSOCIATED OPD REF:', metaCol1, y + 71);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(
    report.associatedAppointmentCode
      ? `${report.associatedAppointmentCode} (Scheduled Consultation)`
      : 'Not available in demonstration data',
    metaCol1 + 98,
    y + 71
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TEST FACILITY:', metaCol2, y + 71);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.branchName, metaCol2 + 66, y + 71);

  y += 98;

  // 3. CLINICAL REPORT TABLE
  // Table Header
  const tableHeaderHeight = 20;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, tableHeaderHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 82, 186); // Navy blue

  const colParamNameX = margin + 10;
  const colMeasuredValX = margin + 215;
  const colUnitX = margin + 305;
  const colRefIntervalX = margin + 365;
  const colStatusX = margin + 465;

  doc.text('BIOMARKER / PARAMETER', colParamNameX, y + 13);
  doc.text('MEASURED VALUE', colMeasuredValX, y + 13);
  doc.text('UNITS', colUnitX, y + 13);
  doc.text('REFERENCE INTERVAL', colRefIntervalX, y + 13);
  doc.text('STATUS', colStatusX, y + 13);

  y += tableHeaderHeight;

  // Parameter Rows with distinct alternating backgrounds and clean cell borders
  report.parameters.forEach((param, idx) => {
    checkPageBreak(24);

    const isEven = idx % 2 === 0;
    const rowHeight = 20;

    if (!isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    // Biomarker Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(param.parameterName, colParamNameX, y + 13);

    // Measured Value (Highlight if abnormal)
    doc.setFontSize(8.5);
    if (param.isAbnormal) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text(`${param.measuredValue} *`, colMeasuredValX, y + 13);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(param.measuredValue, colMeasuredValX, y + 13);
    }

    // Units
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(param.unit, colUnitX, y + 13);

    // Reference Interval
    doc.text(param.referenceInterval, colRefIntervalX, y + 13);

    // Status Flag
    if (param.isAbnormal) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('OUT OF RANGE', colStatusX, y + 13);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52);
      doc.text('NORMAL', colStatusX, y + 13);
    }

    y += rowHeight;
  });

  y += 10;

  // Pathologist Clinical Interpretation Callout
  checkPageBreak(50);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 82, 186);
  doc.text('PATHOLOGIST CLINICAL INTERPRETATION NOTE:', margin + 10, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(report.interpretation, margin + 10, y + 25, {
    maxWidth: contentWidth - 20,
    lineHeightFactor: 1.25,
  });

  y += 50;

  // --------------------------------------------------------------------------
  // 4. PATIENT-FRIENDLY EXPLANATION (COMPREHENSIVE EDUCATIONAL SECTION)
  // --------------------------------------------------------------------------
  checkPageBreak(40);

  // Section Header Banner
  doc.setFillColor(254, 243, 199); // Warm Amber
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.text('UNDERSTANDING YOUR REPORT – PATIENT-FRIENDLY EXPLANATION', margin + 10, y + 14);
  y += 28;

  // Educational Introduction
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  const introText =
    `${report.generalDescription} ${report.clinicalSignificance} ` +
    'The reference intervals represent standard concentrations identified in non-diseased baseline populations. ' +
    'Individual values should always be interpreted in the context of your complete health status, medical history, and clinical consultation. ' +
    'A value within the reference interval does not by itself guarantee absolute absence of disease, nor does a minor deviation automatically imply illness.';

  const splitIntro = doc.splitTextToSize(introText, contentWidth - 8);
  checkPageBreak(splitIntro.length * 11);
  doc.text(splitIntro, margin + 4, y);
  y += splitIntro.length * 11 + 8;

  // Detailed Breakdown per Parameter
  report.parameters.forEach((param) => {
    const details = getEnhancedParameterExplanation(param, report.testName);

    // Compute text blocks
    const whatText = `What this measures & Why: ${details.whatItMeasures} ${details.whyPerformed}`;
    const intervalText = `Reference Interval Context: ${details.intervalContext}`;
    const statusText = `Evaluation: ${details.statusComparison}`;

    const splitWhat = doc.splitTextToSize(whatText, contentWidth - 24);
    const splitInterval = doc.splitTextToSize(intervalText, contentWidth - 24);
    const splitStatus = doc.splitTextToSize(statusText, contentWidth - 24);

    const blockHeight = 16 + splitWhat.length * 10 + splitInterval.length * 10 + splitStatus.length * 10 + 10;
    checkPageBreak(blockHeight);

    // Parameter Card Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, blockHeight - 4, 3, 3, 'FD');

    // Title of Parameter
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(13, 148, 136); // Teal
    doc.text(`• ${param.parameterName} (${param.measuredValue} ${param.unit})`, margin + 10, y + 12);

    let curY = y + 23;

    // What it measures
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(splitWhat, margin + 14, curY);
    curY += splitWhat.length * 10;

    // Interval context
    doc.setTextColor(71, 85, 105);
    doc.text(splitInterval, margin + 14, curY);
    curY += splitInterval.length * 10;

    // Status comparison
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(param.isAbnormal ? 185 : 22, param.isAbnormal ? 28 : 101, param.isAbnormal ? 28 : 52);
    doc.text(splitStatus, margin + 14, curY);

    y += blockHeight;
  });

  y += 4;

  // Questions for Treating Doctor Box
  checkPageBreak(65);
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(3, 105, 161);
  doc.text('SUGGESTED QUESTIONS TO ASK YOUR TREATING DOCTOR:', margin + 10, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(12, 74, 110);
  doc.text('1. "How do these results integrate with my broader medical history, lifestyle, and cardiovascular wellness?"', margin + 12, y + 24);
  doc.text('2. "Are there any targeted lifestyle, nutritional, or physical activity habits you recommend based on this distribution?"', margin + 12, y + 35);
  doc.text('3. "When is my next routine screening interval recommended to monitor these parameters longitudinally?"', margin + 12, y + 46);

  y += 62;

  // --------------------------------------------------------------------------
  // 5. MANDATORY CLINICAL DEMONSTRATION DISCLAIMERS
  // --------------------------------------------------------------------------
  checkPageBreak(48);

  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(153, 27, 27);
  doc.text('DEMONSTRATION SAMPLE REPORT – NOT A VALID CLINICAL DIAGNOSTIC RECORD.', margin + 10, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(127, 29, 29);
  doc.text(
    'Patient-friendly explanations are for general understanding only and do not replace professional medical advice. ' +
    'Normal results do not preclude clinical conditions or guarantee good health. No clinical decisions, medication changes, or self-treatment ' +
    'should be made based on this demonstration sheet. Always consult your qualified physician for individualized medical advice and treatment plans.',
    margin + 10,
    y + 22,
    {
      maxWidth: contentWidth - 20,
      lineHeightFactor: 1.25,
    }
  );

  // --------------------------------------------------------------------------
  // 6. RUNNING FOOTERS & MULTI-PAGE NUMBERING
  // --------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, pageHeight - margin + 8, pageWidth - margin, pageHeight - margin + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Danvantari Hospital Diagnostic Network • ${report.branchName} • Patient: ${profile.fullName} (UHID: ${profile.uhid}) • Ref: ${report.reportCode}`,
      margin,
      pageHeight - margin + 18
    );

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 48, pageHeight - margin + 18);
  }

  // Trigger browser download if running in browser window
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    const cleanFilename = `${report.reportCode}_${report.testName.replace(/[^a-zA-Z0-9]/g, '_')}_DemoReport.pdf`;
    doc.save(cleanFilename);
  }

  return doc;
}
