import StudentList from '@/components/StudentList';
import { mockStudents } from '../../../../../../constants/mockData';

export default function StudentsPage() {
  return (
    <main className="container mx-auto">
      <StudentList students={mockStudents} />
    </main>
  );
}