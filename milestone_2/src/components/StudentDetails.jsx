import './styles/StudentProfile.css';

export default function StudentDetails({ isOpen }) {
  return (
    <div className={`student-details ${isOpen ? 'expanded' : ''}`}>
    
    </div>
  );
}