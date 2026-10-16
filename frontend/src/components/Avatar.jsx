// Presentational avatar: same image source logic the app already used, in one place.
const Avatar = ({ person, size = 40, className = '', ring = true }) => {
  const name = person?.name || '?';
  const src =
    person?.profileImage?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4338f0&color=fff&bold=true&size=${size * 2}`;
  return (
    <img
      src={src}
      alt={name}
      style={{ height: size, width: size }}
      className={`shrink-0 rounded-full object-cover ${ring ? 'ring-2 ring-white shadow-soft' : ''} ${className}`}
    />
  );
};

export default Avatar;
