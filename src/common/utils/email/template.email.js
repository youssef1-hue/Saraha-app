import { APPKICATION_NAME } from "../../../../config/config.service.js"

export const emailTemplate = ({ code, title } = {}) => {
  const hasCode = code !== undefined && code !== null
    return `
<div style="background:#f6f9fc;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
  <table align="center" width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08)">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:30px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:26px;">${APPKICATION_NAME}</h1>
        <p style="margin:8px 0 0;font-size:14px;opacity:.9">
          Modern Web Platform
        </p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:40px 35px;text-align:center">
        <h2 style="margin-top:0;color:#111;font-size:24px">
          ${title ? title : `Welcome to ${APPKICATION_NAME} 👋`}
        </h2>
        <p style="color:#555;font-size:16px;line-height:1.6;margin-top:15px">
          ${hasCode ? `Your OTP code is: <b style='font-size:22px;letter-spacing:2px;'>${code}</b>` : `We're excited to have you on board. Your account has been successfully created and you're ready to start exploring everything we have to offer.`}
        </p>
      </td>
    </tr>
    <!-- Divider -->
    <tr>
      <td style="padding:0 35px">
        <hr style="border:none;border-top:1px solid #eee">
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding:25px 35px;text-align:center;color:#777;font-size:13px">
        <p style="margin:0 0 10px">
          Need help? Contact our support team anytime.
        </p>
        <p style="margin:0">
          © 2026 ${APPKICATION_NAME} — All rights reserved
        </p>
      </td>
    </tr>
  </table>
</div>
`
}