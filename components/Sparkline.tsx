
import React from 'react';
import { LineChart, Line, ResponsiveContainer, Dot } from 'recharts';

interface SparklineProps {
  data: { value: number }[];
  color: string;
  showDot?: boolean;
}

const CustomDot: React.FC<any> = (props) => {
    const { cx, cy, stroke } = props;
    return <circle cx={cx} cy={cy} r={4} strokeWidth={2} stroke={stroke} fill="#1C1C1E" />;
};


const Sparkline: React.FC<SparklineProps> = ({ data, color, showDot }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={showDot ? (props) => {
              if (props.index === data.length - 1) {
                  return <CustomDot {...props} />;
              }
              return null;
          } : false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;