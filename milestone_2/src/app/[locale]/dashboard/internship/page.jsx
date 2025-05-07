'use client'; 
<<<<<<< HEAD:milestone_2/src/app/internship/page.jsx
import InternshipTable from '@/components/InternshipTable';
import { mockInternships } from '../../../constants';
=======
import InternshipTable from "@/components/InternshipTable";
import { mockInternships } from "@/components/InternshipTable";
>>>>>>> 368e90bfd1a08332f1c71bee4485cb1b09a4e30f:milestone_2/src/app/[locale]/dashboard/internship/page.jsx

export default function InternshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <InternshipTable internships={mockInternships} />
    </div>
  );
}
