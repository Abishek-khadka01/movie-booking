import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp.gmail.com", // FIXED
  port: 587,
  secure: false,
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

// Adjust the message type
interface TicketMessage {
  movieName: string;
  movieDate: string;
  movieTime: string;
  seats: string; // e.g., "A1, A2, A3"
  ticketPrice: number;
  quantity: number;
  totalAmount: number;
}

export const SendMail = async (
  to: string,
  subject: string,
  message: TicketMessage
) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Movie Ticket Invoice</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
  .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
  .header { text-align: center; padding-bottom: 20px; }
  .header h1 { margin: 0; color: #333; }
  .invoice-details { margin: 20px 0; }
  .invoice-details table { width: 100%; border-collapse: collapse; }
  .invoice-details th, .invoice-details td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
  .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
  .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Movie Tickets - Payment Receipt</h1>
    <p>Thank you for your purchase!</p>
  </div>
  
  <div class="invoice-details">
    <table>
      <tr>
        <th>Movie</th>
        <td>${message.movieName}</td>
      </tr>
      <tr>
        <th>Date</th>
        <td>${message.movieDate}</td>
      </tr>
      <tr>
        <th>Time</th>
        <td>${message.movieTime}</td>
      </tr>
      <tr>
        <th>Seats</th>
        <td>${message.seats}</td>
      </tr>
      <tr>
        <th>Ticket Price</th>
        <td>$${message.ticketPrice}</td>
      </tr>
      <tr>
        <th>Quantity</th>
        <td>${message.quantity}</td>
      </tr>
    </table>

    <div class="total">
      Total Paid: $${message.totalAmount}
    </div>
  </div>

  <div class="footer">
    <p>This is an automated receipt. If you have any questions, please contact our support team.</p>
  </div>
</div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: "maddison53@ethereal.email", // or your env var if set properly
    to,
    subject,
    html: htmlContent,
  });
};
