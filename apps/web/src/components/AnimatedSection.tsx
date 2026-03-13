import type { ReactNode, CSSProperties, ElementType } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  threshold?: number;
  style?: CSSProperties;
  as?: ElementType;
}

export function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  style = {},
  as: Component = 'div',
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });

  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translateY(30px)';
      case 'fade-down':
        return 'translateY(-30px)';
      case 'fade-left':
        return 'translateX(-30px)';
      case 'fade-right':
        return 'translateX(30px)';
      case 'scale':
        return 'scale(0.9)';
      case 'fade':
      default:
        return 'none';
    }
  };

  const animationStyle: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(),
    transition: `opacity ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    ...style,
  };

  return (
    <Component
      ref={ref as any}
      className={className}
      style={animationStyle}
    >
      {children}
    </Component>
  );
}

// Staggered children animation wrapper
interface StaggeredAnimationProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';
  threshold?: number;
}

export function StaggeredAnimation({
  children,
  className = '',
  staggerDelay = 0.1,
  animation = 'fade-up',
  threshold = 0.1,
}: StaggeredAnimationProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });

  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translateY(30px)';
      case 'fade-down':
        return 'translateY(-30px)';
      case 'fade-left':
        return 'translateX(-30px)';
      case 'fade-right':
        return 'translateX(30px)';
      case 'scale':
        return 'scale(0.9)';
      case 'fade':
      default:
        return 'none';
    }
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : getInitialTransform(),
            transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * staggerDelay}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * staggerDelay}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Counter animation component
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  className = '',
}: AnimatedCounterProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLSpanElement>();
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(value * easeOut);

        setDisplayValue(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
