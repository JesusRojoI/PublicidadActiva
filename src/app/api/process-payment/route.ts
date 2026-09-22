import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      cardName,
      cardNumber,
      cardExpiry,
      cvv,
      amount,
      firstName,
      lastName,
      email,
      address,
      address2,
      city,
      state,
      postalCode,
      phone,
      company,
    } = body;

    const API_URL = process.env.ETOMIN_BASE_URL || 'https://pagos.etomin.com/api/v1';
    const etominUser = process.env.ETOMIN_USER;
    const etominPassword = process.env.ETOMIN_PASSWORD;

    if (!etominUser || !etominPassword) {
      return NextResponse.json(
        { success: false, message: 'Configuración de pago incompleta' },
        { status: 500 }
      );
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ success: false, message: 'Monto inválido' }, { status: 400 });
    }

    // 1. Autenticación
    const authResponse = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: etominUser, password: etominPassword }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error de autenticación');
    }

    const authData = await authResponse.json();
    const authToken = authData.authToken;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Token no recibido' }, { status: 500 });
    }

    // 2. Tokenización
    const [month, year] = cardExpiry.split('/');
    const tokenResponse = await fetch(`${API_URL}/card/tokenizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        cardData: {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardholderName: cardName,
          expirationYear: '20' + year,
          expirationMonth: month,
        },
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al tokenizar la tarjeta');
    }

    const tokenData = await tokenResponse.json();
    const cardToken = tokenData.cardNumberToken;
    if (!cardToken) {
      return NextResponse.json(
        { success: false, message: 'No se pudo tokenizar la tarjeta' },
        { status: 400 }
      );
    }

    // 3. Venta
    const orderId = 'TXN-' + Date.now();
    const saleResponse = await fetch(`${API_URL}/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        amount: amountNum,
        currency: '484',
        reference: orderId,
        customerInformation: {
          firstName: (firstName || 'Cliente').trim(),
          lastName: (lastName || 'PublicidadActiva').trim(),
          middleName: '',
          email: (email || 'cliente@publicidadactiva.com.mx').trim(),
          phone1: (phone || '5555555555').trim(),
          address1: (address || 'Sin dirección').trim(),
          address2: (address2 || '').trim(),
          city: (city || 'Ciudad de México').trim(),
          state: (state || 'Ciudad de México').trim(),
          postalCode: (postalCode || '06500').trim(),
          country: 'MX',
          company: (company || '').trim(),
          ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
        },
        cardData: { cardNumberToken: cardToken, cvv },
      }),
    });

    const saleData = await saleResponse.json();

    if (saleData.status === 'APPROVED') {
      return NextResponse.json({
        success: true,
        transactionId: saleData.orderId || saleData.reference || orderId,
        reference: saleData.reference || orderId,
        status: saleData.status,
        message: 'Pago aprobado',
      });
    }

    return NextResponse.json(
      {
        success: false,
        status: saleData.status,
        message: saleData.message || 'Pago rechazado',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Payment error:', error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error procesando el pago' },
      { status: 500 }
    );
  }
}