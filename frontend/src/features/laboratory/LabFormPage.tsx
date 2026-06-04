import { ModuleForm } from '../../components/ui/ModuleForm';

export function LabFormPage() {
  return (
    <ModuleForm title="Request Lab Test" subtitle="Create test request, sample type, and doctor access details." endpoint="/lab-reports">
      <input name="patientId" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Patient ID" />
      <input name="doctorId" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Doctor ID" />
      <input name="testName" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Test name" />
      <input name="sampleType" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Sample type" />
      <select name="status" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue="requested">
        <option value="requested">Requested</option>
        <option value="sample_collected">Sample collected</option>
      </select>
    </ModuleForm>
  );
}
