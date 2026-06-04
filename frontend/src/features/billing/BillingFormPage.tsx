import { ModuleForm } from '../../components/ui/ModuleForm';

export function BillingFormPage() {
  return (
    <ModuleForm title="Create Bill" subtitle="Issue consultation, lab, room, pharmacy, and GST charges." endpoint="/bills">
      <input name="patientId" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Patient ID" />
      <input name="invoiceNumber" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Invoice number" />
      <input name="items.0.description" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Charge description" />
      <input name="items.0.unitPrice" type="number" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Amount" />
      <input name="items.0.gstPercent" type="number" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="GST %" />
    </ModuleForm>
  );
}
