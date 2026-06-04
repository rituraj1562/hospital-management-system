# Feature Matrix by Role

| Feature | Super Admin | Hospital Admin | Doctor | Receptionist | Pharmacist | Lab Tech | Patient |
| --- | --- | --- | --- | --- | --- | --- | --- |
| User approvals | Yes | Yes | No | No | No | No | No |
| Patients | Full | Full | Read | Create/update | Read | Read | Own profile |
| Doctors | Full | Full | Own profile | Read | Read | Read | Read |
| Appointments | Full | Full | Workflow | Book/check-in | Read | Read | Own |
| EMR | Full | Full | Create/update | No | Prescription read | Lab docs | Own |
| Lab reports | Full | Full | Read/request | No | No | Workflow | Own |
| Pharmacy | Full | Full | Read | No | Workflow | No | Prescription history |
| Inpatient | Full | Full | Read | Admit/discharge ops | No | No | Own |
| Billing | Full | Full | Revenue overview | Issue/payments | Pharmacy charges | No | Own |

## Demo Credentials

All seeded demo accounts use:

```text
Admin@12345
```

- `admin@demo-hms.local`
- `doctor@demo-hms.local`
- `reception@demo-hms.local`
- `pharmacy@demo-hms.local`
- `lab@demo-hms.local`
