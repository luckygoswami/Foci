import { APP_NAME } from '@/constants/app';
import meta from '@/../package.json';

export function Header({ title = APP_NAME }: { title?: string }) {
  return (
    <h1
      title={`v${meta.version}`}
      className="w-full border-b-2 border-border/50 p-2 text-xl font-semibold text-foreground text-center">
      {title}
    </h1>
  );
}
