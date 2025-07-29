
import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { formatCurrency } from '../utils/format';

interface HeaderProps {
  cash: number;
}

const AnimatedBalance: React.FC<{ value: number }> = ({ value }) => {
    const motionValue = useMotionValue(0);
    // Use a custom transform to avoid showing negative values during animation init
    const displayValue = useTransform(motionValue, v => formatCurrency(Math.max(0, v)));

    useEffect(() => {
        const controls = animate(motionValue, value, {
            duration: 0.7,
            ease: 'easeOut'
        });
        return controls.stop;
    }, [value, motionValue]);

    return <motion.p>{displayValue}</motion.p>;
};


const Header: React.FC<HeaderProps> = ({ cash }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-md z-20 flex items-center justify-end px-6 border-b border-white/10">
      <div className="text-xl font-semibold text-green-400">
        <AnimatedBalance value={cash} />
      </div>
    </div>
  );
};

export default Header;
