import { resend, emailFrom } from "@/lib/resend";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Reusable CSS styling block for clean visual layout across email clients
const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; color: #18181b; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .logo { font-size: 18px; font-weight: bold; color: #18181b; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
  h1 { font-size: 22px; font-weight: 800; line-height: 1.25; margin-top: 0; margin-bottom: 16px; }
  p { font-size: 14px; line-height: 1.6; color: #52525b; margin-top: 0; margin-bottom: 16px; }
  .btn { display: inline-block; background-color: #18181b; color: #ffffff !important; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 12px; margin: 16px 0; }
  .footer { margin-top: 32px; border-t: 1px solid #e4e4e7; padding-top: 24px; text-align: center; }
  .footer-text { font-size: 11px; color: #a1a1aa; line-height: 1.5; margin: 0; }
  .footer-link { color: #71717a; text-decoration: underline; margin: 0 8px; }
  .cover-image { width: 100%; border-radius: 12px; margin-bottom: 20px; }
`;

/**
 * Returns unsubscribe footer HTML string
 */
function getUnsubscribeFooter(token: string): string {
  return `
    <div class="footer">
      <p class="footer-text">
        You are receiving this because you subscribed to updates on LogBook.
      </p>
      <p class="footer-text" style="margin-top: 8px;">
        <a href="${siteUrl}/unsubscribe/${token}" class="footer-link">Unsubscribe</a>
      </p>
    </div>
  `;
}

/**
 * Sends a Welcome email to a new subscriber.
 */
export async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="logo">LogBook</div>
            <h1>Welcome to the LogBook newsletter!</h1>
            <p>Thanks for subscribing. From now on, you'll be the first to receive notifications about programming notes, web development tutorials, design insights, and article announcements directly in your inbox.</p>
            <p>If you'd like to check out our latest publications immediately, click the button below to visit our blog.</p>
            <a href="${siteUrl}/blog" class="btn" target="_blank">Browse Latest Articles</a>
            <p>Best regards,<br/>The LogBook Team</p>
            ${getUnsubscribeFooter(unsubscribeToken)}
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: "Welcome to LogBook! 🚀",
      html: htmlContent,
    });
  } catch (err) {
    console.error(`Failed to send Welcome email to ${email}:`, err);
  }
}

/**
 * Sends notification about a new post to all active subscribers.
 */
export async function sendNewPostNotification(
  subscribers: { email: string; unsubscribeToken: string }[],
  post: { title: string; excerpt: string | null; slug: string; coverImage: string | null }
) {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  
  for (const sub of subscribers) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${emailStyles}</style>
          </head>
          <body>
            <div class="container">
              <div class="logo">LogBook Notification</div>
              ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" class="cover-image" />` : ""}
              <h1>New Post: ${post.title}</h1>
              ${post.excerpt ? `<p>${post.excerpt}</p>` : "<p>We just published a new article on LogBook! Click below to read the full post.</p>"}
              <a href="${postUrl}" class="btn" target="_blank">Read Article</a>
              <p>Best regards,<br/>The LogBook Team</p>
              ${getUnsubscribeFooter(sub.unsubscribeToken)}
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: emailFrom,
        to: sub.email,
        subject: `New on LogBook: ${post.title} 📢`,
        html: htmlContent,
      });
    } catch (err) {
      console.error(`Failed to send new post email to ${sub.email}:`, err);
    }
  }
}

/**
 * Sends custom announcement newsletter.
 */
export async function sendAnnouncementEmail(
  subscribers: { email: string; unsubscribeToken: string }[],
  subject: string,
  contentHtml: string
) {
  for (const sub of subscribers) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${emailStyles}</style>
          </head>
          <body>
            <div class="container">
              <div class="logo">LogBook Newsletter</div>
              ${contentHtml}
              ${getUnsubscribeFooter(sub.unsubscribeToken)}
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: emailFrom,
        to: sub.email,
        subject: subject,
        html: htmlContent,
      });
    } catch (err) {
      console.error(`Failed to send custom newsletter to ${sub.email}:`, err);
    }
  }
}
