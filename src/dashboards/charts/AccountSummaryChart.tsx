import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import Title from '../base/Title';
import { Activity } from '../../app/types';


type Props = {
  title: string;
  dataKey: string;
  activities: Activity[];
};

export default function AccountSummaryChart(props: Props) {
  const theme = useTheme();

  const { title, dataKey, activities } = props;

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <ResponsiveContainer>
        <AreaChart
          data={activities}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.light}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
