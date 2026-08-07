import { useState, useEffect } from "react";

type ServiceTime = {
  day: number;
  label: string;
  time: string;
};

const services: ServiceTime[] = [
  { day: 0, label: "Domingo", time: "09:00" },
  { day: 0, label: "Domingo", time: "18:00" },
  { day: 3, label: "Quarta", time: "19:30" },
  { day: 5, label: "Sexta", time: "20:00" },
  { day: 6, label: "Sábado", time: "16:00" },
];

function getNextService(): { label: string; time: string; diff: number } {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset < 7; offset++) {
    const checkDay = (currentDay + offset) % 7;
    const dayServices = services.filter((s) => s.day === checkDay);

    for (const s of dayServices) {
      const [h, m] = s.time.split(":").map(Number);
      const serviceMinutes = h * 60 + m;

      if (offset === 0 && serviceMinutes <= currentMinutes) continue;

      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + offset);
      targetDate.setHours(h, m, 0, 0);
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        return { label: s.label, time: s.time, diff };
      }
    }
  }

  const nextSunday = new Date(now);
  nextSunday.setDate(nextSunday.getDate() + ((7 - currentDay + 0) % 7 || 7));
  nextSunday.setHours(9, 0, 0, 0);
  return {
    label: "Domingo",
    time: "09:00",
    diff: nextSunday.getTime() - now.getTime(),
  };
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { d, h, m, s };
}

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="font-display text-2xl sm:text-3xl font-bold text-gold tabular-nums leading-none">
      {String(value).padStart(2, "0")}
    </span>
    <span className="font-body text-[10px] uppercase tracking-[0.15em] text-primary-foreground/60 mt-1">
      {label}
    </span>
  </div>
);

const LiveCountdown = () => {
  const [nextService, setNextService] = useState(getNextService);
  const [countdown, setCountdown] = useState(() => formatCountdown(nextService.diff));

  useEffect(() => {
    const interval = setInterval(() => {
      const ns = getNextService();
      setNextService(ns);
      setCountdown(formatCountdown(ns.diff));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        <CountdownUnit value={countdown.d} label="dias" />
        <span className="text-primary-foreground/30 font-display text-2xl">:</span>
        <CountdownUnit value={countdown.h} label="horas" />
        <span className="text-primary-foreground/30 font-display text-2xl">:</span>
        <CountdownUnit value={countdown.m} label="min" />
        <span className="text-primary-foreground/30 font-display text-2xl">:</span>
        <CountdownUnit value={countdown.s} label="seg" />
      </div>
      <p className="font-body text-xs text-primary-foreground/50 uppercase tracking-[0.15em]">
        Próximo culto: {nextService.label} às {nextService.time}
      </p>
    </div>
  );
};

export default LiveCountdown;