import { SVGProps } from "react";

export function Minus(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="1em"
        height="1em"
        {...props}
      >
        <path
          fill="currentColor"
          d="M0 6.5v3a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5H.5a.5.5 0 0 0-.5.5"
        ></path>
      </svg>
    )
}