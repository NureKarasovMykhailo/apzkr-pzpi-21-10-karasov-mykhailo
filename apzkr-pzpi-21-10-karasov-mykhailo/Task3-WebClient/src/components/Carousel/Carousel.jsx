import Carousel from 'react-bootstrap/Carousel';
import React from "react";
import stl from './Carousel.css';
import {useTranslation} from "react-i18next";

function CarouselMain () {
    const { t } = useTranslation();

    const slides = [
        {
            img: 'Assets/carousel-main-first-slide.jpg',
            header: t('carouselFirstSlideHeader'),
            text: t('carouselFirstSlideText')
        },
        {
            img: 'Assets/carousel-main-second-slide.jpg',
            header: t('carouselSecondSlideHeader'),
            text: t('carouselSecondSlideText')
        },
        {
            img: 'Assets/carousel-main-third-slide.jpg',
            header: t('carouselThirdSlideHeader'),
            text: t('carouselThirdSlideText')
        }
    ]

    return (
       <Carousel>
           { slides.map((slide, index) => (
               <Carousel.Item key={index}>
                   <img
                       className='d-block carousel__slide'
                       src={slide.img}
                       alt="Error while loading photo"
                   />
                   <Carousel.Caption>
                       <h3>{slide.header}</h3>
                       <p>{slide.text}</p>
                   </Carousel.Caption>
               </Carousel.Item>
           ))}
       </Carousel>
    );
}

export default CarouselMain;