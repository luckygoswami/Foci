import { useState } from 'react';
import {
  isUsernameAvailable,
  isValidUsername,
  sanitiseUsername,
} from '../services/onboarding';
import type { OnboardingState } from '../types';

const statusTypes = {
  available: {
    message: 'Username is available.',
    color: 'text-green-600',
  },
  unavailable: {
    message: 'Username is already taken.',
    color: 'text-red-600',
  },
  invalid: {
    message:
      'Username must be 3-20 chars, start with a letter, and use letters/numbers/underscore only.',
    color: 'text-slate-500',
  },
};

export function StepBasics({
  form,
  setForm,
}: {
  form: OnboardingState;
  setForm: React.Dispatch<React.SetStateAction<OnboardingState>>;
}) {
  const { username, name, bio } = form;
  const [usernameStatus, setUsernameStatus] = useState<
    'available' | 'unavailable' | 'invalid' | null
  >(null);
  const status = statusTypes[usernameStatus!] ?? null;

  async function handleCheck(): Promise<void> {
    if (!isValidUsername(username)) {
      setUsernameStatus('invalid');
      return;
    }

    const res = await isUsernameAvailable(username);
    setUsernameStatus(res ? 'available' : 'unavailable');
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setUsernameStatus(null);
    const clean = sanitiseUsername(e.target.value);

    // Validate: must start with a letter and be 3–20 chars long
    const isValid = isValidUsername(clean);

    setForm((f) => ({
      ...f,
      username: clean,
    }));

    if (!isValid && clean.length > 0) {
      setUsernameStatus('invalid');
    } else {
      setUsernameStatus(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label
          htmlFor="username-input"
          className="text-sm font-medium">
          Username
        </label>
        <div className="mt-1 flex gap-2">
          <input
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="username-input"
            required
            value={username}
            onChange={handleOnChange}
            placeholder="e.g. alex_r"
            maxLength={20}
            autoCapitalize="none"
            spellCheck={false}
            autoCorrect="off"
          />

          <button
            type="button"
            onClick={handleCheck}
            disabled={username.trim().length < 3 || !!usernameStatus}
            className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50">
            Check
          </button>
        </div>
        {status && (
          <p className={`mt-2 text-xs ${status.color}`}>{status.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="name-input"
          className="text-sm font-medium">
          Name
        </label>
        <input
          id="name-input"
          className="mt-1 w-full rounded border px-3 py-2"
          value={name}
          autoCapitalize="words"
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Full name"
        />
      </div>

      <div>
        <label
          htmlFor="bio-input"
          className="text-sm font-medium">
          Bio (optional)
        </label>
        <textarea
          id="bio-input"
          className="mt-1 w-full rounded border px-3 py-2"
          value={bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          placeholder="Tell others about yourself"
          rows={3}
        />
      </div>
    </div>
  );
}
