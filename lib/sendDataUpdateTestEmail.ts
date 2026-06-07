import { getMailTransporter, MAIL_FROM } from '@/lib/nodemailerTransport';

const NOTIFICATION_TO = ['sistemas@proenergeticos.mx', 'ventas@proenergeticos.mx'];

export type DataUpdateEmailSummary = {
  actualizados: number;
  origen: string;
  detalle?: string;
};

export type SendDataUpdateTestEmailResult = {
  ok: boolean;
  error?: string;
  id?: string;
};

/**
 * Envía notificación por SMTP (Gmail) cuando se actualizan datos en el sistema.
 */
export async function sendDataUpdateTestEmail(
  summary: DataUpdateEmailSummary
): Promise<SendDataUpdateTestEmailResult> {
  const transporter = getMailTransporter();
  if (!transporter) {
    return {
      ok: false,
      error: 'Faltan EMAIL_USER o GOOGLE_APP_PASSWORD en el entorno.',
    };
  }

  const timestamp = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mazatlan',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  try {
    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to: NOTIFICATION_TO,
      subject: `Notificación — ${summary.origen}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #111827; font-size: 20px; margin: 0 0 16px 0;">
            Actualización de datos registrada
          </h1>
          <p style="color: #374151; line-height: 1.6; margin: 0 0 12px 0;">
            Se registró una actualización en el sistema.
          </p>
          <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
            <li><strong>Origen:</strong> ${summary.origen}</li>
            <li><strong>Registros actualizados:</strong> ${summary.actualizados}</li>
            <li><strong>Fecha y hora:</strong> ${timestamp}</li>
            ${summary.detalle ? `<li><strong>Detalle:</strong> ${summary.detalle}</li>` : ''}
          </ul>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            Remitente: ${MAIL_FROM} · Destinos: ${NOTIFICATION_TO.join(', ')}
          </p>
        </div>
      `,
    });

    return { ok: true, id: info.messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al enviar correo.';
    return { ok: false, error: message };
  }
}
