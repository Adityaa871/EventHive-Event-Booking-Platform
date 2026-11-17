const PDFDocument = require('pdfkit');

/**
 * Generate a clean, branded PDF invoice document for a booking.
 * Returns a Promise that resolves with a Buffer.
 */
const generateInvoicePDF = (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
      });

      const buffers = [];
      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#18181b';
      const secondaryColor = '#52525b';
      const accentColor = '#2563eb';
      const borderColor = '#e4e4e7';

      // ── Header ──────────────────────────────────────────────
      doc
        .fillColor(primaryColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('EventHive', 50, 50)
        .fontSize(10)
        .font('Helvetica')
        .fillColor(secondaryColor)
        .text('Premium Event Planning & Management', 50, 75)
        .text('concierge@eventhive.com | +91 98765 43210', 50, 88);

      doc
        .fillColor(primaryColor)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('BOOKING INVOICE', 350, 50, { align: 'right' })
        .fontSize(9)
        .font('Helvetica')
        .fillColor(secondaryColor)
        .text(`Invoice No: ${booking.invoiceNumber || 'INV-' + booking._id.toString().slice(-6).toUpperCase()}`, 350, 75, { align: 'right' })
        .text(`Issue Date: ${new Date(booking.invoiceIssuedAt || booking.createdAt).toLocaleDateString('en-IN')}`, 350, 88, { align: 'right' })
        .text(`Status: ${booking.status.toUpperCase()}`, 350, 101, { align: 'right' });

      // Divider line
      doc
        .strokeColor(borderColor)
        .lineWidth(1)
        .moveTo(50, 125)
        .lineTo(545, 125)
        .stroke();

      // ── Client & Event Meta ──────────────────────────────────
      const startY = 145;

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(primaryColor)
        .text('BILLED TO:', 50, startY)
        .font('Helvetica')
        .fontSize(10)
        .fillColor(secondaryColor)
        .text(booking.name, 50, startY + 16)
        .text(booking.email, 50, startY + 30)
        .text(booking.phone || '—', 50, startY + 44);

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(primaryColor)
        .text('EVENT SPECIFICATIONS:', 300, startY)
        .font('Helvetica')
        .fontSize(10)
        .fillColor(secondaryColor)
        .text(`Occasion: ${booking.eventType.toUpperCase()}`, 300, startY + 16)
        .text(`Target Date: ${new Date(booking.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 300, startY + 30)
        .text(`Guest Capacity: ${booking.guestCount} Attendees`, 300, startY + 44)
        .text(`Venue: ${booking.venue || 'Client Location'}`, 300, startY + 58);

      // Divider line
      doc
        .strokeColor(borderColor)
        .lineWidth(1)
        .moveTo(50, 225)
        .lineTo(545, 225)
        .stroke();

      // ── Table Header ─────────────────────────────────────────
      const tableTop = 240;
      doc
        .rect(50, tableTop, 495, 24)
        .fill('#f4f4f5');

      doc
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .fontSize(9)
        .text('ITEM DESCRIPTION', 60, tableTop + 7)
        .text('CATEGORY', 260, tableTop + 7)
        .text('QTY', 370, tableTop + 7)
        .text('AMOUNT (INR)', 430, tableTop + 7, { align: 'right' });

      // ── Table Item ───────────────────────────────────────────
      const itemY = tableTop + 35;
      const packageTitle = booking.package?.title || booking.packageName || 'Custom Event Service Package';
      const packageCategory = booking.package?.category || booking.eventType;
      const originalPrice = booking.priceDetails?.originalPrice || booking.budget || (booking.package?.price || 0);

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(primaryColor)
        .text(packageTitle, 60, itemY)
        .font('Helvetica')
        .fontSize(9)
        .fillColor(secondaryColor)
        .text(packageCategory.toUpperCase(), 260, itemY)
        .text('1', 370, itemY)
        .text(`Rs. ${originalPrice.toLocaleString('en-IN')}`, 430, itemY, { align: 'right' });

      doc
        .strokeColor(borderColor)
        .lineWidth(0.5)
        .moveTo(50, itemY + 25)
        .lineTo(545, itemY + 25)
        .stroke();

      // ── Totals ───────────────────────────────────────────────
      const totalsY = itemY + 45;
      const discount = booking.priceDetails?.discountAmount || 0;
      const finalPrice = booking.priceDetails?.finalPrice || (originalPrice - discount);

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(secondaryColor)
        .text('Subtotal:', 350, totalsY, { align: 'right', width: 100 })
        .text(`Rs. ${originalPrice.toLocaleString('en-IN')}`, 460, totalsY, { align: 'right', width: 85 });

      if (discount > 0) {
        doc
          .text(`Discount (${booking.priceDetails?.couponCode || 'Promotional'}):`, 320, totalsY + 16, { align: 'right', width: 130 })
          .fillColor('#15803d')
          .text(`- Rs. ${discount.toLocaleString('en-IN')}`, 460, totalsY + 16, { align: 'right', width: 85 });
      }

      const totalRowY = discount > 0 ? totalsY + 34 : totalsY + 20;

      doc
        .strokeColor(primaryColor)
        .lineWidth(1)
        .moveTo(350, totalRowY)
        .lineTo(545, totalRowY)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor(primaryColor)
        .text('Total Booking Amount:', 320, totalRowY + 8, { align: 'right', width: 130 })
        .text(`Rs. ${finalPrice.toLocaleString('en-IN')}`, 460, totalRowY + 8, { align: 'right', width: 85 });

      // ── Notes & Terms ────────────────────────────────────────
      const notesY = 460;
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(primaryColor)
        .text('TERMS & CONDITIONS', 50, notesY)
        .font('Helvetica')
        .fontSize(8)
        .fillColor(secondaryColor)
        .text('1. This invoice is a verified booking voucher issued upon event request confirmation.', 50, notesY + 14)
        .text('2. Rescheduling requests must be submitted at least 7 business days prior to the target event date.', 50, notesY + 26)
        .text('3. Cancellations are subject to administrative review and venue availability constraints.', 50, notesY + 38)
        .text('4. For any questions regarding your reservation, reach out to concierge@eventhive.com.', 50, notesY + 50);

      // Footer branding
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#a1a1aa')
        .text('Thank you for entrusting your celebration to EventHive. Crafted with excellence.', 50, 740, { align: 'center', width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateInvoicePDF };
