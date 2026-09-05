import { Bookmark, Eraser, Pencil } from 'lucide-react';

import { TaskBlockRenderer } from '@/components/tasks/TaskBlockRenderer';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { TASK_COPY, type TaskStatus, type TrainingTask } from '@/config/tasks';
import { useDrawingWorkspace } from '@/hooks/use-drawing-workspace';
import { useGestureSurfaceGuard } from '@/hooks/use-gesture-surface-guard';
import { useTaskFavorite } from '@/hooks/use-task-favorite';
import { useTaskDrawing } from '@/hooks/use-task-drawing';
import { useEraserMenu } from '@/hooks/use-eraser-menu';
import { cn } from '@/lib/utils';
import { preventGestureContextMenu } from '@/lib/gesture-surface';

import type { PointerEvent as ReactPointerEvent } from 'react';

interface TrainingTaskCardProps {
  task: TrainingTask;
  favoriteTaskId?: string;
  position: number;
  status: TaskStatus;
  solvedDate?: string;
  solutionRevealed: boolean;
  onToggleSolution: () => void;
}

export function TrainingTaskCard({
  task,
  favoriteTaskId,
  position,
  status,
  solvedDate,
  solutionRevealed,
  onToggleSolution,
}: TrainingTaskCardProps) {
  const favorite = useTaskFavorite(favoriteTaskId ?? task.id);
  const {
    viewportRef: workspaceViewportRef,
    contentRef: workspaceContentRef,
    height: workspaceHeight,
    ensureWritingSpace,
    scrollAtWritingEdge,
    panWorkspaceBy,
  } = useDrawingWorkspace(task.id);
  const drawing = useTaskDrawing(task.id, ensureWritingSpace, scrollAtWritingEdge, panWorkspaceBy);
  const { canvasRef, tool, start, move, end, cancel } = drawing;
  const {
    open: eraserMenuOpen,
    selecting: eraserSelecting,
    rootRef: eraserMenuRef,
    triggerRef: eraserTriggerRef,
    strokeOptionRef,
    pointOptionRef,
    toggle: toggleEraserMenu,
    select: selectEraser,
    navigate: navigateEraserMenu,
    close: closeEraserMenu,
  } = useEraserMenu({
    tool,
    selectEraser: drawing.selectEraser,
    disableEraser: drawing.disableEraser,
  });
  const eraserLabel =
    tool === 'point-eraser' ? TASK_COPY.training.pointEraser : TASK_COPY.training.strokeEraser;
  const drawingToolActive = tool !== 'off';
  useGestureSurfaceGuard(canvasRef, {
    enabled: drawingToolActive,
    preventTouchDefaults: true,
  });
  const handlePencil = () => {
    closeEraserMenu();
    drawing.togglePencil();
  };
  const handleDrawingStart = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    start(event);
    if (tool === 'stroke-eraser' || tool === 'point-eraser') closeEraserMenu();
  };

  return (
    <article
      className={cn(layout.training.taskCard, drawingToolActive && layout.gestureSurface)}
      onContextMenu={drawingToolActive ? preventGestureContextMenu : undefined}
    >
      <div className={layout.training.cardHeader}>
        <div className={layout.training.titleGroup}>
          <h2 className={layout.training.cardTitle}>
            {TASK_COPY.training.task} {position}
            {task.difficulty === 'hard' ? (
              <span aria-hidden="true" className={layout.training.difficultyIcon} />
            ) : null}
          </h2>
          {solvedDate ? (
            <p className={layout.training.solvedMeta}>{TASK_COPY.training.solved(solvedDate)}</p>
          ) : null}
        </div>
        <div className={layout.training.actions}>
          <Button
            variant="ghost"
            size="icon"
            className={layout.training.actionButton}
            aria-label={TASK_COPY.training.favorite}
            disabled={favorite.saving}
            onClick={() => void favorite.toggle()}
          >
            <Bookmark
              className={cn(layout.training.actionIcon, favorite.favorite && 'fill-current')}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              layout.training.actionButton,
              tool === 'pencil' && layout.training.actionButtonActive,
            )}
            aria-label={TASK_COPY.training.pencil}
            aria-pressed={tool === 'pencil'}
            onClick={handlePencil}
          >
            <Pencil className={layout.training.actionIcon} />
          </Button>
          <div ref={eraserMenuRef} className={layout.training.eraserControl}>
            <Button
              ref={eraserTriggerRef}
              variant="ghost"
              size="icon"
              className={cn(
                layout.training.actionButton,
                tool.includes('eraser') && layout.training.actionButtonActive,
              )}
              aria-label={eraserLabel}
              aria-pressed={tool.includes('eraser')}
              aria-expanded={eraserMenuOpen}
              aria-controls="training-eraser-menu"
              aria-haspopup="menu"
              onClick={toggleEraserMenu}
            >
              <span className={cn(eraserSelecting && layout.training.eraserTriggerIconHidden)}>
                {tool === 'point-eraser' ? (
                  <span aria-hidden="true" className={layout.training.pointEraserIcon} />
                ) : (
                  <Eraser className={layout.training.actionIcon} />
                )}
              </span>
            </Button>
            {eraserMenuOpen ? (
              <div
                id="training-eraser-menu"
                role="menu"
                aria-label={TASK_COPY.training.eraserModes}
                className={layout.training.eraserMenu}
                onKeyDown={navigateEraserMenu}
              >
                <Button
                  ref={strokeOptionRef}
                  variant="ghost"
                  size="icon"
                  role="menuitemradio"
                  aria-label={TASK_COPY.training.strokeEraser}
                  aria-checked={tool === 'stroke-eraser'}
                  className={cn(
                    layout.training.eraserOption,
                    tool === 'stroke-eraser' && layout.training.eraserOptionActive,
                  )}
                  onClick={() => void selectEraser('stroke-eraser')}
                >
                  <Eraser className={layout.training.actionIcon} />
                </Button>
                <Button
                  ref={pointOptionRef}
                  variant="ghost"
                  size="icon"
                  role="menuitemradio"
                  aria-label={TASK_COPY.training.pointEraser}
                  aria-checked={tool === 'point-eraser'}
                  className={cn(
                    layout.training.eraserOption,
                    tool === 'point-eraser' && layout.training.eraserOptionActive,
                  )}
                  onClick={() => void selectEraser('point-eraser')}
                >
                  <span aria-hidden="true" className={layout.training.pointEraserIcon} />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        ref={workspaceViewportRef}
        role="region"
        tabIndex={0}
        aria-label={TASK_COPY.training.workspace}
        className={cn(
          layout.training.drawingViewport,
          layout.focusRing,
          drawingToolActive && layout.gestureSurface,
        )}
      >
        <div
          className={layout.training.drawingDocument}
          style={workspaceHeight ? { height: workspaceHeight } : undefined}
        >
          <div ref={workspaceContentRef} className={layout.training.drawingContent}>
            <TaskBlockRenderer blocks={task.content} />
            {status !== 'unverified' && task.solution.length > 0 ? (
              <Button
                variant="ghost"
                className={layout.training.solutionButton}
                onClick={onToggleSolution}
              >
                {solutionRevealed ? TASK_COPY.training.hideSolution : TASK_COPY.training.solution}
              </Button>
            ) : null}
            {solutionRevealed ? (
              <div className={layout.training.solution}>
                <TaskBlockRenderer blocks={task.solution} />
              </div>
            ) : null}
          </div>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            onPointerDown={handleDrawingStart}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={cancel}
            onLostPointerCapture={cancel}
            onContextMenu={preventGestureContextMenu}
            className={cn(
              layout.training.drawingCanvas,
              layout.gestureSurface,
              tool === 'off'
                ? layout.training.drawingCanvasIdle
                : layout.training.drawingCanvasActive,
            )}
          />
        </div>
      </div>
    </article>
  );
}
