import { ModuleForm } from '../../components/ui/ModuleForm';

export function EmrFormPage() {
  return (
    <ModuleForm title="Create EMR" subtitle="Record diagnosis, treatment, notes, and vitals." endpoint="/medical-records">
      <input name="patientId" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Patient ID" />
      <input name="doctorId" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Doctor ID" />
      <input name="diagnosis" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Diagnosis" />
      <input name="treatment" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Treatment plan" />
      <textarea name="notes" className="min-h-28 rounded-md border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 md:col-span-2" placeholder="Medical notes" />
    </ModuleForm>
  );
}
