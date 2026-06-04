import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { pushToast } from '../dashboard/uiSlice';
import { mockStockAlerts } from '../../services/mockData';

export function MedicineAlertsPage() {
  const dispatch = useAppDispatch();
  const [purchaseOrders, setPurchaseOrders] = useState<Record<string, string>>({});
  const critical = mockStockAlerts.filter((item) => item.risk !== 'healthy');
  const pendingPurchaseOrders = critical.filter((item) => !purchaseOrders[item.id]).length;

  function createPurchaseOrder(item: (typeof mockStockAlerts)[number]) {
    const poNumber = `PO-${new Date().getFullYear()}-${String(Object.keys(purchaseOrders).length + 1).padStart(3, '0')}`;
    setPurchaseOrders((current) => ({ ...current, [item.id]: poNumber }));
    dispatch(pushToast({ type: 'success', message: `${poNumber} created for ${item.name}.` }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Medicine Stock & Expiry Alerts</h1>
        <p className="text-sm text-slate-500">Monitor low stock, expiry windows, and purchase suggestions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Low stock</p><p className="mt-2 text-2xl font-bold">2</p></Card>
        <Card><p className="text-sm text-slate-500">Expiring in 30 days</p><p className="mt-2 text-2xl font-bold">2</p></Card>
        <Card><p className="text-sm text-slate-500">Suggested purchase orders</p><p className="mt-2 text-2xl font-bold">{pendingPurchaseOrders}</p></Card>
      </div>
      <Card>
        <div className="mb-4 flex items-center gap-2 text-amber-700">
          <AlertTriangle size={18} />
          <p className="font-semibold">Attention required</p>
        </div>
        <DataTable
          rows={mockStockAlerts}
          columns={[
            { key: 'name', header: 'Medicine', render: (row) => row.name },
            { key: 'stock', header: 'Stock', render: (row) => `${row.stock} / reorder ${row.reorderLevel}` },
            { key: 'expiry', header: 'Expiry', render: (row) => row.expiry },
            { key: 'risk', header: 'Risk', render: (row) => <StatusBadge status={row.risk} /> },
            {
              key: 'action',
              header: 'Action',
              render: (row) => {
                if (row.risk === 'healthy') return '-';
                const poNumber = purchaseOrders[row.id];
                return poNumber ? (
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status="issued" />
                    <span className="text-xs font-semibold text-slate-500">{poNumber}</span>
                  </div>
                ) : (
                  <Button onClick={() => createPurchaseOrder(row)}>Create PO</Button>
                );
              }
            }
          ]}
        />
      </Card>
    </div>
  );
}
