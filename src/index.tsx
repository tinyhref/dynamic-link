import React, { type ReactNode, AnchorHTMLAttributes } from 'react';

import { useOpenDynamicLink } from './use-open-dynamic-link';

import type { IProps } from './types';

export {
  useOpenDynamicLink
}

export interface DynamicLinkProps extends IProps {
  children: ReactNode
  className?: string
  htmlProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}

const DynamicLink = (props: DynamicLinkProps) => {
  const { children, className, htmlProps, ...restProps } = props;

  const { link } = useOpenDynamicLink(restProps);

  return (
    <a
      {...htmlProps}
      className={className}
      href={link}
    >
      {children}
    </a>
  )
}

export default DynamicLink