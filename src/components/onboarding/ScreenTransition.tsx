// Анимация входа экрана. Единая точка правды для перехода между экранами.
export function ScreenTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-1 flex-col duration-300 ease-out">
      {children}
    </div>
  );
}
