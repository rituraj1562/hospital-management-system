import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { demoUsers } from '../../services/mockData';
import { switchDemoRole } from '../auth/authSlice';
import type { User } from '../../types';

export function DemoRoleSwitcherPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function switchRole(user: User) {
    dispatch(switchDemoRole(user));
    navigate('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demo Role Switcher</h1>
        <p className="text-sm text-slate-500">Instantly preview each hospital workflow without logging out.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoUsers.map((user) => (
          <Card key={user.id}>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="mt-1 text-sm capitalize text-slate-500">{user.role.split('_').join(' ')}</p>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            <Button className="mt-4 w-full" onClick={() => switchRole(user as User)}>Use this role</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
