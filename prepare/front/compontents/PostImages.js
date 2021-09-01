import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './imagesZoom';
import { backUrl } from '../config/config';

function PostImages({ images }) {
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);

    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);

    if (images.length === 1) {
        return (
            <div>
                <img
                    role="presentation"
                    style={{ objectFit: 'cover', maxWidth: "50%", maxHeight: "50%" }}
                    src={`${backUrl}/images/${images[0].src}`}
                    alt={images[0].src}
                    onClick={onZoom}
                />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </div>
        );
    }
    if (images.length === 2) {
        return (
            <>
                <div>
                    <img role="presentation" src={`${backUrl}/images/${images[0].src}`} alt={images[0].src} width="50%" onClick={onZoom} />
                    <img role="presentation" src={`${backUrl}/images/${images[1].src}`} alt={images[1].src} width="50%" onClick={onZoom} />
                </div>
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }
    return (
        <>
            <div>
                <img
                    role="presentation"
                    src={`${backUrl}/images/${images[0].src}`}
                    alt={images[0].src}
                    style={{
                        width: "50%",
                        objectFit: 'contain'
                    }}
                    onClick={onZoom} />
                <div
                    role="presentation"
                    style={{
                        display: 'inline-block',
                        width: '50%',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                    }}
                    onClick={onZoom}
                >
                    <PlusOutlined />
                    <br />
                    {images.length - 1}
                    개의 사진 더보기
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
        </>
    );
}

PostImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object)
}
export default PostImages;