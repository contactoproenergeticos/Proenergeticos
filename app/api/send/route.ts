import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_QYWTfnF7_Q6u2JF9KJjJbKpy3AZj2LPgh');

export async function POST(req: Request) {
  try {
    const { nombre, correo, mensaje, tipo } = await req.json();

    // Lógica de distinción
    const esCotizacion = tipo === 'COTIZACION';
    const colorHeader = esCotizacion ? '#E30613' : '#111827';
    const tituloCorreo = esCotizacion ? 'SOLICITUD DE COTIZACIÓN' : 'CONSULTA GENERAL';
    const prefijoAsunto = esCotizacion ? '💼 COTIZACIÓN' : '📩 CONTACTO';

    const data = await resend.emails.send({
      from: 'Web Proenergéticos <onboarding@resend.dev>',
      to: ['contactoproenergeticos@gmail.com'],
      reply_to: correo,
      subject: `${prefijoAsunto}: ${nombre}`,
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
                <p style="color: ${esCotizacion ? '#E30613' : '#3b82f6'}; font-size: 18px; font-weight: bold; margin: 0 0 25px 0;">${correo}</p>
                
                <div style="background-color: #f9fafb; border-left: 6px solid ${colorHeader}; padding: 25px; border-radius: 0 15px 15px 0; margin-top: 30px;">
                  <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">Detalles del Mensaje:</p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${mensaje}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
                  Origen: ${esCotizacion ? 'Sección Corporativa' : 'Formulario de Contacto'}
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}