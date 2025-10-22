'use client';
import { useLocale } from 'next-intl';
import React from 'react';

interface KeyFact {
  id?: string | number;
  subtitle: string;
  title: string;
}

type Props = {
  facts?: KeyFact[];
  title?: string;
};

const KeyFacts = ({ facts = [], title }: Props) => {
  const locale = useLocale();
  const arr = facts;
  return (
    <div className="pt-20 py-40">
      <div className="px-4 2xl:px-80">
        <h4 className="text-6xl font-SchnyderS uppercase mb-40">
          {title || (locale === 'en' ? `KEYFACTS` : 'معلومات رئيسية')}
        </h4>
        <div className="grid 2xl:grid-cols-2 gap-x-48 gap-y-10">
          {arr.map((el, i) => (
            <KeyFactCard key={el.id || el.title + i} {...el} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyFacts;
interface KEyFactCardProp {
  title: string;
  subtitle: string;
}
const KeyFactCard = ({ subtitle, title }: KEyFactCardProp) => {
  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        <p className="mb-1 uppercase opacity-30 font-Satoshi">{subtitle}</p>

        <div className="w-full h-0.5 bg-black opacity-10 mb-4"></div>
        <p className="uppercase font-SchnyderS text-3xl">{title}</p>
      </div>
    </div>
  );
};
