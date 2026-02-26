import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { AuthProvider } from '../../contexts/AuthContext';

// wrap router and auth context since Header uses both
const renderHeader = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </BrowserRouter>
  );

test('renders app title and nav links', () => {
  renderHeader();
  expect(screen.getByText(/RecipeHub/i)).toBeInTheDocument();
  expect(screen.getByText(/Browse/i)).toBeInTheDocument();
  expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
  expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
});
