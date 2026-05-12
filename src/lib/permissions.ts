import type { UserRole } from '@prisma/client';

/**
 * Role predicate helpers
 */
export function isAdmin(role?: UserRole | string | null): boolean {
  return role === 'ADMIN';
}

export function isDirector(role?: UserRole | string | null): boolean {
  return role === 'DIRECTOR';
}

export function isCoordinator(role?: UserRole | string | null): boolean {
  return role === 'COORDINATOR';
}

export function isVisitor(role?: UserRole | string | null): boolean {
  return role === 'VISITOR';
}

/**
 * Course-level permissions
 */
export function canUpdateCourse(role?: UserRole | string | null): boolean {
  // Directors and Admins can edit course metadata
  return isAdmin(role) || isDirector(role);
}

export function canDeleteCourse(role?: UserRole | string | null): boolean {
  // Only Admins can delete courses
  return isAdmin(role);
}

/**
 * Returns true if user can see grade badges (Dimension/Course average).
 * Rules:
 * - VISITOR (or not logged in): false
 * - ADMIN/DIRECTOR/COORDINATOR: true
 */
export function canViewGradeBadge(role?: UserRole | string | null): boolean {
  return !isVisitor(role);
}

/**
 * Returns true if the user can edit Other Documents URL for the course.
 * Rules: ADMIN always; COORDINATOR only for their own course.
 */
export function canEditOtherDocuments(params: {
  role?: UserRole | string | null;
  userId?: string | null;
  courseCoordinatorId?: string | null | undefined;
}): boolean {
  return canEditIndicator(params);
}

/**
 * Returns true if the user can edit indicator data for a course.
 * Rules:
 * - ADMIN: always true
 * - COORDINATOR: true only when userId === courseCoordinatorId
 * - DIRECTOR/VISITOR: false
 */
export function canEditIndicator(params: {
  role?: UserRole | string | null;
  userId?: string | null;
  courseCoordinatorId?: string | null | undefined;
}): boolean {
  const { role, userId, courseCoordinatorId } = params;
  if (isAdmin(role)) return true;
  if (isCoordinator(role))
    return Boolean(
      userId && courseCoordinatorId && userId === courseCoordinatorId
    );
  return false;
}

/**
 * Returns true if the user can create a cycle for the course.
 * Mirrors canEditIndicator logic.
 */
export function canCreateCycle(params: {
  role?: UserRole | string | null;
  userId?: string | null;
  courseCoordinatorId?: string | null | undefined;
}): boolean {
  return canEditIndicator(params);
}

/**
 * Returns true if the user can view PendingAlerts for the course.
 * Rules:
 * - ADMIN: always true
 * - COORDINATOR: only for their own course (userId === courseCoordinatorId)
 * - DIRECTOR/VISITOR: false
 */
export function canViewPendingAlerts(params: {
  role?: UserRole | string | null;
  userId?: string | null;
  courseCoordinatorId?: string | null | undefined;
}): boolean {
  const { role, userId, courseCoordinatorId } = params;
  if (isAdmin(role)) return true;
  if (isCoordinator(role))
    return Boolean(
      userId && courseCoordinatorId && userId === courseCoordinatorId
    );
  return false;
}

/**
 * Convenience helper: compute read-only state for indicator pages.
 * True when the user cannot edit indicator data.
 */
export function isReadOnlyIndicator(params: {
  role?: UserRole | string | null;
  userId?: string | null;
  courseCoordinatorId?: string | null | undefined;
}): boolean {
  return !canEditIndicator(params);
}

/**
 * Returns true if user can toggle NSA applicability for indicators in the current course.
 * Same logic as editing indicators (ADMIN global, COORDINATOR only own course).
 */
export function canToggleNsaIndicator(params: {
  role?: UserRole | string | null;
  userId?: string | null;
  courseCoordinatorId?: string | null | undefined;
}): boolean {
  return canEditIndicator(params);
}
