function validatePasswordStrength(password) {
  const errors = [];
  if (typeof password !== 'string') errors.push('Le mot de passe est requis.');
  const value = typeof password === 'string' ? password : '';
  if (value.length < 10) errors.push('Le mot de passe doit contenir au moins 10 caractères.');
  if (!/[A-Z]/.test(value)) errors.push('Le mot de passe doit contenir au moins une majuscule.');
  if (!/[a-z]/.test(value)) errors.push('Le mot de passe doit contenir au moins une minuscule.');
  if (!/[0-9]/.test(value)) errors.push('Le mot de passe doit contenir au moins un chiffre.');
  if (!/[^A-Za-z0-9]/.test(value)) errors.push('Le mot de passe doit contenir au moins un caractère spécial.');
  return { valid: errors.length === 0, errors, message: errors.join(' ') };
}
module.exports = { validatePasswordStrength };
