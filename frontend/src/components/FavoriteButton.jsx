// src/components/FavoriteButton.jsx

import React from 'react';
import { useToggleInterestStock } from "../hooks/useToggleInterestStock";

// props로 stockId와 isInterested를 받도록 설정
function FavoriteButton({ stockId, isInterested }) {
  const { mutate } = useToggleInterestStock();

  const handleClick = (e) => {
    // 이벤트가 부모 요소(Link 등)로 전파되는 것을 막아 페이지 이동 등을 방지
    e.preventDefault();
    e.stopPropagation();
    mutate({ stockId, isAlreadyInterested: isInterested });
  };

  return (
    <button
      onClick={handleClick}
      className={` p-2 rounded-full transition-colors ${
        isInterested 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-300 hover:text-red-400 hover:bg-gray-50'
      }`}
      aria-label={isInterested ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="sr-only">
        {isInterested ? 'Remove from favorites' : 'Add to favorites'}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isInterested ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isInterested ? 0 : 1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}

export default FavoriteButton;