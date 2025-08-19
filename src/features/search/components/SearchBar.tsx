import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import ResultsDropdown from './ResultsDropdown';

export function SearchBar({ targetType }: { targetType: 'groups' | 'users' }) {
  const [search, setSearch] = useState('');
  const { results } = useSearch(search, targetType);
  const [isOpen, setIsOpen] = useState(false);

  function toggleSearch() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative w-full">
      {/* Search bar wrapper */}
      <div className="flex items-center w-full">
        <motion.div
          initial={false}
          animate={{
            width: isOpen ? '100%' : '44px',
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={!isOpen ? toggleSearch : undefined}
          className="relative z-6 flex items-center bg-white shadow-md border border-gray-300 overflow-hidden h-11 rounded-full cursor-pointer">
          {/* Left icon (always visible) */}
          <Search className="size-5 ml-3 text-gray-600 flex-shrink-0" />

          {/* Input fades in when expanded */}
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.input
                  key="input"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search by ${
                    targetType == 'users' ? 'Username' : 'Group name'
                  }...`}
                  autoFocus
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 flex-1 bg-transparent outline-none text-sm"
                />
              </>
            )}
          </AnimatePresence>

          {/* Close button */}
          {isOpen && (
            <button
              onClick={toggleSearch}
              className="mr-2 rounded-full p-1 hover:bg-gray-200 transition-colors">
              <X className="size-5 text-gray-600" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Results */}
      <ResultsDropdown
        results={results}
        isOpen={isOpen}
        resultsFor={targetType}
      />

      {/* Backdrop overlay (below the search bar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-5 backdrop-blur-sm bg-black/2"
            onClick={toggleSearch}></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
