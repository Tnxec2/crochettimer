import { SVGProps } from "react";

export function HeavyPlusSign(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="1em"
        height="1em"
        {...props}
      >
        <path
          fill="currentColor"
          d="M38 26V2H26v24H2v12h24v24h12V38h24V26z"
        ></path>
      </svg>
    )
  }
  
  