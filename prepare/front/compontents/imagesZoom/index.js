import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Global, Overlay, Header, SlickWrapper, ImgWrapper, Indicator, CloseButton } from './styles';

function ImagesZoom({ images, onClose }) {
    // npm i react-slick
    const [currentSlide, setCurrentSlide] = useState(0)
    const closeBtnRef = useRef()

    useEffect(() => {
        window.onkeydown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                closeBtnRef.current.click()
            }
        };
    }, [])

    return (
        <Overlay>
            <Global />
            <Header>
                <h1>상세 이미지</h1>
                <CloseButton
                    onClick={onClose}
                    ref={closeBtnRef}
                >
                    X
                </CloseButton>
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        initialSlide={0}
                        afterChange={(slide) => setCurrentSlide(slide)}
                        infinite
                        arrows={false}
                        slidesToShow={1}
                    >
                        {images.map((v) => (
                            <ImgWrapper key={v.src}>
                                <img src={`http://localhost:3065/images/${v.src}`} alt={v.src} />
                            </ImgWrapper>
                        ))}
                    </Slick>
                    <Indicator>
                        <div>
                            {currentSlide + 1}
                            {' '}
                            /
                            {images.length}
                        </div>
                    </Indicator>
                </div>
            </SlickWrapper>
        </Overlay>
    );
}

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func.isRequired,
}
export default ImagesZoom;