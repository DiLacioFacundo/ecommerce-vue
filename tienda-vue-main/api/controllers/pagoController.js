const { MercadoPagoConfig, Payment } = require("mercadopago");

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // Asegurate que esté definido en tu .env
});

const procesar_pago_brick = async (req, res) => {
  try {
    const { transaction_amount, token, payment_method_id, installments, payer } = req.body;

    // Validaciones básicas
    if (!transaction_amount || !token || !payment_method_id || !payer?.email) {
      return res.status(400).json({ message: "Faltan datos obligatorios para procesar el pago." });
    }

    const payment = new Payment(mercadopago);

    const result = await payment.create({
      body: {
        transaction_amount,
        token,
        payment_method_id,
        installments,
        payer: {
          email: payer.email,
          first_name: payer.first_name || "",
          last_name: payer.last_name || "",
        },
      },
    });

    res.status(200).json({
      id: result.id, 
      status: result.status,
      status_detail: result.status_detail,
    });

  } catch (error) {
    console.error("❌ Error al procesar el pago:", error);
    res.status(500).json({
      message: "Error al procesar el pago",
      error: error.message || "Error desconocido",
    });
  }
};

module.exports = { procesar_pago_brick };
