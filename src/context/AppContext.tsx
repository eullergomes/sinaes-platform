"use client";

import { createContext, useContext } from 'react';
import { UserRole } from '@prisma/client';

export type AppContextValue = {
  userId?: string;
  role?: UserRole | string;
  isAdmin: boolean;
  currentCourseId?: string | null;
  courseCoordinatorId?: string | null;
  courseInfoLoading?: boolean;
  sessionPending?: boolean;
};

const defaultValue: AppContextValue = {
  isAdmin: false,
  currentCourseId: null,
  courseCoordinatorId: null,
  courseInfoLoading: false,
  sessionPending: false
};

export const AppContext = createContext<AppContextValue>(defaultValue);
export const useAppContext = () => useContext(AppContext);
