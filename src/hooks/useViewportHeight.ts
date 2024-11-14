import { useState, useEffect } from "react";

/**
 * Хук для отслеживания высоты окна браузера.
 *
 * @returns Текущая высота окна браузера.
 */
const useViewportHeight = (): number => {
  // Инициализируем состояние с текущей высотой окна
  const [height, setHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    // Функция-обработчик для события resize
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    // Добавляем слушатель события resize
    window.addEventListener("resize", handleResize);

    // Очистка: удаляем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Пустой массив зависимостей означает, что эффект выполняется один раз при монтировании

  return height;
};

export default useViewportHeight;
