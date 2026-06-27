function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

async function sendEmail(apiKey, email) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "Email provider failed";
    throw new Error(message);
  }
  return body;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || "StudioFlow <onboarding@resend.dev>";

  // Keep bookings working even before email is configured in Vercel.
  if (!apiKey || !adminEmail) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const booking = parseBody(req);
  const studentName = escapeHtml(booking.studentName || "New student");
  const studentEmail = String(booking.studentEmail || "");
  const studentPhone = escapeHtml(booking.studentPhone || "Not provided");
  const className = escapeHtml(booking.className || "Class request");
  const classSchedule = escapeHtml(booking.classSchedule || "Schedule in class listing");
  const classLocation = escapeHtml(booking.classLocation || "Location in class listing");
  const notes = escapeHtml(booking.notes || "No notes");
  const venmoHandle = escapeHtml(booking.venmoHandle || "");
  const price = escapeHtml(booking.price ? `$${booking.price}` : "See class listing");

  const adminHtml = `
    <h2>New Happy Feet booking request</h2>
    <p><strong>Student:</strong> ${studentName}</p>
    <p><strong>Email:</strong> ${escapeHtml(studentEmail)}</p>
    <p><strong>Phone:</strong> ${studentPhone}</p>
    <p><strong>Class:</strong> ${className}</p>
    <p><strong>Schedule:</strong> ${classSchedule}</p>
    <p><strong>Location:</strong> ${classLocation}</p>
    <p><strong>Price:</strong> ${price}</p>
    <p><strong>Notes:</strong> ${notes}</p>
  `;

  const studentHtml = `
    <h2>We received your Happy Feet request</h2>
    <p>Hi ${studentName},</p>
    <p>Thanks for requesting a spot in <strong>${className}</strong>.</p>
    <p>The studio will confirm your spot, payment, and final details directly.</p>
    <p><strong>Class:</strong> ${className}<br />
    <strong>Schedule:</strong> ${classSchedule}<br />
    <strong>Location:</strong> ${classLocation}<br />
    <strong>Payment:</strong> ${price}${venmoHandle ? ` via Venmo @${venmoHandle}` : ""}</p>
  `;

  try {
    await sendEmail(apiKey, {
      from: fromEmail,
      to: [adminEmail],
      subject: `New booking request: ${className}`,
      html: adminHtml,
    });

    if (studentEmail.includes("@")) {
      await sendEmail(apiKey, {
        from: fromEmail,
        to: [studentEmail],
        subject: `Happy Feet received your booking request`,
        html: studentHtml,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error instanceof Error ? error.message : "Could not send email",
    });
  }
};
