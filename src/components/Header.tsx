import { APP_NAME } from '@/constants/app';

export function Header({ title = APP_NAME }: { title?: string }) {
  return (
    <h1 className="w-full border-b-2 border-border/50 p-2 text-xl font-semibold text-foreground text-center">
      {title}
    </h1>
  );
}
