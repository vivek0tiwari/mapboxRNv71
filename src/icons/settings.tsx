import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {memo} from 'react';
const Settings = (props: SvgProps) => (
  <Svg height={24} viewBox="0 0 24 24" width={24} fill="#5f6368" {...props}>
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
  </Svg>
);
const SettingsIcon = memo(Settings);
export default SettingsIcon;