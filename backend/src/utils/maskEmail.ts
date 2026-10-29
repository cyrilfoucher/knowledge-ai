export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.charAt(0)}*****@${domain}`;
}
