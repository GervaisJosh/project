export function generatePartyCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export function isValidPartyCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}