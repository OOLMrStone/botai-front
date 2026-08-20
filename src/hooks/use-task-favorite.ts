'use client';

import { useState } from 'react';

import { saveFavoriteTask } from '@/lib/api/tasks';
import { useTasksStore } from '@/stores/tasks-store';

export function useTaskFavorite(taskId: string) {
  const favorite = useTasksStore((state) => state.favorites.includes(taskId));
  const toggleLocal = useTasksStore((state) => state.toggleFavorite);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    if (saving) return;
    setSaving(true);
    toggleLocal(taskId);
    try {
      await saveFavoriteTask(taskId, !favorite);
    } catch {
      toggleLocal(taskId);
    } finally {
      setSaving(false);
    }
  };

  return { favorite, saving, toggle };
}
