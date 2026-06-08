import { NextResponse } from 'next/server';
import { getMailTransporter, MAIL_FROM } from '@/lib/nodemailerTransport';

const DEFAULT_TO = 'sistemas@proenergeticos.mx';

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

const TO_BY_TIPO: Record<string, string | string[]> = {
  COTIZACION: 'ventas@proenergeticos.mx',
  CONTACTO: ['sistemas@proenergeticos.mx', 'ventas@proenergeticos.mx'],
  QUEJAS_SUGERENCIAS: DEFAULT_TO,
};

const TO_BY_SECCION: Record<string, string | string[]> = {
  corporativo: 'ventas@proenergeticos.mx',
  contacto: ['sistemas@proenergeticos.mx', 'ventas@proenergeticos.mx'],
  quejas: DEFAULT_TO,
};

function asTrimmedString(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function resolveMailTo(tipoFormulario: string, seccion: string): string[] {
  const tipoKey = tipoFormulario.toUpperCase();
  const seccionKey = seccion.toLowerCase();

  const candidate =
    TO_BY_SECCION[seccionKey] ??
    TO_BY_TIPO[tipoKey] ??
    DEFAULT_TO;

  const list = (Array.isArray(candidate) ? candidate : [candidate])
    .map((entry) => asTrimmedString(entry))
    .filter(Boolean);

  return list.length > 0 ? list : [DEFAULT_TO];
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

  const tipoFormulario = asTrimmedString(body.tipoFormulario ?? body.tipo, 'CONTACTO');
  const seccion = asTrimmedString(body.seccion, 'contacto');
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

  const mailTo = resolveMailTo(tipoFormulario, seccion);

  const esCotizacion = tipoFormulario === 'COTIZACION';
  const esQuejas = tipoFormulario === 'QUEJAS_SUGERENCIAS';

  const colorHeader = esCotizacion ? '#E30613' : esQuejas ? '#B91C1C' : '#111827';
  const tituloCorreo = esCotizacion
    ? 'SOLICITUD DE COTIZACIÓN'
    : esQuejas
      ? 'BUZÓN DE QUEJAS Y SUGERENCIAS (NOM-016)'
      : 'CONSULTA GENERAL';
  const prefijoAsunto = esCotizacion
    ? '💼 COTIZACIÓN'
    : esQuejas
      ? `📋 ${categoria || 'MENSAJE'}`
      : '📩 CONTACTO';
  const origenCorreo = esCotizacion
    ? 'Sección Corporativa'
    : esQuejas
      ? 'Buzón NOM-016-CRE-2016 — Estaciones de servicio'
      : seccion === 'contacto'
        ? 'Formulario de Contacto'
        : `Formulario web (${seccion})`;

  const filasQuejas =
    esQuejas &&
    `
                ${motivo ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Motivo / tema NOM</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${motivo}</p>` : ''}
                ${estacion ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Estación</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${estacion}</p>` : ''}
                ${fechaHecho ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Fecha del hecho</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${fechaHecho}${horaHecho ? ` — ${horaHecho}` : ''}</p>` : ''}
                ${dispensario ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Dispensario</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${dispensario}</p>` : ''}
                ${telefono ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Teléfono</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">${telefono}</p>` : ''}
                `;

  try {
    const data = await transporter.sendMail({
      from: MAIL_FROM,
      to: mailTo,
      replyTo: correo,
      subject: asunto ? `${prefijoAsunto}: ${asunto}` : `${prefijoAsunto}: ${nombre}`,
      html: `
        <div style="background-color: #f4f4f4; padding: 40px 10px; font-family: sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color: ${colorHeader}; padding: 35px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 3px; font-style: italic;">
                  ${tituloCorreo}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Nombre o Empresa</p>
                <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 25px 0;">${nombre}</p>
                
                <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Correo de Respuesta</p>
                <p style="color: ${esCotizacion ? '#E30613' : esQuejas ? '#B91C1C' : '#3b82f6'}; font-size: 18px; font-weight: bold; margin: 0 0 25px 0;">${correo}</p>
                ${esQuejas && categoria ? `<p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Tipo de mensaje</p><p style="color: #111827; font-size: 16px; font-weight: bold; margin: 0 0 25px 0;">${categoria}</p>` : ''}
                ${filasQuejas || ''}
                <div style="background-color: #f9fafb; border-left: 6px solid ${colorHeader}; padding: 25px; border-radius: 0 15px 15px 0; margin-top: 10px;">
                  <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">Detalles del Mensaje:</p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${mensaje}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
                  Origen: ${origenCorreo}
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al enviar correo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
