import { MOCK_USERS } from "../../constants/mockData";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      // Find user in mock data
      const user = MOCK_USERS.students.find(
        (u) => u.email === action.payload.email && u.password === action.payload.password
      );
      if (user) {
        return { ...state, currentUser: user, isAuthenticated: true, error: null };
      } else {
        return { ...state, currentUser: null, isAuthenticated: false, error: 'Invalid credentials' };
      }
    case 'LOGOUT':
      return { ...state, currentUser: null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};