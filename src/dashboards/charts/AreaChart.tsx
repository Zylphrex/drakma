import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { AreaChart as AreaRechart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import Title from '../base/Title';


type Props = {
  title: string;
  xKey: string;
  yKey: string | string[];
  data: any[];
};


export default function AreaChart(props: Props) {
  const theme = useTheme();

  const { title, xKey, yKey, data } = props;

  const yKeys = Array.isArray(yKey) ? yKey : [yKey];
  const palettes = [
    theme.palette.primary,
    theme.palette.secondary,
  ];

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <ResponsiveContainer>
        <AreaRechart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey={xKey} stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />
          {
            yKeys.map((yKey, index) => (
              <Area
                key={yKey}
                type="monotone"
                dataKey={yKey}
                stroke={palettes[index % palettes.length].main}
                fill={palettes[index % palettes.length].light}
                dot={false}
              />
            ))
          }
        </AreaRechart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
