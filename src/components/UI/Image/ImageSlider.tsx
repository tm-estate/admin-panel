import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight, mdiCircle } from '@mdi/js';

interface ImageSliderProps {
    images: string[];
    productName: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
                                                     images,
                                                     autoPlay = false,
                                                     productName,
                                                     autoPlayInterval = 3000
                                                 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (autoPlay && images.length > 1) {
            interval = setInterval(() => {
                goToNext();
            }, autoPlayInterval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoPlay, autoPlayInterval, currentIndex, images.length]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (images.length === 0) {
        return <div className="p-4 text-gray-500">No images to display</div>;
    }

    return (
        <div className="relative w-full h-full">
            {/* Main Image */}
            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
                <Image
                    src={images[currentIndex]}
                    alt={`${productName} - Image ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                        aria-label="Previous slide"
                    >
                        <Icon path={mdiChevronLeft} size={1} color="white" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                        aria-label="Next slide"
                    >
                        <Icon path={mdiChevronRight} size={1} color="white" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className="focus:outline-none"
                            aria-label={`Go to slide ${slideIndex + 1}`}
                        >
                            <Icon
                                path={mdiCircle}
                                size={0.5}
                                color={slideIndex === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)'}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
