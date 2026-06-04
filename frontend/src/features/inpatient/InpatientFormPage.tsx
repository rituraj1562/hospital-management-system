import { ModuleForm } from '../../components/ui/ModuleForm';

export function InpatientFormPage() {
  return (
    <ModuleForm title="Admission Management" subtitle="Allocate room, bed, doctor, and admission reason." endpoint="/admissions">
      <input name="patientId" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Patient ID" />
      <input name="doctorId" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Doctor ID" />
      <input name="roomId" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Room ID" />
      <input name="bedId" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Bed ID" />
      <input name="reason" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Admission reason" />
    </ModuleForm>
  );
}
