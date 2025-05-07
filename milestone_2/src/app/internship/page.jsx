'use client'; 
import InternshipTable from '@/components/InternshipTable';
import { mockInternships } from '../../../constants';

export default function InternshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <InternshipTable internships={mockInternships} />
    </div>
  );
}
