'use client'; 
import MyInternships from "@/components/myInternships";
import { mockInternships } from '../../../../../../constants/index';

export default function InternshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MyInternships internships={mockInternships} />
    </div>
  );
}
