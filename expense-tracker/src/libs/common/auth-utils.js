const isAdmin = (user) => !!user && user.role === 'admin';

const isSelfOrAdmin = (user, resourceUserId) => {
  if (isAdmin(user)) {
    return true;
  }

  if (user && user.userId === resourceUserId) {
    return true;
  }

  return false;
};

module.exports = {
  isAdmin,
  isSelfOrAdmin,
};
