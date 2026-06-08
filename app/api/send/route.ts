import { NextResponse } from 'next/server';
import { getMailTransporter, getMailFrom } from '@/lib/nodemailerTransport';

const MAIL_ADMINISTRACION = 'administracion@proenergeticos.mx';
const MAIL_VENTAS = 'ventas@proenergeticos.mx';

type FormTipo = 'CONTACTO' | 'QUEJAS_SUGERENCIAS' | 'COTIZACION';

type SendFormBody = {
  nombre?: unknown;
  correo?: unknown;
  mensaje?: unknown;
  tipo?: unknown;
  tipoFormulario?: unknown;
  seccion?: unknown;
  categoria?: unknown;
  asunto?: unknown;
  telefono?: unknown;
  estacion?: unknown;
  motivo?: unknown;
  fechaHecho?: unknown;
  horaHecho?: unknown;
  dispensario?: unknown;
};

type FormMailConfig = {
  mailTo: string[];
  subject: (nombre: string) => string;
  tipoMensajeLabel: string;
  tipoMensajeBadgeStyle: string;
  headerColor: string;
  tituloCorreo: string;
  origenCorreo: string;
  accentColor: string;
};

function asTrimmedString(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function normalizeFormTipo(raw: string): FormTipo {
  const key = raw.toUpperCase();
  if (key === 'COTIZACION') return 'COTIZACION';
  if (key === 'QUEJAS_SUGERENCIAS') return 'QUEJAS_SUGERENCIAS';
  return 'CONTACTO';
}

function getFormMailConfig(tipo: FormTipo): FormMailConfig {
  switch (tipo) {
    case 'COTIZACION':
      return {
        mailTo: [MAIL_VENTAS],
        subject: (nombre) => `[WEB: Cotización] - Solicitud de ${nombre}`,
        tipoMensajeLabel: 'Tipo de Mensaje: COTIZACIÓN',
        tipoMensajeBadgeStyle:
          'background-color: #FEE2E2; color: #991B1B; border: 2px solid #E30613; font-size: 15px; font-weight: 800; letter-spacing: 1px;',
        headerColor: '#E30613',
        tituloCorreo: 'SOLICITUD DE COTIZACIÓN',
        origenCorreo: 'Sección Corporativa',
        accentColor: '#E30613',
      };
    case 'QUEJAS_SUGERENCIAS':
      return {
        mailTo: [MAIL_ADMINISTRACION],
        subject: (nombre) => `[WEB: Quejas y Sugerencias] - Reporte de ${nombre}`,
        tipoMensajeLabel: 'Tipo de Mensaje: QUEJA / SUGERENCIA',
        tipoMensajeBadgeStyle:
          'background-color: #FEE2E2; color: #7F1D1D; border: 2px solid #B91C1C; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;',
        headerColor: '#B91C1C',
        tituloCorreo: 'BUZÓN DE QUEJAS Y SUGERENCIAS (NOM-016)',
        origenCorreo: 'Buzón NOM-016-CRE-2016 — Estaciones de servicio',
        accentColor: '#B91C1C',
      };
    case 'CONTACTO':
    default:
      return {
        mailTo: [MAIL_ADMINISTRACION],
        subject: (nombre) => `[WEB: Contacto] - Mensaje de ${nombre}`,
        tipoMensajeLabel: 'Tipo de Mensaje: CONTACTO',
        tipoMensajeBadgeStyle:
          'background-color: #EFF6FF; color: #1E3A8A; border: 2px solid #3B82F6; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;',
        headerColor: '#111827',
        tituloCorreo: 'CONSULTA GENERAL',
        origenCorreo: 'Formulario de Contacto',
        accentColor: '#3B82F6',
      };
  }
}

function buildTipoMensajeBadge(config: FormMailConfig): string {
  return `
    <div style="margin: 0 0 28px 0; padding: 14px 18px; border-radius: 12px; text-align: center; text-transform: uppercase; ${config.tipoMensajeBadgeStyle}">
      ${config.tipoMensajeLabel}
    </div>
  `;
}

function buildQuejasExtraRows(fields: {
  categoria: string;
  motivo: string;
  estacion: string;
  fechaHecho: string;
  horaHecho: string;
  dispensario: string;
  telefono: string;
}): string {
  const { categoria, motivo, estacion, fechaHecho, horaHecho, dispensario, telefono } = fields;

  return `
    ${categoria ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Clasificación</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${categoria}</p>` : ''}
    ${motivo ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Motivo / tema NOM</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${motivo}</p>` : ''}
    ${estacion ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Estación</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${estacion}</p>` : ''}
    ${fechaHecho ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Fecha del hecho</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${fechaHecho}${horaHecho ? ` — ${horaHecho}` : ''}</p>` : ''}
    ${dispensario ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Dispensario</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${dispensario}</p>` : ''}
    ${telefono ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Teléfono</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${telefono}</p>` : ''}
  `;
}

function buildMailHtml(
  config: FormMailConfig,
  fields: {
    nombre: string;
    correo: string;
    mensaje: string;
    asunto: string;
    extraRows?: string;
  }
): string {
  const { nombre, correo, mensaje, asunto, extraRows = '' } = fields;

  return `
    <div style="background-color: #f4f4f4; padding: 40px 10px; font-family: sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: ${config.headerColor}; padding: 35px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 3px; font-style: italic;">
              ${config.tituloCorreo}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">
            ${buildTipoMensajeBadge(config)}

            <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Nombre o Empresa</p>
            <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 25px 0;">${nombre}</p>

            <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Correo de Respuesta</p>
            <p style="color: ${config.accentColor}; font-size: 18px; font-weight: bold; margin: 0 0 25px 0;">${correo}</p>

            ${asunto ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Asunto del formulario</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${asunto}</p>` : ''}
            ${extraRows}

            <div style="background-color: #f9fafb; border-left: 6px solid ${config.headerColor}; padding: 25px; border-radius: 0 15px 15px 0; margin-top: 10px;">
              <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">Detalles del Mensaje:</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${mensaje}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
              Origen: ${config.origenCorreo}
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function POST(req: Request) {
  const transporter = getMailTransporter();
  if (!transporter) {
    return NextResponse.json(
      { error: 'Faltan EMAIL_USER o GOOGLE_APP_PASSWORD en el entorno del servidor.' },
      { status: 500 }
    );
  }

  let body: SendFormBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido.' }, { status: 400 });
  }

  const tipoFormulario = normalizeFormTipo(
    asTrimmedString(body.tipoFormulario ?? body.tipo, 'CONTACTO')
  );
  const nombre = asTrimmedString(body.nombre);
  const correo = asTrimmedString(body.correo);
  const mensaje = asTrimmedString(body.mensaje);
  const categoria = asTrimmedString(body.categoria);
  const asunto = asTrimmedString(body.asunto);
  const telefono = asTrimmedString(body.telefono);
  const estacion = asTrimmedString(body.estacion);
  const motivo = asTrimmedString(body.motivo);
  const fechaHecho = asTrimmedString(body.fechaHecho);
  const horaHecho = asTrimmedString(body.horaHecho);
  const dispensario = asTrimmedString(body.dispensario);

  if (!nombre || !correo || !mensaje) {
    return NextResponse.json(
      { error: 'Faltan campos obligatorios: nombre, correo o mensaje.' },
      { status: 400 }
    );
  }

  const config = getFormMailConfig(tipoFormulario);
  const extraRows =
    tipoFormulario === 'QUEJAS_SUGERENCIAS'
      ? buildQuejasExtraRows({
          categoria,
          motivo,
          estacion,
          fechaHecho,
          horaHecho,
          dispensario,
          telefono,
        })
      : '';

  try {
    const data = await transporter.sendMail({
      from: getMailFrom(),
      to: config.mailTo,
      replyTo: correo,
      subject: config.subject(nombre),
      html: buildMailHtml(config, { nombre, correo, mensaje, asunto, extraRows }),
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al enviar correo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
