import { useEffect, useRef, useState } from 'react';

const metrics = [
  { end: 99.99, suffix: '%', decimals: 2, label: 'Uptime SLA' },
  { end: 50, suffix: '+', decimals: 0, label: 'Supported Assets' },
  { end: 99.98, suffix: '%', decimals: 2, label: 'Payment Success Rate' },
  { end: 140, suffix: '+', decimals: 0, label: 'Countries' },
  { end: 0, suffix: '%', decimals: 0, label: 'Chargebacks' },
];

function useCountUp(end: number, decimals: number, start: boolean, duration = 1800) {
  const [value, setValue] = useState<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [start, end, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

function MetricItem({ end, suffix, decimals, label, started, delay }: {
  end: number; suffix: string; decimals: number; label: string; started: boolean; delay: number;
}) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(t);
  }, [started, delay]);

  const display = useCountUp(end, decimals, go);

  return (
    <div className={`hp-metrics-strip__item ${go ? 'hp-metrics-strip__item--visible' : ''}`}>
      <span className="hp-metrics-strip__num">{display}{suffix}</span>
      <span className="hp-metrics-strip__label">{label}</span>
    </div>
  );
}

export function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="hp-metrics-strip" ref={ref}>
      <div className="hp-metrics-strip__inner">
        {metrics.map((m, i) => (
          <MetricItem key={i} {...m} started={inView} delay={i * 150} />
        ))}
      </div>
    </div>
  );
}
