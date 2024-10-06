interface SliderProps {
  elements: string[];
}

const Slider: React.FC<SliderProps> = ({ elements }) => {
  return (
    <div className="overflow-hidden group">
      <div className="flex gap-8 mb-6 animate-scroll [&>*:nth-child(odd)]:mt-2 group-hover:animation-none group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
        {/* Duplicate the logos for seamless scrolling */}
        {[...elements, ...elements].map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-4"
          >
            <img
              src={logo}
              alt={`Logo ${index + 1}`}
              className="size-16 object-contain"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-8 animate-scroll [&>*:nth-child(odd)]:mt-2 group-hover:animation-none group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
        {/* Duplicate the logos for seamless scrolling */}
        {[...elements, ...elements].map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-4"
          >
            <img
              src={logo}
              alt={`Logo ${index + 1}`}
              className="size-16 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
