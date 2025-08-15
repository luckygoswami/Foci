interface FireProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'color' | 'bw';
}

export const Fire: React.FC<FireProps> = ({ variant = 'color', ...props }) => {
  const colorSchemes = {
    color: {
      gradientStart: '#ff4c0d',
      gradientEnd: '#fc9502',
      midFlame: '#fc9502',
      coreFlame: '#fce202',
    },
    bw: {
      gradientStart: '#7a7a7a',
      gradientEnd: '#a3a3a3',
      midFlame: '#a3a3a3',
      coreFlame: '#d0d0d0',
    },
  };

  const { gradientStart, gradientEnd, midFlame, coreFlame } =
    colorSchemes[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={20}
      height={20}
      viewBox="0 0 255 255"
      {...props}>
      <defs>
        <linearGradient
          id={`${variant}Gradient`}
          x1={94.141}
          x2={94.141}
          y1={255}
          y2={0.188}
          gradientUnits="userSpaceOnUse">
          <stop
            offset={0}
            stopColor={gradientStart}
          />
          <stop
            offset={1}
            stopColor={gradientEnd}
          />
        </linearGradient>
      </defs>
      <g fillRule="evenodd">
        <path
          fill={`url(#${variant}Gradient)`}
          d="M187.899 164.809c-2.096 50.059-43.325 90.003-93.899 90.003-51.915 0-94-43.5-94-94 0-6.75-.121-20.24 10-43 6.057-13.621 9.856-22.178 12-30 1.178-4.299 3.469-11.129 10 0 3.851 6.562 4 16 4 16s14.328-10.995 24-32c14.179-30.793 2.866-49.2-1-62-1.338-4.428-2.178-12.386 7-9 9.352 3.451 34.076 20.758 47 39 18.445 26.035 25 51 25 51s5.906-7.33 8-15c2.365-8.661 2.4-17.239 9.999-7.999 7.227 8.787 17.96 25.3 24.001 40.999 10.969 28.509 7.899 55.997 7.899 55.997z"
          data-original="url(#a)"
        />
        <path
          fill={midFlame}
          d="M94 254.812c-35.899 0-65-29.101-65-65 0-21.661 8.729-34.812 26.896-52.646 11.632-11.419 22.519-25.444 27.146-34.994.911-1.88 2.984-11.677 10.977-.206 4.193 6.016 10.766 16.715 14.981 25.846 7.266 15.743 9 31 9 31s7.121-4.196 12-15c1.573-3.482 4.753-16.664 13.643-3.484C150.166 150 159.127 167.39 159 189.812c0 35.899-29.102 65-65 65z"
          data-original="#fc9502"
        />
        <path
          fill={coreFlame}
          d="M95 183.812c9.25 0 9.25 17.129 21 40 7.824 15.229-3.879 31-21 31s-26-13.879-26-31c0-17.12 16.75-40 26-40z"
          data-original="#fce202"
        />
      </g>
    </svg>
  );
};
