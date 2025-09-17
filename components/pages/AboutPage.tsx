import React from 'react';
import { TEAM_DATA } from '../../constants';
import TeamMemberCard from '../TeamMemberCard';
import PageHeader from '../PageHeader';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="O Nama"
        subtitle="Mi smo neprofitna organizacija posvećena edukaciji i promicanju najviših standarda u kardiopulmonalnoj reanimaciji."
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="text-gray-700 space-y-4">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">Naša priča</h2>
              <p>
                Udruženje Resuscitacijski savjet u Bosni i Hercegovini osnovano je 08.08.2008. godine u Bihaću, s jasnim ciljem: unaprijediti znanja i vještine oživljavanja širom zemlje. Vođeni strašću za spašavanjem života, posvećeni smo edukaciji laika i zdravstvenih djelatnika prema najnovijim europskim smjernicama.
              </p>
              <p>
                Kroz organizaciju certificiranih kurseva, radionica i javnih kampanja, gradimo zajednicu osviještenih pojedinaca spremnih pružiti pomoć u kritičnim trenucima. Vjerujemo da svaka osoba može postati karika u lancu preživljavanja.
              </p>
            </div>
            <div>
              <img
                src="https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUS%20LOGO%20(1).png"
                alt="Logo Udruženja"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-gray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {TEAM_DATA.map(member => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;