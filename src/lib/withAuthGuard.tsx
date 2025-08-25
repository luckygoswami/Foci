import { AuthGuard } from '@/features/auth';
import AppLayout from '@/components/layouts/AppLayout';
import { isValidElement } from 'react';
import { type RouteObject } from 'react-router-dom';
import { OnboardingGate } from '@/features/onboarding';

type MetaRouteObject = RouteObject & {
  meta?: {
    requiresAuth?: boolean;
  };
  children?: MetaRouteObject[];
};

export function wrapWithAuthGuard(
  routes: MetaRouteObject[]
): MetaRouteObject[] {
  return routes.map((route) => {
    const wrappedRoute = { ...route };

    if (
      route.meta?.requiresAuth &&
      route.element &&
      isValidElement(route.element)
    ) {
      wrappedRoute.element = (
        <AuthGuard>
          <OnboardingGate>
            <AppLayout children={route.element} />
          </OnboardingGate>
        </AuthGuard>
      );
    }

    if (route.children) {
      wrappedRoute.children = wrapWithAuthGuard(route.children);
    }

    return wrappedRoute;
  });
}
