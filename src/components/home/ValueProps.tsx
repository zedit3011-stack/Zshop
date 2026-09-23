import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const perks = [
    {
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      title: 'Free Express Delivery',
      description: 'On all orders above Rs. 5,000 with Cash on Delivery (COD) available nationwide.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: '100% Certified Authentic',
      description: 'Direct manufacturer partnerships with verified warranty cards.'
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-indigo-600" />,
      title: '30-Day Hassle-Free Returns',
      description: 'No questions asked prepaid return labels for full refunds.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-amber-600" />,
      title: '24/7 Dedicated Concierge',
      description: 'Real specialist support available via live chat, phone, or ticket.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 mb-14 shadow-sm" id="zstore-value-propositions">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {perks.map((perk, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0">
              {perk.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{perk.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{perk.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
