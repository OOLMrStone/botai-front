'use client';

import { useRef } from 'react';
import type { RefObject } from 'react';

import { layout } from '@/config/layout';
import type { LemurAnimation } from '@/config/lemur-media';
import { useGestureSurfaceGuard } from '@/hooks/use-gesture-surface-guard';
import { preventGestureContextMenu } from '@/lib/gesture-surface';
import { cn } from '@/lib/utils';

interface LemurVideoProps {
  animation: LemurAnimation;
  firstRef: RefObject<HTMLVideoElement | null>;
  secondRef: RefObject<HTMLVideoElement | null>;
  activeSlot: number;
  reactionBusy: boolean;
  onReact: () => void;
  error: string;
  className?: string;
}

export function LemurVideo({
  animation,
  firstRef,
  secondRef,
  activeSlot,
  reactionBusy,
  onReact,
  error,
  className,
}: LemurVideoProps) {
  const reactionRef = useRef<HTMLButtonElement>(null);
  useGestureSurfaceGuard(reactionRef, { enabled: Boolean(animation.reaction) });

  return (
    <div
      className={cn(
        layout.lemurPreview.player,
        animation.square && layout.lemurPreview.squarePlayer,
        className,
      )}
    >
      <div
        className={cn(
          layout.lemurPreview.surface,
          animation.square && layout.lemurPreview.squareSurface,
        )}
      >
        <LemurVideoLayer animation={animation} videoRef={firstRef} active={activeSlot === 0} />
        <LemurVideoLayer animation={animation} videoRef={secondRef} active={activeSlot === 1} />
        {animation.reaction ? (
          <button
            ref={reactionRef}
            type="button"
            className={cn(layout.lemurPreview.reaction, layout.gestureSurface)}
            onClick={onReact}
            onContextMenu={preventGestureContextMenu}
            aria-label={animation.reaction.label}
            aria-disabled={reactionBusy}
          />
        ) : null}
      </div>
      {error ? (
        <p className={layout.lemurPreview.mediaError} role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function LemurVideoLayer({
  animation,
  videoRef,
  active,
}: {
  animation: LemurAnimation;
  videoRef: RefObject<HTMLVideoElement | null>;
  active: boolean;
}) {
  return (
    <video
      ref={videoRef}
      poster={animation.poster}
      className={cn(
        layout.lemurPreview.video,
        layout.lemurPreview.videoLayer,
        !active && layout.lemurPreview.inactiveVideo,
      )}
      aria-label={animation.label}
      aria-hidden={!active}
      muted
      playsInline
      preload="auto"
    />
  );
}
