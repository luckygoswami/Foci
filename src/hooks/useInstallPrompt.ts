import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PROMPT_SHOWN_SESSION_KEY = 'installPromptShown';

export function useInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    event.preventDefault();
    const promptShown = sessionStorage.getItem(PROMPT_SHOWN_SESSION_KEY);
    if (!promptShown) {
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
      setIsModalOpen(true);
      sessionStorage.setItem(PROMPT_SHOWN_SESSION_KEY, 'true');
    }
  }, []);

  const handleAppInstalled = useCallback(() => {
    setIsAppInstalled(true);
    setInstallPromptEvent(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [handleBeforeInstallPrompt, handleAppInstalled]);

  const triggerInstallPrompt = async () => {
    if (installPromptEvent) {
      setIsModalOpen(false);
      await installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;
      if (outcome === 'accepted') {
        handleAppInstalled();
      }
      setInstallPromptEvent(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return { isAppInstalled, isModalOpen, triggerInstallPrompt, closeModal };
}
