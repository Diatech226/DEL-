const SECRET_FIELDS = ['passwordHash', 'password', 'resetToken', 'resetTokenExpires', '__v'];
function sanitizeUser(user) {
  if (!user) return user;
  const source = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  const ret = { ...source };
  if (ret._id && !ret.id) ret.id = String(ret._id);
  SECRET_FIELDS.forEach((field) => delete ret[field]);
  return ret;
}
module.exports = { sanitizeUser };
