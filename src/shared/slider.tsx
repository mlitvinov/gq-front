// slider.tsx

import React from "react";

interface SliderProps {
  elements: string[];
  onElementClick?: (index: number) => void; // Добавляем пропс для обработки клика
}

const Slider: React.FC<SliderProps> = ({ elements, onElementClick }) => {
  return (
    <div className="overflow-hidden group">
      <div className="flex gap-8 mb-6 animate-scroll [&>*:nth-child(odd)]:mt-2 group-hover:animation-none group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
        {/* Дублируем элементы для бесшовной прокрутки */}
        {[...elements, ...elements].map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-4"
            onClick={() => onElementClick && onElementClick(index % elements.length)} // Обработчик клика
          >
            <img
              src={logo}
              alt={`Логотип ${index + 1}`}
              className="size-16 object-contain cursor-pointer" // Добавляем курсор указателя
            />
          </div>
        ))}
      </div>
      <div className="flex gap-8 animate-scroll [&>*:nth-child(odd)]:mt-2 group-hover:animation-none group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
        {/* Дублируем элементы для бесшовной прокрутки */}
        {[...elements, ...elements].map((logo, index) => (
          <div
            key={index + elements.length}
            className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-4"
            onClick={() => onElementClick && onElementClick(index % elements.length)} // Обработчик клика
          >
            <img
              src={logo}
              alt={`Логотип ${index + 1}`}
              className="size-16 object-contain cursor-pointer" // Добавляем курсор указателя
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
