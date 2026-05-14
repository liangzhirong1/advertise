import { useState, useEffect, useCallback } from 'react';

// ============================================================
// Breakpoints (matches index.css)
// ============================================================

export const BREAKPOINTS = {
  mobile: 576,
  tablet: 992,
  desktop: 1200,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================================
// useMediaQuery hook
// ============================================================

/**
 * 响应式断点 Hook
 *
 * @example
 * const isMobile = useMediaQuery('mobile');
 * const isTablet = useMediaQuery('tablet');
 * const isDesktop = useMediaQuery('desktop');
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const query = `(max-width: ${BREAKPOINTS[breakpoint] - 0.02}px)`;

  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const handleChange = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// ============================================================
// useResponsive hook — 返回所有断点状态
// ============================================================

export function useResponsive() {
  const isMobile = useMediaQuery('mobile');
  const isTablet = useMediaQuery('tablet');
  const isDesktop = useMediaQuery('desktop');

  return {
    isMobile,
    isTablet,
    isDesktop,
    /** 是否小于 tablet（mobile + tablet） */
    isLessThanDesktop: isMobile || isTablet,
    /** 是否小于 desktop */
    isLessThanTablet: isMobile,
  };
}

// ============================================================
// useWindowWidth hook
// ============================================================

export function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const handleResize = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return width;
}
