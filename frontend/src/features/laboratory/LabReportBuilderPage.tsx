import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../app/hooks';
import { pushToast } from '../dashboard/uiSlice';
import { mockLabParameters } from '../../services/mockData';

function escapeHtml(value: unknown) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return entities[char];
  });
}

export function LabReportBuilderPage() {
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState(mockLabParameters);
  const [approved, setApproved] = useState(false);

  function approveReport() {
    setApproved(true);
    dispatch(pushToast({ type: 'success', message: 'Lab report approved and locked for release.' }));
  }

  function downloadPdf() {
    const generatedAt = new Date().toLocaleString();
    const resultRows = rows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.parameter)}</td>
            <td>${escapeHtml(row.value)} ${escapeHtml(row.unit)}</td>
            <td>${escapeHtml(row.referenceRange)}</td>
            <td><span class="flag ${escapeHtml(row.flag)}">${escapeHtml(row.flag)}</span></td>
          </tr>
        `
      )
      .join('');

    const reportHtml = `
      <!doctype html>
      <html>
        <head>
          <title>HMS Lab Report</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 40px; color: #0f172a; font-family: Arial, sans-serif; background: #f8fafc; }
            .sheet { max-width: 820px; margin: 0 auto; padding: 36px; border: 1px solid #dbe4ee; border-radius: 18px; background: #fff; }
            .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #0f766e; padding-bottom: 20px; }
            .brand { color: #0f766e; font-size: 26px; font-weight: 800; }
            .muted { color: #64748b; font-size: 13px; line-height: 1.5; }
            h1 { margin: 28px 0 8px; font-size: 24px; }
            .meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 24px 0; }
            .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
            .label { color: #64748b; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            .value { margin-top: 6px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            th { background: #ecfeff; color: #155e75; font-size: 11px; letter-spacing: .08em; text-align: left; text-transform: uppercase; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 14px; }
            .flag { border-radius: 999px; padding: 5px 10px; background: #e2e8f0; font-size: 12px; font-weight: 700; text-transform: capitalize; }
            .high, .critical { background: #fee2e2; color: #991b1b; }
            .normal { background: #dcfce7; color: #166534; }
            .footer { display: flex; justify-content: space-between; gap: 24px; margin-top: 44px; }
            .signature { width: 220px; border-top: 1px solid #94a3b8; padding-top: 10px; text-align: center; }
            @media print {
              body { padding: 0; background: #fff; }
              .sheet { border: 0; border-radius: 0; max-width: none; }
            }
          </style>
        </head>
        <body>
          <main class="sheet">
            <section class="header">
              <div>
                <div class="brand">HMS Console</div>
                <div class="muted">City Care Hospital<br />Clinical Laboratory Department</div>
              </div>
              <div class="muted">
                Report No: LAB-${Date.now()}<br />
                Generated: ${escapeHtml(generatedAt)}<br />
                Status: ${approved ? 'Approved' : 'Draft'}
              </div>
            </section>
            <h1>Laboratory Test Report</h1>
            <p class="muted">Patient: Ankit Pandey | Test Panel: CBC + Inflammatory markers</p>
            <section class="meta">
              <div class="box"><div class="label">Requested By</div><div class="value">Dr. Meera Shah</div></div>
              <div class="box"><div class="label">Sample</div><div class="value">Blood</div></div>
              <div class="box"><div class="label">Collected</div><div class="value">${escapeHtml(generatedAt)}</div></div>
              <div class="box"><div class="label">Approved</div><div class="value">${approved ? 'Yes' : 'Pending approval'}</div></div>
            </section>
            <table>
              <thead><tr><th>Parameter</th><th>Value</th><th>Reference</th><th>Flag</th></tr></thead>
              <tbody>${resultRows}</tbody>
            </table>
            <section class="footer">
              <div class="muted">This report is generated from HMS Console. Please correlate clinically.</div>
              <div class="signature">Authorized Signatory</div>
            </section>
          </main>
        </body>
      </html>
    `;

    const printFrame = document.createElement('iframe');
    printFrame.title = 'HMS lab report PDF export';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentWindow?.document;
    if (!printDocument || !printFrame.contentWindow) {
      printFrame.remove();
      dispatch(pushToast({ type: 'error', message: 'Unable to prepare the PDF report. Please try again.' }));
      return;
    }

    printDocument.open();
    printDocument.write(reportHtml);
    printDocument.close();

    window.setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      dispatch(pushToast({ type: 'success', message: 'PDF print dialog opened. Choose Save as PDF to download.' }));
    }, 250);

    window.setTimeout(() => printFrame.remove(), 60000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lab Report Builder</h1>
        <p className="text-sm text-slate-500">Enter parameters, compare ranges, flag abnormal values, and export reports.</p>
      </div>
      <Card className="flex flex-col gap-3 border-l-4 border-l-[var(--accent)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Report status</p>
          <p className="mt-1 text-lg font-bold">{approved ? 'Approved for doctor and patient access' : 'Draft report awaiting approval'}</p>
        </div>
        <StatusBadge status={approved ? 'approved' : 'pending'} />
      </Card>
      <Card>
        <div className="grid gap-3 md:grid-cols-5">
          <input className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Parameter" />
          <input className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Value" />
          <input className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Unit" />
          <input className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Reference range" />
          <Button onClick={() => setRows((current) => [...current, { parameter: 'CRP', value: '8', unit: 'mg/L', referenceRange: '<5', flag: 'high' }])}>Add</Button>
        </div>
      </Card>
      <DataTable
        rows={rows}
        columns={[
          { key: 'parameter', header: 'Parameter', render: (row) => row.parameter },
          { key: 'value', header: 'Value', render: (row) => `${row.value} ${row.unit}` },
          { key: 'range', header: 'Reference', render: (row) => row.referenceRange },
          { key: 'flag', header: 'Flag', render: (row) => <StatusBadge status={row.flag} /> }
        ]}
      />
      <div className="flex gap-3">
        <Button onClick={approveReport} disabled={approved}>
          {approved ? 'Report Approved' : 'Approve Report'}
        </Button>
        <Button onClick={downloadPdf}>Download PDF</Button>
      </div>
    </div>
  );
}
