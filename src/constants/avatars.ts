const modules = import.meta.glob('/public/assets/avatars/*.svg', {
  eager: true,
  import: 'default',
});

export const avatarList = Object.keys(modules).map((path) =>
  path.replace('/public/assets/avatars/', '')
);
