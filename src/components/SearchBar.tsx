import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

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
          onClick={!isOpen ? toggleSearch : undefined} // make circle clickable
          className="relative z-5 flex items-center bg-white shadow-md border border-gray-300 overflow-hidden h-11 rounded-full cursor-pointer">
          {/* Left icon (always visible) */}
          <Search className="size-5 ml-3 text-gray-600 flex-shrink-0" />

          {/* Input fades in when expanded */}
          <AnimatePresence>
            {isOpen && (
              <motion.input
                key="input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-2 flex-1 bg-transparent outline-none text-sm"
              />
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

      {/* Backdrop overlay (below the search bar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-4 backdrop-blur-sm bg-white/10"
            onClick={toggleSearch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
