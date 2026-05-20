/** Leyendas de vigencia en zona Mazatlán (misma convención que sync CRE). */
export const TZ_LEYENDA = 'America/Mazatlan';

export function leyendaFechaMazatlanLocal(instant: Date): string {
  const weekday = new Intl.DateTimeFormat('es-MX', { timeZone: TZ_LEYENDA, weekday: 'long' }).format(
    instant
  );
  const day = new Intl.DateTimeFormat('es-MX', { timeZone: TZ_LEYENDA, day: 'numeric' }).format(instant);
  const month = new Intl.DateTimeFormat('es-MX', { timeZone: TZ_LEYENDA, month: 'long' }).format(instant);
  return `${weekday.toLowerCase()}, ${day} de ${month}`;
}

export function leyendaHoraMazatlanLocal(instant: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ_LEYENDA,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(instant);
}

export function leyendasVigenciaAhora(): { fecha_actualizacion: string; hora_actualizacion: string } {
  const instant = new Date();
  return {
    fecha_actualizacion: leyendaFechaMazatlanLocal(instant),
    hora_actualizacion: leyendaHoraMazatlanLocal(instant),
  };
}
