interface PlusIconProps {
  size?: number;
}

export default function PlusIcon({ size = 16 }: PlusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M24,12 C24,13.104992 23.104992,14 22,14 L14,14 L14,22 C14,23.104992 13.104992,24 12,24 C10.895008,24 10,23.104992 10,22 L10,14 L2,14 C0.895008,14 0,13.104992 0,12 C0,10.895008 0.895008,10 2,10 L10,10 L10,2 C10,0.895008 10.895008,0 12,0 C13.104992,0 14,0.895008 14,2 L14,10 L22,10 C23.104992,10 24,10.895008 24,12 Z"
          fill="currentColor"
        ></path>
      </g>
    </svg>
  );
}
