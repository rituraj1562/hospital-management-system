import { ModuleForm } from '../../components/ui/ModuleForm';

export function DoctorFormPage() {
  return (
    <ModuleForm title="Add Doctor" subtitle="Create doctor profile, specialization, availability, and consultation fee." endpoint="/doctors">
      <input name="userId" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="User ID" />
      <input name="employeeCode" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Employee code" />
      <input name="specialization" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Specialization" />
      <input name="department" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Department" />
      <input name="consultationFee" type="number" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Consultation fee" />
      <input name="licenseNumber" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="License number" />
    </ModuleForm>
  );
}
