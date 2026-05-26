import { sendEmail, sender } from './mailtrapConfig.js';
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_MAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  APPOINTMENT_CONFIRMATION_TEMPLATE,
  WELCOME_DOCTOR_TEMPLATE,
  PAYMENT_RECEIPT_TEMPLATE,
  BLOOD_REQUEST_ALERT_TEMPLATE,
  BLOOD_DONOR_REGISTRATION_TEMPLATE,
  DONOR_ACCEPTED_EMAIL_TEMPLATE,
} from './emailTemplates.js'; // Import email templates

/// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await sendEmail({
      sender,
      to: recipient,
      subject: "Verify Your Email",
      htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      textContent: `Your verification code is: ${verificationToken}`, // Fallback
      category: ["Email Verification"],
    });
    console.log("Email sent successfully",  response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error in sending verification email: ${error.message}`);
  }
};
export const sendWelcomeDoctorEmail = async (email, name, password) => {
  const recipient = [{ email }];
  
  try {
    const response = await sendEmail({
      sender,
      to: recipient,
      subject: "Welcome to Medislot!",
      htmlContent: WELCOME_DOCTOR_TEMPLATE(name, email, password),
      textContent: `Welcome, ${name}! Your login details:\nEmail: ${email}\nPassword: ${password}`,
      category: ["Welcome Email"],
    });

    console.log("✅ Welcome email sent successfully:", response);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw new Error(`Error in sending welcome email: ${error.message}`);
  }
};


/// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await sendEmail({
      sender,
      to: recipient,
      subject: "Welcome to Medislot",
      htmlContent: WELCOME_MAIL_TEMPLATE(name),
      textContent: `Welcome, ${name}!`, // Fallback
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(`Error in sending welcome email: ${error.message}`);
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await sendEmail({
      sender,
      to: recipient,
      subject: "Reset Your Password",
      htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      textContent: `Click the link to reset your password: ${resetURL}`, // Fallback
      category: ["Password Reset"],
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error in sending password reset email: ${error.message}`);
  }
};

/// Send Password Reset Success Email
export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await sendEmail({
      sender,
      to: recipient,
      subject: "Password Reset Successful",
      htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE,
      textContent: "Your password has been successfully reset.", // Fallback
      category: ["Password Reset"],
    });
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error(`Error sending password reset success email: ${error.message}`);
  }
};

/// Send Appointment Confirmation Email
export const sendAppointmentConfirmationEmail = async (email, userName, docName, slotDate, slotTime, amount) => {
  const recipient = [{ email }];
  try {
    const htmlContent = APPOINTMENT_CONFIRMATION_TEMPLATE
      .replace("{userName}", userName)
      .replace("{docName}", docName)
      .replace("{slotDate}", slotDate)
      .replace("{slotTime}", slotTime)
      .replace("{amount}", amount);

    const textContent = `Hello ${userName}, your appointment with Dr. ${docName} is confirmed for ${slotDate} at ${slotTime}. Amount: ${amount}`;

    const response = await sendEmail({
      sender,
      to: recipient,
      subject: "Your Appointment is Confirmed",
      htmlContent,
      textContent, // Fallback for non-HTML clients
    });
    console.log("Appointment confirmation email sent successfully:", response);
  } catch (error) {
    console.error("❌ Error sending verification email:", error.response?.data || error.message);
    throw new Error(`Error in sending verification email: ${error.message}`);
  }
};

// export const sendPaymentReceiptEmail = async (email, name, amount, status, paymentId) => {
//   try {
//     // Validate inputs before sending
//     if (!email || !name || !amount || !status || !paymentId) {
//       console.error("❌ Missing required email parameters:", { email, name, amount, status, paymentId });
//       throw new Error("Missing required email parameters.");
//     }

//     const recipient = [{ email }];
//     const subject = status === "Success" ? "Payment Successful - Receipt" : "Payment Failed - Alert";

//     // Generate HTML content from the template
//     const htmlContent = PAYMENT_RECEIPT_TEMPLATE(name, amount, status, paymentId);
//     if (!htmlContent) {
//       console.error("❌ Payment receipt template is empty or invalid!");
//       throw new Error("Failed to generate email template.");
//     }

//     // Log generated email content for debugging
//     console.log("📩 Sending payment receipt email with:", { email, name, amount, status, paymentId });
//     console.log("Generated HTML Content:", htmlContent);

//     // Send email
//     const response = await sendEmail({
//       sender,
//       to: recipient,
//       subject,
//       htmlContent,
//       textContent: `Hello ${name},\nYour payment of ₹${amount} was ${status}.\nPayment ID: ${paymentId}\nThank you!`,
//     });

//     console.log("✅ Payment receipt email sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("❌ Error sending payment receipt email:", error.response?.data || error.message);
//     throw new Error(`Error in sending payment receipt email: ${error.message}`);
//   }
// };

export const sendPaymentReceiptEmail = async (
  email, name, amount, status, paymentId, doctorName, doctorSpeciality, clinicAddress, appointmentDate, appointmentTime, paymentDate, paymentTime
) => {
  try {
    if (!email || !name || !amount || !status || !paymentId || !doctorName || !appointmentDate || !appointmentTime || !paymentDate || !paymentTime) {
      console.error("❌ Missing required email parameters!");
      throw new Error("Missing required email parameters.");
    }

    const subject = status === "Success" ? "Payment Successful - Receipt" : "Payment Failed - Alert";

    const htmlContent = PAYMENT_RECEIPT_TEMPLATE(
      name, amount, paymentId, doctorName, doctorSpeciality, clinicAddress, appointmentDate, appointmentTime, paymentDate, paymentTime
    );
    
    console.log("📩 Sending payment receipt email to:", email);
    
    await sendEmail({
      sender,
      to: [{ email }],
      subject,
      htmlContent,
      textContent: `Hello ${name},\nYour payment of ₹${amount} was ${status}.\nDoctor: ${doctorName} (${doctorSpeciality})\nAppointment: ${appointmentDate} at ${appointmentTime}\nClinic: ${clinicAddress}\nPayment ID: ${paymentId}\nThank you!`
    });

    console.log("✅ Payment receipt email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(`Error in sending email: ${error.message}`);
  }
};




// ─── Blood Donation Emails ───────────────────────────────────────────────────

export const sendBloodRequestAlertEmail = async (
  email, donorName, requiredBloodGroup, patientName,
  contactNumber, locationName, urgency, distanceKm, latitude, longitude
) => {
  if (!email) throw new Error('Recipient email is empty');
  const urgencyLabel = urgency === 'emergency' ? 'EMERGENCY' : urgency === 'urgent' ? 'Urgent' : 'Normal';
  const subject = `[${urgencyLabel}] ${requiredBloodGroup} blood needed near you — Medislot`;
  console.log(`[Email] Calling Brevo for blood alert → ${email}, subject: "${subject}"`);
  try {
    await sendEmail({
      sender,
      to: [{ email }],
      subject,
      htmlContent: BLOOD_REQUEST_ALERT_TEMPLATE(donorName, requiredBloodGroup, patientName, contactNumber, locationName, urgency, distanceKm, latitude, longitude),
      textContent: `Hello ${donorName}, ${urgencyLabel} blood request: ${requiredBloodGroup} needed for ${patientName} near ${locationName} (${distanceKm}km). Contact: ${contactNumber}`,
    });
    console.log(`✅ Blood alert email delivered to ${email}`);
  } catch (error) {
    console.error('❌ Brevo error (blood alert):', error.response?.data || error.message);
    throw new Error(`Error sending blood alert email: ${error.message}`);
  }
};

export const sendDonorAcceptedEmail = async (email, requestorName, donorName, donorBloodGroup, patientName, contactNumber) => {
  if (!email) throw new Error('Recipient email is empty');
  const subject = `Donor Found: ${donorName} (${donorBloodGroup}) agreed to donate — Medislot`;
  console.log(`[Email] Calling Brevo for donor-accepted → ${email}, subject: "${subject}"`);
  try {
    await sendEmail({
      sender,
      to: [{ email }],
      subject,
      htmlContent: DONOR_ACCEPTED_EMAIL_TEMPLATE(requestorName, donorName, donorBloodGroup, patientName, contactNumber),
      textContent: `Hello ${requestorName}, ${donorName} (${donorBloodGroup}) has accepted your blood request for ${patientName}. Contact: ${contactNumber}`,
    });
    console.log(`✅ Donor-accepted email delivered to ${email}`);
  } catch (error) {
    console.error('❌ Brevo error (donor-accepted):', error.response?.data || error.message);
    throw new Error(`Error sending donor-accepted email: ${error.message}`);
  }
};

export const sendBloodDonorRegistrationEmail = async (email, donorName, bloodGroup) => {
  console.log(`[Email] Calling Brevo for donor registration → ${email}`);
  try {
    await sendEmail({
      sender,
      to: [{ email }],
      subject: `You are now a ${bloodGroup} Blood Donor — Medislot`,
      htmlContent: BLOOD_DONOR_REGISTRATION_TEMPLATE(donorName, bloodGroup),
      textContent: `Hello ${donorName}, you have successfully registered as a ${bloodGroup} blood donor on Medislot. Thank you for saving lives!`,
    });
    console.log(`✅ Donor registration email delivered to ${email}`);
  } catch (error) {
    console.error('❌ Brevo error (donor registration):', error.response?.data || error.message);
    throw new Error(`Error sending donor registration email: ${error.message}`);
  }
};
