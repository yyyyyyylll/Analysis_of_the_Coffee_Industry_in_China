import React, { useState, useRef, useEffect } from 'react';

const Slider = ({ onComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragWidth, setDragWidth] = useState(0);
    const sliderRef = useRef(null);
    const maxDrag = 250; // Maximum drag distance in pixels

    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        updateDrag(e.clientX);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        updateDrag(e.touches[0].clientX);
    };

    const updateDrag = (clientX) => {
        if (sliderRef.current) {
            const rect = sliderRef.current.getBoundingClientRect();
            const offsetX = clientX - rect.left;
            const width = Math.min(Math.max(0, offsetX), maxDrag);
            setDragWidth(width);

            if (width >= maxDrag * 0.95) {
                handleComplete();
            }
        }
    };

    const handleMouseUp = () => {
        endDrag();
    };

    const handleTouchEnd = () => {
        endDrag();
    };

    const endDrag = () => {
        setIsDragging(false);
        if (dragWidth < maxDrag * 0.95) {
            setDragWidth(0); // Snap back if not completed
        }
    };

    const handleComplete = () => {
        setIsDragging(false);
        setDragWidth(maxDrag);
        if (onComplete) onComplete();
    };

    // Add global event listeners for mouse up/move to handle dragging outside the element
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    return (
        <div className="slider-container" ref={sliderRef}>
            <div className="slider-track">
                <span className="slider-text">Slide to Enter &rarr;</span>
            </div>
            <div
                className="slider-handle"
                style={{ width: `${dragWidth + 50}px` }} /* +50 for handle head size */
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="slider-knob">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="#F0ECE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div >
    );
};

export default Slider;
