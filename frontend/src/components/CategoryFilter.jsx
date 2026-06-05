function CategoryFilter({ categories, selectedCategory, onChange }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      <button
        className={`btn btn-sm ${!selectedCategory ? 'btn-success' : 'btn-outline-success'}`}
        type="button"
        onClick={() => onChange('')}
      >
        Все
      </button>
      {categories.map((category) => (
        <button
          className={`btn btn-sm ${
            selectedCategory === String(category.id) ? 'btn-success' : 'btn-outline-success'
          }`}
          type="button"
          key={category.id}
          onClick={() => onChange(String(category.id))}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
