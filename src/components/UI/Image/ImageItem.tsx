import React from 'react';
import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';

interface ImageItemProps {
    src: string;
    alt?: string;
    width?: number,
    height?: number,
    onDelete?: (src: string) => void;
    onClick?: (src: string) => void;
    className?: string;
}

const ImageItem: React.FC<ImageItemProps> = ({
                                                 src,
                                                 width = 300,
                                                 height = 200,
                                                 alt = 'Image',
                                                 onDelete,
                                                 onClick,
                                                 className = '',
                                             }) => {
    const handleImageClick = () => {
        if (onClick) onClick(src);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete(src);
    };

    return (
        <>
            <div
                onClick={handleImageClick}
                className="w-full h-full cursor-pointer overflow-hidden rounded-md"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`${className}`}
                />
            </div>

            {onDelete && (
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    aria-label="Delete image"
                >
                    <Icon
                        path={mdiDelete}
                        size={0.8}
                        color="white"
                    />
                </button>
            )}
        </>
    );
};

export default ImageItem;
