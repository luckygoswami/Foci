import AuthGuard from '@/components/AuthGuard';
import { isValidElement } from 'react';
import { type RouteObject } from 'react-router-dom';

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
      wrappedRoute.element = <AuthGuard>{route.element}</AuthGuard>;
    }

    if (route.children) {
      wrappedRoute.children = wrapWithAuthGuard(route.children);
    }

    return wrappedRoute;
  });
}
