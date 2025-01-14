import styled from "@emotion/styled";
import { ReactNode, useCallback, useId, useRef } from "react";
import { EffectCreative, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { SwiperProps, Swiper as SwiperReact, SwiperRef, SwiperSlide } from "swiper/react";

type TSpringSliderProps<T> = {
  items: T[];
  children: (item: T, index: number) => ReactNode;
} & Omit<SwiperProps, "children">;

function SpringSlider<T>({ items, children, ...props }: TSpringSliderProps<T>) {
  const uid = useId();
  const sliderRef = useRef<SwiperRef>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <SliderWrapper className="spring-slider-wrapper">
      <SwiperReact
        ref={sliderRef}
        modules={[EffectCreative, Mousewheel, Navigation, Pagination]}
        watchSlidesProgress={true}
        loop={true}
        pagination
        navigation
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          800: {
            slidesPerView: 4,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
        effect={"creative"}
        speed={720}
        followFinger={false}
        creativeEffect={{
          limitProgress: 100,
          prev: {
            translate: ["-100%", 0, 0],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        {...props}
      >
        {items.length > 0 ? (
          items.map((item, index) => (
            <SwiperSlideStyled key={uid + "slider" + index}>
              {children(item, index)}
            </SwiperSlideStyled>
          ))
        ) : (
          <></>
        )}
      </SwiperReact>
      {/* {actions && <div className='actions-on-image'>{actions}</div>} */}
      {/* <Button
        aria-label="swiper-btn-prev"
        className="swiper-btn-prev"
        size="large"
        icon={<BsChevronLeft size={24} />}
        onClick={handlePrev}
      />
      <Button
        aria-label="swiper-btn-next"
        className="swiper-btn-next"
        size="large"
        icon={<BsChevronRight size={24} />}
        onClick={handleNext}
      /> */}
    </SliderWrapper>
  );
}

const SwiperSlideStyled = styled(SwiperSlide)`
  &.swiper-slide {
    padding-top: 8px;
    padding-bottom: 8px;
  }
`;
const SliderWrapper = styled.div`
  position: relative;
  .swiper {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  .swiper-slide {
    box-sizing: border-box;
    padding: 0 8px;
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }
  .swiper-slide {
    transition-timing-function: cubic-bezier(0.76, 0.09, 0.215, 1);
  }

  .swiper-btn-prev,
  .swiper-btn-next {
    position: absolute;
    top: 50%;
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-btn-prev {
    left: -8px;
    transform: translateX(-100%);
  }
  .swiper-btn-next {
    right: -8px;
    transform: translateX(100%);
  }

  .swiper-pagination {
    display: none;
  }
  .swiper-button-disabled {
    transform: scale(0.9);
  }
  .swiper-button-prev,
  .swiper-button-next {
    --swiper-navigation-size: 24px;
    --swiper-navigation-color: #fff;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    width: calc(var(--swiper-navigation-size) + 12px);
    height: calc(var(--swiper-navigation-size) + 12px);
    /* opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease; */
  }
  &:hover {
  }
`;

export default SpringSlider;
