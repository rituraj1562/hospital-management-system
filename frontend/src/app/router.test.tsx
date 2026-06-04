import { describe, expect, it } from 'vitest';
import { router } from './router';

describe('router', () => {
  it('defines auth and protected HMS roots', () => {
    const paths = router.routes.map((route) => route.path);
    expect(paths).toContain('/login');
    expect(paths).toContain('/register');
    expect(paths).toContain('/');
  });
});
