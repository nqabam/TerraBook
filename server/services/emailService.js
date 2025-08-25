import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEventSubmissionEmail = async (event) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: event.email,
      subject: 'TerraBook - Event Submission Received',
      html: `
        <h2>Thank you for submitting your event!</h2>
        <p>We've received your event "${event.eventName}" and our team will review it within 3 business days.</p>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li>Event: ${event.eventName}</li>
          <li>Organizer: ${event.organizer}</li>
          <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
          <li>Location: ${event.location}</li>
        </ul>
        <p>You'll receive another email once your event has been reviewed.</p>
        <br>
        <p>Best regards,<br>The TerraBook Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Event submission email sent successfully to:', event.email);
  } catch (error) {
    console.error('Error sending event submission email:', error);
    // Don't throw the error to avoid breaking the main functionality
  }
};

export const sendEventApprovalEmail = async (event) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: event.email,
      subject: 'TerraBook - Event Approved!',
      html: `
        <h2>Great news! Your event has been approved!</h2>
        <p>Your event "${event.eventName}" has been approved and is now live on TerraBook.</p>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li>Event: ${event.eventName}</li>
          <li>Organizer: ${event.organizer}</li>
          <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
          <li>Location: ${event.location}</li>
        </ul>
        <p>Travelers can now discover and register for your event through our platform.</p>
        <br>
        <p>Best regards,<br>The TerraBook Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Event approval email sent successfully to:', event.email);
  } catch (error) {
    console.error('Error sending event approval email:', error);
    // Don't throw the error to avoid breaking the main functionality
  }
};

// Optional: Add email verification function
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('Email transporter is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
};