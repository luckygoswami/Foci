export function TimerButton({
  text,
  clickHandler,
}: {
  text: string;
  clickHandler: () => void;
}) {
  return (
    <button
      className="w-52 h-10 bg-card text-foreground rounded-lg text-lg font-semibold"
      onClick={clickHandler}>
      {text}
    </button>
  );
}
