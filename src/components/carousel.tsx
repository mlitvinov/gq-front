import React, { ReactNode, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll, { AutoScrollOptionsType } from "embla-carousel-auto-scroll";
import "./carousel.style.css";
import { cn } from "@/lib/utils";

type CarouselProps = {
  items: ReactNode[];

  autoPlay?: boolean;
  itemClassName?: string;
  containerClassName?: string;
  options?: EmblaOptionsType;
  autoStartOptions?: AutoScrollOptionsType;
};
export function Carousel({
  items,
  options,
  autoPlay = false,
  itemClassName,
  containerClassName,
  autoStartOptions = {},
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({
      playOnInit: !!autoPlay,
      speed: 0.5,
      stopOnInteraction: !autoPlay,
      startDelay: 100,
      ...autoStartOptions,
    }),
  ]);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    const playOrStop = autoScroll.isPlaying()
      ? autoScroll.stop
      : autoScroll.play;
    playOrStop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  return (
    <div className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className={cn("embla__container", containerClassName)}>
          {items.map((item, index) => (
            <div className={cn("embla__slide", itemClassName)} key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
