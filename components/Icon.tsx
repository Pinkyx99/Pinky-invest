import React from 'react';

type IconName = 'cash' | 'properties' | 'crypto' | 'assets' | 'casino' | 'profile' | 'up' | 'down' | 'tycoon' | 'prestige' | 'back' | 'gem' | 'mine' | 'spade' | 'heart' | 'diamond' | 'club' | 'checkmark' | 'up-right-arrow' | 'plus-circle' | 'minus-circle' | 'clipboard-document-list' | 'sparkles' | 'home' | 'chart-bar' | 'wallet' | 'apps' | 'bell' | 'send' | 'pay-wallet' | 'search' | 'exchange' | 'settings' | 'plus-lg' | 'academic-cap' | 'mastercard';

interface IconProps {
  name: IconName;
  className?: string;
}

const icons: Record<IconName, React.ReactNode> = {
  cash: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />,
  properties: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V3m-18 0l18-4.5m-18 18h18" />,
  crypto: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" />,
  assets: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
  casino: <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.756 14.25a4.5 4.5 0 10-8.488 0M14.25 14.25a4.5 4.5 0 100-8.488M7.756 7.756a4.5 4.5 0 108.488 0" />,
  profile: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
  up: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />,
  down: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />,
  tycoon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.402-6.402a3.75 3.75 0 00-5.304-5.304L4.098 14.6z M19.902 4.098a3.75 3.75 0 00-5.304 0L9.384 9.312a3.75 3.75 0 005.304 5.304l5.214-5.214z M14.6 4.098a3.75 3.75 0 010 5.304L9.384 14.6a3.75 3.75 0 01-5.304-5.304L9.3 4.098z" />,
  prestige: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5h.008v.008h-.008v-.008z" />,
  back: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />,
  gem: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75l-3.75-6.75h7.5L12 21.75zM12 2.25L8.25 9h7.5L12 2.25zM3.28 11.25l3.75 2.25-3.75 2.25V11.25zM20.72 11.25v4.5l-3.75-2.25 3.75-2.25zM7.03 9.75L9 9l2.25 2.25L9.75 12l-2.72-2.25zM16.97 9.75l-2.25.75L15 12l-1.5-2.25L12 9l2.25.75L16.97 9.75z" />,
  mine: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />,
  spade: <path d="M12 2C9.25 2 7.083 4.417 7.083 7.5S9.5 12.583 12 17s4.917-5.083 4.917-9.5S14.75 2 12 2zm0 18.5a1.25 1.25 0 0 0 1.25-1.25H10.75A1.25 1.25 0 0 0 12 20.5z" />,
  heart: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
  diamond: <path d="M12 2L2 9.8l10 12.2 10-12.2L12 2zm0 3.8l6.38 5.7H5.62L12 5.8z" />,
  club: <path d="M12 2c-2.76 0-5 2.24-5 5 0 1.38.56 2.63 1.46 3.54C6.56 11.37 5 13.54 5 16c0 2.76 2.24 5 5 5h4c2.76 0 5-2.24 5-5 0-2.46-1.56-4.63-3.54-5.46C16.44 9.63 17 8.38 17 7c0-2.76-2.24-5-5-5z" />,
  checkmark: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
  'up-right-arrow': <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />,
  'plus-circle': <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  'minus-circle': <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  'clipboard-document-list': <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h.01M15 12h.01M10.5 16.5h.01M13.5 16.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  'sparkles': <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5h.008v.008h-.008v-.008z" />,
  'home': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  'chart-bar': <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
  'wallet': <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m14.25 6h-6.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5z" />,
  'apps': <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />,
  'bell': <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
  'send': <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />,
  'pay-wallet': <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m-3.75 9.75h10.5a.75.75 0 000-1.5h-10.5a.75.75 0 000 1.5zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  'search': <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
  'exchange': <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />,
  'settings': <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226M15 20.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 12.75V15M6.486 15.06c.218.284.496.526.811.708M17.514 15.06c-.218.284-.496.526-.811.708M17.514 8.94c.218-.284.496-.526.811-.708M6.486 8.94c-.218-.284-.496-.526-.811-.708M12 21a9 9 0 100-18 9 9 0 000 18z" />,
  'plus-lg': <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
  'academic-cap': <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l15.482 0m0 0l15.482 0" />,
  'mastercard': <><circle cx="10" cy="12" r="7" fill="#EA001B" /><circle cx="20" cy="12" r="7" fill="#F79F1A" fillOpacity="0.85" /></>,
};

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const isMastercard = name === 'mastercard';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={isMastercard ? 'currentColor' : 'none'}
      viewBox={isMastercard ? '0 0 30 24' : '0 0 24 24'}
      strokeWidth={isMastercard ? 0 : 1.5}
      stroke="currentColor"
      className={className}
    >
      {icons[name]}
    </svg>
  );
};
