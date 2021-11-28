import styled, { CSSProperties, css } from 'styled-components';

type FlexProps = {
  direction?: CSSProperties['flexDirection'];
  height?: CSSProperties['height'];
  gap?: CSSProperties['gap'];
};
export const Flex = styled.div<FlexProps>`
  display: flex;
  gap: ${(p) => p.gap};
  width: 100%;
  flex-direction: ${(p) => p.direction};
  height: ${(p) => p.height ?? '100%'};
`;

type FlexItemProps = {
  basis?: CSSProperties['flexBasis'];
  grow?: CSSProperties['flexGrow'];
  shrink?: CSSProperties['flexShrink'];
  order?: CSSProperties['order'];
  align?: CSSProperties['alignSelf'];
  scrollable?: boolean;
};
export const FlexItem = styled.div<FlexItemProps>`
  ${(p) => css`
    flex-basis: ${p.basis};
    flex-grow: ${p.grow};
    flex-shrink: ${p.shrink};
    order: ${p.order};
    align-self: ${p.align};
    overflow-y: ${p.scrollable && 'auto'};
  `}
`;
