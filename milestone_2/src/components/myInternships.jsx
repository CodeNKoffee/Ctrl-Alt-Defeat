"use client";
import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import CardTable from './CardTable';
import DatePicker from './DatePicker';
import InternshipRow from './InternshipRow';
import { mockInternships } from '../../constants/index';

export default function MyInternships() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);

  const filterFunction = (internship) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      internship.title.toLowerCase().includes(searchLower) ||
      internship.company.toLowerCase().includes(searchLower);
  
    const matchesStatus =
      activeTab === 'all' || 
      internship.status?.toLowerCase() === activeTab;
  
    // Exact date match comparison
    const matchesDate = !selectedDate || (
    internship.startDate && 
    new Date(internship.startDate).toDateString() === new Date(selectedDate).toDateString()
  );

  
    return matchesSearch && matchesStatus && matchesDate;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl px-4">
        {/* First CardTable - for title and search */}
        <CardTable
          title="MY INTERNSHIPS"
          data={[]}
          filterFunction={() => true}
          searchConfig={{
            searchTerm: searchTerm,
            onSearchChange: setSearchTerm,
            placeholder: 'Search by job title or company...',
          }}
          filterConfig={{
            showFilter: false,
          }}
          emptyMessage=""
          renderCard={() => null}
        />

        {/* Status Tabs and DatePicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {['all', 'current', 'completed', 'evaluated'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    activeTab === tab
                      ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div>
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>

        {/* Second CardTable - for cards only */}
        <CardTable
          data={mockInternships}
          filterFunction={filterFunction}
          emptyMessage="No internships found matching your criteria."
          searchConfig={{
            searchTerm: searchTerm,
            onSearchChange: setSearchTerm,
            placeholder: '',
            hideSearchBar: true, // Add this prop to CardTable component
          }}
          renderContainer={({ children }) => (
            <Accordion.Root type="single" collapsible className="space-y-3">
              {children}
            </Accordion.Root>
          )}
          renderCard={(internship) => (
            <Accordion.Item key={internship.id} value={internship.id}>
              <InternshipRow internship={internship} />
            </Accordion.Item>
          )}
        />
      </div>
    </div>
  );
}