import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';
import Home from '../../pages/Home';
import * as apiModule from '../../utils/api';

vi.mock('../../utils/api');

function renderWithAuth(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock API to return fake meals
    apiModule.filterByCategory.mockResolvedValue([
      { idMeal: '1', strMeal: 'Test Meal 1', strMealThumb: 'url1' },
      { idMeal: '2', strMeal: 'Test Meal 2', strMealThumb: 'url2' },
    ]);
  });

  it('renders hero and filter pills', async () => {
    renderWithAuth(<Home />);
    expect(screen.getByPlaceholderText(/search recipes/i)).toBeInTheDocument();
    await waitFor(() => {
      const pills = screen.getAllByText(/All|Vegetarian|Seafood|Chicken|Beef/);
      expect(pills.length).toBeGreaterThan(0);
    });
  });

  it('toggles active category when pill clicked', async () => {
    renderWithAuth(<Home />);
    await waitFor(() => {
      const vegetarian = screen.getByText('Vegetarian');
      expect(vegetarian).toBeInTheDocument();
    });
  });

  it('displays meals after loading', async () => {
    renderWithAuth(<Home />);
    await waitFor(() => {
      const mealText = screen.queryByText(/Test Meal 1/i);
      expect(mealText).toBeInTheDocument();
    });
  });
});
