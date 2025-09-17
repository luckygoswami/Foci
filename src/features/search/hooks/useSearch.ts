import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { db } from '@/lib/firebase-config';
import type { ResultsForType, SearchTypes } from '../types';
import toast from 'react-hot-toast';

export function useSearch<T extends SearchTypes>(term: string, searchFor: T) {
  const [results, setResults] = useState<ResultsForType<T>>(
    null as ResultsForType<T>
  );
  const [loading, setLoading] = useState(false);

  const userQuery = query(
    collection(db, 'users'),
    where('username', '>=', term.toLowerCase()),
    where('username', '<=', term.toLowerCase() + '\uf8ff')
  );

  const groupQuery = query(
    collection(db, 'groups'),
    where('name_lower', '>=', term.toLowerCase()),
    where('name_lower', '<=', term.toLowerCase() + '\uf8ff')
  );

  const variants = {
    users: { searchQuery: userQuery },
    groups: { searchQuery: groupQuery },
  };
  const { searchQuery } = variants[searchFor];

  useEffect(() => {
    if (!term) {
      setResults(null as ResultsForType<T>);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const snapshots = await getDocs(searchQuery);
        setResults(
          snapshots.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ResultsForType<T>
        );
      } catch {
        toast.error('Unable to search.');
      } finally {
        setLoading(false);
      }
    };

    const debounced = debounce(fetch, 300);
    debounced();
    return () => debounced.cancel();
  }, [term, searchFor, searchQuery]);

  return { results, loading };
}
