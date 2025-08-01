import StudentList from '@/components/StudentList';
import { mockStudents } from '../../../../../../constants/mockData';

export default function StudentsPage() {
  return (
    <main className="container mx-auto bg-white min-h-screen">
      <StudentList students={mockStudents} />
    </main>
  );
}