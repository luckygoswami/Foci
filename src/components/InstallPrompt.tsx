import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { InstallPromptModal } from './InstallPromptModal';

export function InstallPrompt() {
  const { isAppInstalled, isModalOpen, triggerInstallPrompt, closeModal } =
    useInstallPrompt();

  if (isAppInstalled) {
    return null;
  }

  return (
    <InstallPromptModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onInstall={triggerInstallPrompt}
    />
  );
}
