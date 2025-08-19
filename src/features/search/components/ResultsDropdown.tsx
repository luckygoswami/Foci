import { motion, AnimatePresence } from 'framer-motion';
import type {
  IGroupResult,
  IUserResult,
  ResultsForType,
  SearchTypes,
} from '../types';
import UserResult from './UserResult';
import GroupResult from './GroupResult';

type ResultsDropdownProps<T extends SearchTypes> = {
  resultsFor: T;
  results: ResultsForType<T>;
  isOpen: boolean;
};

export default function ResultsDropdown<T extends SearchTypes>({
  results,
  isOpen,
  resultsFor,
}: ResultsDropdownProps<T>) {
  if (!isOpen || !results) return null;

  return (
    <AnimatePresence>
      {
        <motion.ul
          key="results-dropdown"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="absolute flex flex-col top-12 left-0 w-full overflow-y-auto max-h-60 divide-y divide-gray-200 shadow-lg bg-white rounded-xl z-40">
          {!results.length ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="py-6 text-center text-gray-400">
              <svg
                className="h-10 w-10 mx-auto mb-2 text-blue-100"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              No {`${resultsFor}`} found.
            </motion.div>
          ) : resultsFor == 'users' ? (
            (results as IUserResult[]).map((user) => (
              <UserResult
                key={user.id}
                user={user}
              />
            ))
          ) : (
            (results as IGroupResult[]).map((group) => (
              <GroupResult
                key={group.id}
                group={group}
              />
            ))
          )}
        </motion.ul>
      }
    </AnimatePresence>
  );
}
