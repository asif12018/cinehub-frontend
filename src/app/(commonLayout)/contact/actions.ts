"use server"

export async function sendEmailAction(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  // Ideally, service and template IDs should be in .env as well.
  const serviceId = process.env.EMAILJS_SERVICE_ID || "service_placeholder";
  const templateId = process.env.EMAILJS_TEMPLATE_ID || "template_placeholder";
  
  // The user provided EMAILJS_PRIVATE_KEY in .env, which in EmailJS is usually the Public Key used for REST API
  const publicKey = process.env.EMAILJS_PRIVATE_KEY; 

  if (!publicKey) {
    return { success: false, error: "Email configuration is missing." };
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: `${firstName} ${lastName}`,
          from_email: email,
          subject: subject,
          message: message,
          reply_to: email,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `EmailJS Error: ${text}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred." };
  }
}
