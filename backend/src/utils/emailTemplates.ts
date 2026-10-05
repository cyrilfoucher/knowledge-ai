export function resetPasswordEmail(resetLink: string) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;font-family:Inter,Arial,sans-serif;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;padding:32px;">
          <tr>
            <td>
              <p style="margin:0 0 24px;font-size:20px;font-weight:600;color:#0F172A;">DevKnowledge</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#0F172A;">Tu as demandé à réinitialiser ton mot de passe.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">Clique sur le bouton ci-dessous pour en choisir un nouveau. Ce lien expire dans 30 minutes.</p>
              <a href="${resetLink}" style="display:inline-block;background:#0D9488;color:#FFFFFF;text-decoration:none;font-size:15px;padding:12px 24px;border-radius:8px;">Réinitialiser mon mot de passe</a>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#475569;">Si tu n'es pas à l'origine de cette demande, ignore cet email : ton mot de passe ne changera pas.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
}

export function welcomeEmail(name: string, appLink: string) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;font-family:Inter,Arial,sans-serif;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;padding:32px;">
          <tr>
            <td>
              <p style="margin:0 0 24px;font-size:20px;font-weight:600;color:#0F172A;">DevKnowledge</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#0F172A;">Bienvenue ${name} !</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">Ton compte est créé. Tu peux dès maintenant enregistrer tes connaissances techniques : notes, extraits de code, solutions à retrouver plus tard.</p>
              <a href="${appLink}" style="display:inline-block;background:#0D9488;color:#FFFFFF;text-decoration:none;font-size:15px;padding:12px 24px;border-radius:8px;">Accéder à DevKnowledge</a>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#475569;">Si tu n'es pas à l'origine de cette inscription, tu peux ignorer cet email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
}
