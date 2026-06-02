import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import jelli from '../assets/jellie.svg';
import fibi from '../assets/fibi.svg';
import cici from '../assets/cici.svg';
import solie from '../assets/solie.svg';
import suki from '../assets/suki.svg';
import dumi from '../assets/dumi.svg';
import type { ChildAvatarKey } from './childAvatars';

export const CHILD_AVATAR_COMPONENTS: Record<
  ChildAvatarKey,
  ComponentType<SvgProps>
> = {
  '1': jelli,
  '2': fibi,
  '3': cici,
  '4': solie,
  '5': suki,
  '6': dumi,
};
