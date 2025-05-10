import { Loader2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/60 text-primary">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default LoadingScreen;
