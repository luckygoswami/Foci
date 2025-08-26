export function authErrorToMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account is disabled.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not available.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
