import { Link } from 'react-router-dom';
import { AuthShell } from './AuthShell';

export function PendingApprovalPage() {
  return (
    <AuthShell title="Approval pending" subtitle="Your staff account needs hospital administrator approval.">
      <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">What happens next?</p>
        <p>Verify your email first. A hospital admin can then approve your Doctor, Receptionist, Pharmacist, or Lab Technician account from the user approval queue.</p>
      </div>
      <Link to="/login" className="mt-5 block text-sm text-brand-700">Back to login</Link>
    </AuthShell>
  );
}
