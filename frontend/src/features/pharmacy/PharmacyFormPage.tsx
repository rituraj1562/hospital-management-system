import { ModuleForm } from '../../components/ui/ModuleForm';

export function PharmacyFormPage() {
  return (
    <ModuleForm title="Medicine Inventory" subtitle="Record stock movement, purchase, dispense, and billing details." endpoint="/inventory">
      <input name="medicineId" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Medicine ID" />
      <input name="quantity" type="number" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Quantity" />
      <select name="movementType" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue="purchase">
        <option value="purchase">Purchase</option>
        <option value="sale">Sale</option>
        <option value="dispensed">Dispensed</option>
      </select>
      <input name="supplier" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Supplier" />
      <input name="referenceNo" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Reference number" />
    </ModuleForm>
  );
}
