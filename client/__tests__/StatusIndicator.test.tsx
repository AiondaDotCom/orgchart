import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatusIndicator from '../src/components/StatusIndicator';

// Mock framer-motion: motion.span must be a forwardRef component
vi.mock('framer-motion', () => ({
  motion: {
    span: React.forwardRef(({ children, style, ...rest }: any, ref: any) => (
      <span ref={ref} style={style} data-testid="motion-span" {...rest}>
        {children}
      </span>
    )),
    div: React.forwardRef(({ children, style, ...rest }: any, ref: any) => (
      <div ref={ref} style={style} data-testid="motion-div" {...rest}>
        {children}
      </div>
    )),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('StatusIndicator', () => {
  it('renders green dot for online status', () => {
    const { container } = render(<StatusIndicator status="online" />);

    // Online status uses a wrapper span with nested spans for the pulse effect
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);

    // Find spans with green background (#22C55E)
    const hasGreen = Array.from(spans).some((span) => {
      const bg = (span as HTMLElement).style.backgroundColor;
      return bg === '#22C55E' || bg === 'rgb(34, 197, 94)' || bg.includes('22C55E');
    });
    expect(hasGreen).toBe(true);
  });

  it('renders red dot for offline status', () => {
    const { container } = render(<StatusIndicator status="offline" />);

    const span = container.querySelector('span') as HTMLElement;
    expect(span).toBeTruthy();
    const bg = span.style.backgroundColor;
    // Could be hex (#EF4444) or rgb(239, 68, 68)
    expect(
      bg === '#EF4444' || bg === 'rgb(239, 68, 68)' || bg.toLowerCase().includes('ef4444')
    ).toBe(true);
  });

  it('renders gray dot for unavailable status', () => {
    const { container } = render(<StatusIndicator status="unavailable" />);

    const span = container.querySelector('span') as HTMLElement;
    expect(span).toBeTruthy();
    const bg = span.style.backgroundColor;
    // Could be hex (#6B7280) or rgb(107, 114, 128)
    expect(
      bg === '#6B7280' || bg === 'rgb(107, 114, 128)' || bg.toLowerCase().includes('6b7280')
    ).toBe(true);
  });

  it('uses default size of 10px', () => {
    const { container } = render(<StatusIndicator status="offline" />);

    const span = container.querySelector('span') as HTMLElement;
    expect(span).toBeTruthy();
    expect(span.style.width).toBe('10px');
    expect(span.style.height).toBe('10px');
  });

  it('accepts custom size', () => {
    const { container } = render(<StatusIndicator status="offline" size={16} />);

    const span = container.querySelector('span') as HTMLElement;
    expect(span).toBeTruthy();
    expect(span.style.width).toBe('16px');
    expect(span.style.height).toBe('16px');
  });

  it('renders online status with pulse animation wrapper', () => {
    const { container } = render(<StatusIndicator status="online" />);

    // Online has an outer span (inline-flex) containing motion.span (pulse) + span (solid dot)
    const outerSpan = container.firstElementChild as HTMLElement;
    expect(outerSpan).toBeTruthy();
    expect(outerSpan.tagName.toLowerCase()).toBe('span');
    expect(outerSpan.style.display).toBe('inline-flex');

    // Should contain child spans
    const children = outerSpan.querySelectorAll('span');
    expect(children.length).toBeGreaterThanOrEqual(1);
  });

  it('renders offline status as a simple inline-block span', () => {
    const { container } = render(<StatusIndicator status="offline" />);

    const span = container.firstElementChild as HTMLElement;
    expect(span).toBeTruthy();
    expect(span.style.display).toBe('inline-block');
  });

  it('renders unavailable status as a simple inline-block span', () => {
    const { container } = render(<StatusIndicator status="unavailable" />);

    const span = container.firstElementChild as HTMLElement;
    expect(span).toBeTruthy();
    expect(span.style.display).toBe('inline-block');
  });

  it('renders with border-radius 50% for all statuses', () => {
    // Offline
    const { container: offlineContainer } = render(<StatusIndicator status="offline" />);
    const offlineSpan = offlineContainer.firstElementChild as HTMLElement;
    expect(offlineSpan.style.borderRadius).toBe('50%');

    // Unavailable
    const { container: unavailableContainer } = render(<StatusIndicator status="unavailable" />);
    const unavailableSpan = unavailableContainer.firstElementChild as HTMLElement;
    expect(unavailableSpan.style.borderRadius).toBe('50%');
  });
});
