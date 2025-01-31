import { SVGProps } from "react";

export function Help(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="1em"
        height="1em"
        {...props}
      >
        <g fill="none">
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"
          ></path>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M24 28.625v-4a6 6 0 1 0-6-6"
          ></path>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M24 37.625a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"
            clipRule="evenodd"
          ></path>
        </g>
      </svg>
    )
  }
  