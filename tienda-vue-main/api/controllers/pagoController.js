const { MercadoPagoConfig, Payment } = require("mercadopago");

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const procesar_pago_brick = async (req, res) => {
  try {
    const payment = new Payment(mercadopago);

    const result = await payment.create({
      body: {
        transaction_amount: req.body.transaction_amount,
        token: req.body.token,
        payment_method_id: req.body.payment_method_id,
        installments: req.body.installments,
        payer: {
          email: req.body.payer.email,
        },
      },
    });

    console.log("✅ Pago procesado:", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("❌ Error al procesar el pago:", error.message);
    res.status(500).send({
      message: "Error al procesar el pago",
      error: error.message,
    });
  }
};

module.exports = { procesar_pago_brick };
