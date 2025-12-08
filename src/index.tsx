import React, { type ReactNode } from 'react';

import { useOpenDynamicLink } from './use-open-dynamic-link';

import type { IProps } from './types';

interface DynamicLinkProps extends IProps {
  children: ReactNode
  className?: string
}

const DynamicLink = (props: DynamicLinkProps) => {
  const { children, className } = props;

  const { link } = useOpenDynamicLink(props);

  return (
    <a href={link} className={className}>
      {children}
    </a>
  )
}

export default DynamicLink