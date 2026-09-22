import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import es from '@/i18n/locales/es.json';
import en from '@/i18n/locales/en.json';

const dicts: Record<string, any> = { es, en };

function t(lang: string, path: string): string {
  const dict = dicts[lang] || dicts.es;
  const parts = path.split('.');
  let current: any = dict;
  for (const p of parts) {
    if (current == null) return path;
    current = current[p];
  }
  return typeof current === 'string' ? current : path;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, type, language = 'es', name, company, email, phone, message, orderData } = body;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const lang = language === 'en' ? 'en' : 'es';

    if (type === 'contact') {
      const adminEmail = process.env.ADMIN_EMAIL;

      const contactHTML = `
        <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;background-color:#f8fafc;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#a78bfa,#60a5fa);padding:30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">${t(lang, 'emails.contact.title')}</h1>
          </div>
          <div style="padding:30px;color:#1F2937;">
            <p style="font-size:16px;"><strong>${t(lang, 'emails.contact.labels.name')}</strong> ${name}</p>
            <p><strong>${t(lang, 'emails.contact.labels.company')}</strong> ${company || '-'}</p>
            <p><strong>${t(lang, 'emails.contact.labels.email')}</strong> ${email}</p>
            <p><strong>${t(lang, 'emails.contact.labels.phone')}</strong> ${phone}</p>
            <p><strong>${t(lang, 'emails.contact.labels.message')}</strong></p>
            <p style="background:#f1f5f9;padding:15px;border-radius:8px;">${message}</p>
          </div>
        </div>`;

      if (adminEmail) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'atencion@publicidadactiva.com.mx',
          to: adminEmail,
          subject: t(lang, 'emails.contact.adminSubject'),
          html: contactHTML,
        });
      }

      const clientHTML = `
        <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;background-color:#f8fafc;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#a78bfa,#60a5fa);padding:30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">${t(lang, 'emails.contact.received')}</h1>
          </div>
          <div style="padding:30px;color:#1F2937;">
            <p>${t(lang, 'emails.contact.hello')} <strong>${name}</strong>,</p>
            <p>${t(lang, 'emails.contact.receivedMessage')}</p>
            <p style="color:#6B7280;">PublicidadActiva - atencion@publicidadactiva.com.mx</p>
          </div>
        </div>`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'atencion@publicidadactiva.com.mx',
        to,
        subject: t(lang, 'emails.contact.subject'),
        html: clientHTML,
      });

      return NextResponse.json({ success: true });
    }

    if (type === 'purchase' && orderData) {
      const productosHTML = orderData.productos
        .map(
          (p: any) =>
            `<tr><td style="padding:8px;border-bottom:1px solid rgba(167,139,250,0.2);color:#1F2937;">${p.nombre} × ${p.cantidad}</td><td style="padding:8px;border-bottom:1px solid rgba(167,139,250,0.2);text-align:right;color:#7c3aed;">$${p.precio.toFixed(2)}</td></tr>`
        )
        .join('');

      const emailHTML = `
        <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;background-color:#f8fafc;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#a78bfa,#60a5fa);padding:30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">${t(lang, 'emails.purchase.title')}</h1>
          </div>
          <div style="padding:30px;color:#1F2937;">
            <p style="font-size:16px;">${t(lang, 'emails.purchase.hello')} <strong style="color:#7c3aed;">${orderData.nombre}</strong>,</p>
            <p>${t(lang, 'emails.purchase.processed')}</p>
            <h2 style="color:#1F2937;font-size:18px;border-bottom:2px solid #a78bfa;padding-bottom:8px;">${t(lang, 'emails.purchase.orderSummary')}</h2>
            <table style="width:100%;border-collapse:collapse;">${productosHTML}</table>
            <div style="margin-top:20px;padding:20px;background:#EDE9FE;border-radius:8px;border:1px solid rgba(167,139,250,0.2);">
              <p><strong>${t(lang, 'emails.purchase.subtotal')}</strong> <span style="color:#7c3aed;">$${orderData.subtotal.toFixed(2)}</span></p>
              ${orderData.descuento > 0 ? `<p><strong>${t(lang, 'emails.purchase.discount')}</strong> <span style="color:#EF4444;">-$${orderData.descuento.toFixed(2)}</span></p>` : ''}
              <p><strong>${t(lang, 'emails.purchase.tax')}</strong> <span style="color:#7c3aed;">$${orderData.impuesto.toFixed(2)}</span></p>
              <p style="font-size:18px;"><strong>${t(lang, 'emails.purchase.total')}</strong> <span style="color:#7c3aed;">$${orderData.total.toFixed(2)} <span style="font-size:14px;">MXN</span></span></p>
              ${orderData.cupon ? `<p><strong>${t(lang, 'emails.purchase.couponUsed')}</strong> ${orderData.cupon}</p>` : ''}
            </div>
            <p style="color:#6B7280;"><strong>${t(lang, 'emails.purchase.transaction')}</strong> ${orderData.transactionId}</p>
            <p>${t(lang, 'emails.purchase.thanks')} <strong style="color:#7c3aed;">PublicidadActiva</strong>.</p>
          </div>
          <div style="background:#EDE9FE;padding:20px;text-align:center;border-top:1px solid rgba(167,139,250,0.1);">
            <p style="color:#6B7280;font-size:12px;margin:0;">PublicidadActiva - atencion@publicidadactiva.com.mx</p>
          </div>
        </div>`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'atencion@publicidadactiva.com.mx',
        to,
        subject: t(lang, 'emails.purchase.subject'),
        html: emailHTML,
      });

      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'atencion@publicidadactiva.com.mx',
          to: adminEmail,
          subject: `${t(lang, 'emails.purchase.adminSubject')} - ${orderData.nombre}`,
          html: `<div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;"><div style="background:#7c3aed;padding:20px;"><h2 style="color:#ffffff;margin:0;">${t(lang, 'emails.purchase.newPurchase')}</h2></div><div style="padding:20px;"><p><strong>${t(lang, 'emails.purchase.customer')}</strong> ${orderData.nombre}</p><p><strong>Total:</strong> <span style="color:#7c3aed;">$${orderData.total.toFixed(2)} MXN</span></p></div>${emailHTML}</div>`,
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}