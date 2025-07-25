import React from 'react';
import type { GroupAvatarPickerProps } from '../types';

const GroupAvatarPicker: React.FC<GroupAvatarPickerProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <div className="text-sm font-medium mb-1">Group Avatar</div>
      <div className="flex flex-wrap gap-4 max-h-40 overflow-y-auto p-2">
        {options.map(({ id, icon: Icon, color, label }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            className={`
            flex items-center justify-center w-12 h-12 rounded-full border-2
            transition
            ${
              value === id
                ? 'border-primary bg-primary/10 ring-2 ring-primary'
                : 'border-gray-200 bg-white hover:border-primary'
            }
          `}
            onClick={() => onChange(id)}>
            <Icon
              className={`size-7 ${color}`}
              strokeWidth={2.1}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupAvatarPicker;
