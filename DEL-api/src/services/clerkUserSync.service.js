const User = require('../models/User');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
let clerkClient;
function getClerkClient() {
  if (!process.env.CLERK_SECRET_KEY) throw new Error('CLERK_SECRET_KEY est obligatoire pour l’authentification Clerk.');
  if (!clerkClient) {
    const { createClerkClient } = require('@clerk/backend');
    clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  }
  return clerkClient;
}
function primaryEmail(clerkUser) {
  const primaryId = clerkUser.primaryEmailAddressId;
  const email = clerkUser.emailAddresses?.find((item) => item.id === primaryId)?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
  return normalizeEmail(email);
}
function fullName(clerkUser, email) {
  return [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() || clerkUser.fullName || email;
}
async function syncClerkUser(clerkUserId) {
  const clerkUser = await getClerkClient().users.getUser(clerkUserId);
  const email = primaryEmail(clerkUser);
  if (!email) throw new Error('Aucun email principal Clerk disponible pour synchroniser l’utilisateur DEL.');

  let user = await User.findOne({ clerkUserId });
  if (!user) user = await User.findOne({ email });

  if (user) {
    user.clerkUserId = user.clerkUserId || clerkUserId;
    user.authProvider = user.authProvider === 'LOCAL' ? 'LOCAL' : 'CLERK';
    if (!user.email) user.email = email;
    if (!user.fullName) user.fullName = fullName(clerkUser, email);
    if (!user.avatarUrl && clerkUser.imageUrl) user.avatarUrl = clerkUser.imageUrl;
    return user.save();
  }

  return User.create({
    clerkUserId,
    authProvider: 'CLERK',
    fullName: fullName(clerkUser, email),
    email,
    avatarUrl: clerkUser.imageUrl,
    role: 'USER',
    status: 'ACTIVE',
    accountType: 'INDIVIDUAL',
  });
}
module.exports = { syncClerkUser, getClerkClient };
