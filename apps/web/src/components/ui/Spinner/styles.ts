import { keyframes } from '@emotion/react';

export const escaleY = keyframes`
  0%, 80%, 100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
`;

export const spinnerStyles = {
  wrapper: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
    backdropFilter: 'blur(2px)',
  },
  container: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    minHeight: '100px',
  },
  loader: {
    color: '#007BFF',
    position: 'relative' as const,
    fontSize: '11px',
    background: '#007BFF',
    animation: `${escaleY} 1s infinite ease-in-out`,
    width: '1em',
    height: '4em',
    animationDelay: '-0.16s',
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '2em',
      background: '#007BFF',
      width: '1em',
      height: '4em',
      animation: `${escaleY} 1s infinite ease-in-out`,
    },
    '&:before': {
      left: '-2em',
      animationDelay: '-0.32s',
    },
  },
  inline: {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    '& $loader': {
      fontSize: '4px',
    },
  },
};
