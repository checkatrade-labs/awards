'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckatradeTradeSearchResult } from '@/types/nomination';
import { checkatradeService } from '@/services/checkatradeService';
import { Search, Loader } from 'lucide-react';

interface TradeSearchProps {
  onSelect: (trade: CheckatradeTradeSearchResult) => void;
}

export default function TradeSearch({ onSelect }: TradeSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CheckatradeTradeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchTrades = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await checkatradeService.searchTrades(searchTerm);
        setResults(response.options);
      } catch (err) {
        console.error('Error searching trades:', err);
        setError('Failed to search trades. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchTrades, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleSelect = (trade: CheckatradeTradeSearchResult) => {
    onSelect(trade);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <label
        htmlFor="trade-search"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Search for a Checkatrade Member
      </label>
      <div className="relative">
        <input
          id="trade-search"
          type="text"
          placeholder="Enter trade name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          autoComplete="off"
        />
        <div className="absolute right-3 top-3">
          {loading ? (
            <Loader className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
          <ul>
            {results.map((trade) => (
              <li
                key={trade.companyId}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                onClick={() => handleSelect(trade)}
              >
                <div className="flex items-center gap-3">
                  {trade.logoUrl ? (
                    <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
                      <Image 
                        src={trade.logoUrl} 
                        alt={`${trade.name} logo`}
                        width={40}
                        height={40}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        className="rounded-md border border-gray-200"
                        onError={() => {
                          // We'll handle errors with the fallback div
                          return false;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs font-medium">Logo</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{trade.name}</div>
                    <div className="text-sm text-gray-600">{trade.location}</div>
                    {trade.skills && trade.skills.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {trade.skills.slice(0, 3).join(', ')}
                        {trade.skills.length > 3 && '...'}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && searchTerm.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-3 text-center">
          <p className="text-sm text-gray-600">No results found</p>
          <p className="text-xs text-gray-500 mt-1">
            You can still nominate a trade that is not on Checkatrade
          </p>
        </div>
      )}
    </div>
  );
}
