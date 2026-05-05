import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nombre, correo, mensaje } = await req.json();

    const data = await resend.emails.send({
      from: 'Proenergeticos <onboarding@resend.dev>',
      to: ['impulso.digital.mzt@gmail.com'],
      subject: `Nueva Cotización: ${nombre}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #E30613; border-radius: 12px;">
          <h2 style="color: #E30613;">SOLICITUD DE COTIZACIÓN</h2>
          <p><strong>Empresa/Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${correo}</p>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${mensaje}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error en API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}