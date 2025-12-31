import React from "react";

// Professional SVG icons for each category
const categoryIcons = {
  Pottery: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10H16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 14H16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Handloom: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5Z" stroke="#A68A64" strokeWidth="2"/>
      <path d="M8 10H16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 14H16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 3V21" stroke="#A68A64" strokeWidth="2"/>
    </svg>
  ),
  Woodcraft: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L20 8L12 13L4 8L12 3Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16L12 21L4 16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 12L12 17L4 12" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bamboo: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3C17 3 17 8 15 10C13 12 11 12 9 10C7 8 7 3 7 3" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 21C17 21 17 16 15 14C13 12 11 12 9 14C7 16 7 21 7 21" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 5V19" stroke="#A68A64" strokeWidth="2"/>
    </svg>
  ),
  Jewelry: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="10" r="2" stroke="#A68A64" strokeWidth="2"/>
      <path d="M18 16C18 12.69 15.31 10 12 10C8.69 10 6 12.69 6 16" stroke="#A68A64" strokeWidth="2"/>
      <path d="M12 18C8.69 18 6 15.31 6 12" stroke="#A68A64" strokeWidth="2"/>
      <path d="M12 18C15.31 18 18 15.31 18 12" stroke="#A68A64" strokeWidth="2"/>
    </svg>
  ),
  "Natural dyes": (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V21" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 8C8 8 9 4 12 4C15 4 16 8 16 8" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12H21" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 16C8 16 9 20 12 20C15 20 16 16 16 16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

function CategoryIcon({ category }) {
  if (!category) return categoryIcons.Pottery;

  const key = Object.keys(categoryIcons).find(
    k => k.toLowerCase() === category.toLowerCase()
  );

  return categoryIcons[key] || categoryIcons.Pottery;
}


export default CategoryIcon;
