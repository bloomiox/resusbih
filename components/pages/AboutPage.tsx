import React from 'react';
import { useData } from '../../contexts/DataContext';
import TeamMemberCard from '../TeamMemberCard';
import PageHeader from '../PageHeader';

const AboutPage: React.FC = () => {
  const { team, pageContent } = useData();
  
  return (
    <div className="animate-fade-in">
      <PageHeader
        title={pageContent.about.title}
        subtitle="Mi smo neprofitna organizacija posvećena edukaciji i promicanju najviših standarda u kardiopulmonalnoj reanimaciji."
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="text-gray-700 space-y-4">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">Naša priča</h2>
              <div dangerouslySetInnerHTML={{ __html: pageContent.about.content.replace(/\n/g, '<br />') }} />
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
            {team.map(member => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;