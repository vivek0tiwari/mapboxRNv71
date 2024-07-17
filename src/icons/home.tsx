import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {memo} from 'react';
const Home = (props: SvgProps) => (
  <Svg height={24} viewBox="0 0 24 24" width={24} fill="#5f6368" {...props}>
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Svg>
);
const HomeIcon = memo(Home);
export default HomeIcon;
