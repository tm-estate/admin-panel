import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiClose, mdiChevronLeft, mdiChevronRight, mdiUpload, mdiDelete } from '@mdi/js';
import ImageItem from './ImageItem';
import { FieldProps } from 'formik';

interface ImageGalleryProps extends FieldProps {
    images?: string[]; // Initial images (read-only)
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
                                                               field,
                                                               form,
                                                               images = []
                                                           }) => {
    // Keep track of initial images separately (for display only)
    const [initialImages] = useState<string[]>(images);

    // New uploaded images (these will be submitted)
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    // For fullscreen gallery
    const [currentFullScreenIndex, setCurrentFullScreenIndex] = useState<number | null>(null);
    const [isViewingInitial, setIsViewingInitial] = useState<boolean>(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Preloaded images for fullscreen view
    const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);

    // Preload images for smoother fullscreen transition
    useEffect(() => {
        const allImageUrls = [...initialImages, ...newImagePreviews];

        const preloadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new window.Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
        };

        Promise.all(allImageUrls.map(url => preloadImage(url)))
            .then(loadedImages => {
                setPreloadedImages(loadedImages);
            })
            .catch(error => {
                console.error('Error preloading images:', error);
            });
    }, [initialImages, newImagePreviews]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFiles = Array.from(e.target.files);
        const validImageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

        // Add new files
        setNewImages(prev => [...prev, ...validImageFiles]);

        // Create and store previews
        validImageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    setNewImagePreviews(prev => [...prev, result]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset input to allow selecting the same file again
        e.target.value = '';
    };

    const handleDeleteNewImage = (index: number) => {
        // Remove from both the files array and previews
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle opening fullscreen view
    const handleImageClick = (index: number, isInitial: boolean) => {
        setCurrentFullScreenIndex(index);
        setIsViewingInitial(isInitial);
    };

    const closeFullScreen = () => {
        setCurrentFullScreenIndex(null);
    };

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentFullScreenIndex === null) return;

        const imageSet = isViewingInitial ? initialImages : newImagePreviews;
        const totalImages = imageSet.length;

        if (totalImages <= 1) return;

        const isFirstSlide = currentFullScreenIndex === 0;
        const newIndex = isFirstSlide ? totalImages - 1 : currentFullScreenIndex - 1;
        setCurrentFullScreenIndex(newIndex);
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentFullScreenIndex === null) return;

        const imageSet = isViewingInitial ? initialImages : newImagePreviews;
        const totalImages = imageSet.length;

        if (totalImages <= 1) return;

        const isLastSlide = currentFullScreenIndex === totalImages - 1;
        const newIndex = isLastSlide ? 0 : currentFullScreenIndex + 1;
        setCurrentFullScreenIndex(newIndex);
    };

    // Update the form value whenever the new images change
    useEffect(() => {
        form.setFieldValue(field.name, newImages);
    }, [field.name, form, newImages]);

    return (
        <div className="space-y-4">
            {/* Initial Images Section (if any) */}
            {initialImages.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Current Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {initialImages.map((src, index) => (
                            <div className="relative group" key={`initial-${index}`}>
                                <ImageItem
                                    className='max-h-[200px] w-full h-full object-cover'
                                    src={src}
                                    alt={`Image ${index + 1}`}
                                    onClick={() => handleImageClick(index, true)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Images Section */}
            {newImagePreviews.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">New Images {newImages.length > 0 && `(${newImages.length})`}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newImagePreviews.map((src, index) => (
                            <div className="relative group" key={`new-${index}`}>
                                <ImageItem
                                    className='max-h-[200px] w-full h-full object-cover'
                                    src={src}
                                    alt={`New Image ${index + 1}`}
                                    onClick={() => handleImageClick(index, false)}
                                    onDelete={() => handleDeleteNewImage(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <div className="mt-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <button
                    type="button"
                    onClick={openFileDialog}
                    className="flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                >
                    <Icon path={mdiUpload} size={1} color="#6B7280" className="mr-2" />
                    <span className="text-sm text-gray-600">Add Images</span>
                </button>
            </div>

            {/* Full Screen Image Modal with Carousel */}
            {currentFullScreenIndex !== null && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                    onClick={closeFullScreen}
                >
                    <div className="relative w-full max-w-6xl max-h-screen p-4 flex items-center justify-center">
                        <img
                            src={isViewingInitial ?
                                initialImages[currentFullScreenIndex] :
                                newImagePreviews[currentFullScreenIndex]}
                            alt={`Full screen image ${currentFullScreenIndex + 1}`}
                            className="object-contain max-h-screen max-w-full"
                        />

                        {/* Navigation Controls */}
                        <button
                            className="absolute top-4 right-4 p-2 bg-red-500 rounded-full z-20 hover:bg-red-600"
                            aria-label="Close full screen"
                            onClick={closeFullScreen}
                        >
                            <Icon path={mdiClose} size={1} color="white" />
                        </button>

                        {(isViewingInitial ? initialImages.length : newImagePreviews.length) > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 z-20"
                                    aria-label="Previous image"
                                >
                                    <Icon path={mdiChevronLeft} size={1.5} color="white" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 z-20"
                                    aria-label="Next image"
                                >
                                    <Icon path={mdiChevronRight} size={1.5} color="white" />
                                </button>

                                {/* Image Counter/Indicator */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                                    {currentFullScreenIndex + 1} / {isViewingInitial ? initialImages.length : newImagePreviews.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
