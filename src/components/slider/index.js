
import React, { useEffect, useRef } from 'react';
import { SliderContainer } from './style';
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";

function Slider(props) {
  const sliderSwiperRef = useRef(null);
  console.log(sliderSwiperRef)
  const { bannerList } = props;
  useEffect(() => {
    // 当已经有banner数据，但是还没有初始化过轮播图实例的时候触发
    if (bannerList.length && !sliderSwiperRef.current) {
      let sliderSwiper = new Swiper('.slider-container', {
        loop: true,
        autoplay: true,
        autoplayDisableOnInteraction: false,
        pagination: { el: '.swiper-pagination' }
      });
      sliderSwiperRef.current = sliderSwiper;
    }
  }, [bannerList])

  return (
    <SliderContainer>
      {/* 给轮播图做一个遮罩，看起来更舒服 */}
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {
            bannerList.map((slider, index) => (
              <div className="swiper-slide" key={index}>
                <div className="swiper-nav">
                  <img src={slider.imageUrl} width="100%" height="100%" alt="slider" />
                </div>
              </div>
            ))
          }
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </SliderContainer>
  )
}

export default React.memo(Slider);