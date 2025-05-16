'use client';
import { Provider } from 'react-redux';
import { store } from '@/store'; // adjust path as needed
import { useEffect } from 'react';
import { SET_CURRENT_USER } from '@/store/authReducer';

export default function ReduxProvider({ children }) {
  useEffect(() => {
    // Load user data from session storage on app initialization
    if (typeof window !== 'undefined') {
      const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');

      if (userSessionData) {
        try {
          const userData = JSON.parse(userSessionData);
          // Set user data in Redux store
          store.dispatch({
            type: SET_CURRENT_USER,
            payload: userData
          });
        } catch (e) {
          console.error('Error parsing user session data', e);
        }
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}