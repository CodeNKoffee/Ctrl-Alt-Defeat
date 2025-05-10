// View a list of suggested companies based on my job interests, industry and recommendations from past interns

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import InternshipList from '@/components/shared/InternshipList';
import { getRecommendedInternshipsForStudent } from '../../../../../constants/internshipData';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [personalizedInternships, setPersonalizedInternships] = useState([]);
  const { currentUser, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Try to get user from Redux first
    if (isAuthenticated && currentUser) {
      // Get personalized internship recommendations for this student
      const recommendations = getRecommendedInternshipsForStudent(currentUser);
      setPersonalizedInternships(recommendations);
      return;
    }

    // Fallback to session/local storage if Redux state is not yet set
    const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');

    if (!userSessionData) {
      router.push('/en/auth/login?userType=student');
      return;
    }

    // Parse user data
    const userData = JSON.parse(userSessionData);

    // Verify user role
    if (userData.role !== 'student') {
      router.push('/en');
      return;
    }

    // If we have user data in session but not in Redux, dispatch login action to sync them
    if (!isAuthenticated) {
      dispatch({
        type: 'LOGIN',
        payload: {
          email: userData.email,
          password: userData.password
        }
      });
    }

    // Get personalized internship recommendations for this student
    const recommendations = getRecommendedInternshipsForStudent(userData);
    setPersonalizedInternships(recommendations);
  }, [currentUser, isAuthenticated, router, dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <InternshipList
        title="RECOMMENDED OPPORTUNITIES"
        internships={personalizedInternships}
        type="regular"
      />
    </div>
  );
}
