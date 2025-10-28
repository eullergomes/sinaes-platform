export const avatarUrl = (url?: string) => {
  if (!url) return '/assets/imgs/avatar-fallback.png';
  return url.replace('/upload/', '/upload/w_128,h_128,c_fill,g_face,q_auto,f_auto/');
}
