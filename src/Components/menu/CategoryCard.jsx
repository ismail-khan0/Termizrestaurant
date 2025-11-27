// src/components/menu/CategoryCard.jsx
import React from 'react';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick(category)}
      className={`${category.color} text-white p-4 rounded-xl cursor-pointer hover:opacity-90 transition-opacity`}
    >
      <p className="font-semibold">{category.name}</p>
      <p className="text-sm">{category.items} Items</p>
    </div>
  );
};

export default CategoryCard;