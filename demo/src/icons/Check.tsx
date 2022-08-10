import React from 'react';

interface Props {
  color?: string;
  size?: number;
}

export default function Check({ color = '#299435', size = 20 }: Props) {
  return (
    <svg
      fill="none"
      height={size}
      version="1.1"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Check</title>
      <path
        d="M10.2426 16.3137L6 12.071L7.41421 10.6568L10.2426 13.4853L15.8995 7.8284L17.3137 9.24262L10.2426 16.3137Z"
        fill={color}
      />
      <path
        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
}
