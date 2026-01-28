import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures every route change scrolls the page to the top.
 * Uses useLayoutEffect for synchronous scrolling before paint.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    // Use useLayoutEffect to scroll before the browser paints
    useLayoutEffect(() => {
        // Scroll to top immediately
        window.scrollTo(0, 0);
    }, [pathname]);

    // Also use useEffect as a fallback for any async content
    useEffect(() => {
        // Small delay to handle any dynamic content loading
        const timer = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
