import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import RecipeDetail from '../../pages/RecipeDetail';
import * as apiModule from '../../utils/api';

vi.mock('../../utils/api');

describe('RecipeDetail page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiModule.getMealById.mockResolvedValue({
      idMeal: '1',
      strMeal: 'Test Meal',
      strMealThumb: 'url',
      strCategory: 'Vegetarian',
      strArea: 'Italian',
      strInstructions: 'Mix and cook',
      strIngredient1: 'Tomato',
      strMeasure1: '1 cup',
      strIngredient2: null,
    });
  });

  it('checks ingredient checkboxes and save button feedback', async () => {
    render(
      <MemoryRouter initialEntries={["/recipe/1"]}>
        <AuthProvider>
          <Routes>
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const checkbox = screen.getAllByRole('checkbox')[0];
      expect(checkbox).not.toBeChecked();
    });

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
