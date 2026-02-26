import { searchMeals, getMealById, filterByCategory, listCategories } from '../api';

describe('api utilities', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the default key when none is provided', async () => {
    fetch.mockResolvedValue({ json: () => ({ meals: [] }) });

    await searchMeals('pasta');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/1/search.php?s=pasta')
    );
  });

  it('getMealById calls lookup', async () => {
    fetch.mockResolvedValue({ json: () => ({ meals: [{ idMeal: 123 }] }) });
    const result = await getMealById(123);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lookup.php?i=123')
    );
    expect(result).toEqual({ idMeal: 123 });
  });

  it('filterByCategory calls filter endpoint', async () => {
    fetch.mockResolvedValue({ json: () => ({ meals: [] }) });
    await filterByCategory('Seafood');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/filter.php?c=Seafood')
    );
  });

  it('listCategories calls categories endpoint', async () => {
    fetch.mockResolvedValue({ json: () => ({ categories: [] }) });
    await listCategories();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/categories.php')
    );
  });
});
