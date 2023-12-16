async function sendVerificationEmail(userEmail, verificationLink) {
  try {
    console.log("Sending verification email to:", userEmail);

    const headers = {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`, // Replace with your Resend API key
      "Content-Type": "application/json",
    };

    const emailData = {
      from: "noreply@resend.dev",
      to: [userEmail],
      subject: "Please verify your email address",
      html: `
        <p>Please click the following link to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      console.log("Verification email sent successfully to:", userEmail);
    } else {
      const responseData = await response.json();
      console.log(
        "Error sending verification email to:",
        userEmail,
        responseData
      );
      throw new Error(`Email sending failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; // Rethrow the error to handle it in your controller
  }
}

module.exports = sendVerificationEmail;
