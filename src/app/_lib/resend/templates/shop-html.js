import 'server-only';

export default function Template(id) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          width: 80%;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #21643f;
          color: #ffffff;
          padding: 10px 0;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
        }
        .order-info {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
        .order-info h2 {
          margin-top: 0;
        }
        .product-list {
          margin: 20px 0;
        }
        .product-item {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
          padding: 10px 0;
        }
        .product-item img {
          max-width: 100px;
          margin-right: 10px;
          border-radius: 4px;
        }
        .product-item h3 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }
        .product-item p {
          margin: 5px 0 0;
          color: #666;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0;
          text-align: right;
          color: #21643f;
        }
        .footer {
          text-align: center;
          padding: 10px 0;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Recibimos tu pago!</h1>
        </div>
        <p>Enhorabuena hemos recibido tu pago por con referencia: ${id}</p>
        <p>Seguiremos en contacto proximamente para que puedas recibir tu producto.</p>
        
        <div class="footer">
          <p>Gracias por tu compra. </p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
      </ddiv>
    </body>
  </html>
  `;
}
