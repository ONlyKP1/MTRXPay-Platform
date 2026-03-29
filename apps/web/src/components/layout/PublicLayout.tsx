import type { ReactNode } from 'react';
import { Navigation } from '../landing/Navigation';
import { Footer } from '../landing/Footer';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="hp-landing">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
