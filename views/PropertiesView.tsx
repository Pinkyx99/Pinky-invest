
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { PROPERTIES_DATA, TICKS_PER_SECOND } from '../constants';
import { formatCurrency, formatNumber } from '../utils/format';
import { Icon } from '../components/Icon';

type PropertiesViewProps = ReturnType<typeof useGameState>;

const PropertyCard: React.FC<{
    property: (typeof PROPERTIES_DATA)[0],
    owned: ReturnType<typeof useGameState>['properties'][string] | undefined,
    onBuy: (id: string) => void,
    canAfford: boolean
}> = ({ property, owned, onBuy, canAfford }) => {
    const level = owned?.level || 0;
    const income = owned?.income || 0;
    const cost = property.baseCost * Math.pow(1.15, level);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
    const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    }
    
    return (
        <motion.div
             style={{ perspective: "1000px" }}
             onMouseMove={handleMouseMove}
             onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
             className="w-full"
        >
            <motion.div
                className="bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden shadow-lg relative group/card"
                style={{
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY,
                }}
            >
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                    style={{ transform: "translateZ(80px)" }}
                >
                    <motion.div
                        className="absolute w-96 h-96 bg-white"
                        style={{
                            left: mouseX,
                            top: mouseY,
                            opacity: useTransform(mouseY, [-150, 0, 150], [0, 0.03, 0]),
                            transform: 'translate(-50%, -50%)',
                            filter: 'blur(80px)',
                        }}
                    />
                </motion.div>

                <motion.div className="w-full h-40 mt-0" style={{ transform: "translateZ(60px)" }}>
                  <img
                    src={property.imageUrl}
                    height="1000"
                    width="1000"
                    className="h-full w-full object-cover rounded-t-xl group-hover/card:shadow-xl"
                    alt={property.name}
                  />
                </motion.div>
                
                <div className="p-4">
                    <motion.div style={{ transform: "translateZ(50px)" }}>
                      <h3 className="text-xl font-bold text-white">{property.name}</h3>
                      <p className="text-sm text-neutral-400 mt-1">{property.location}</p>
                    </motion.div>

                     {level > 0 && (
                        <motion.div style={{ transform: "translateZ(40px)" }} className="text-right flex-shrink-0 -mt-10">
                             <p className="text-xs text-white/60">Lvl {level}</p>
                            <p className="text-green-400 font-semibold">{formatCurrency(income * TICKS_PER_SECOND)}/s</p>
                        </motion.div>
                    )}
                    
                    <motion.div className="mt-8">
                        <motion.button
                            onClick={() => onBuy(property.id)}
                            disabled={!canAfford}
                            style={{ transform: "translateZ(20px)" }}
                            className="w-full bg-[#333] hover:bg-[#444] text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-gray-700 disabled:text-white/40 disabled:cursor-not-allowed"
                            whileHover={{ scale: canAfford ? 1.05 : 1 }}
                            whileTap={{ scale: canAfford ? 0.95 : 1 }}
                        >
                            {level === 0 ? 'Buy' : 'Upgrade'} ({formatCurrency(cost)})
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};


const PropertiesView: React.FC<PropertiesViewProps> = ({ cash, properties, buyOrUpgradeProperty }) => {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Properties</h1>
            <motion.div 
                className="space-y-4"
                variants={{
                    show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
            >
                {PROPERTIES_DATA.map(prop => (
                     <motion.div key={prop.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <PropertyCard
                            property={prop}
                            owned={properties[prop.id]}
                            onBuy={buyOrUpgradeProperty}
                            canAfford={cash >= (prop.baseCost * Math.pow(1.15, properties[prop.id]?.level || 0))}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default PropertiesView;