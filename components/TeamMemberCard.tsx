import React from 'react';
import { TeamMember } from '../types';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center transform transition-transform hover:-translate-y-2">
    <img src={member.imageUrl} alt={member.name} className="w-full h-110 object-cover" />
    <div className="p-8">
      <h3 className="text-2xl font-bold text-brand-blue">{member.name}</h3>
      <p className="text-brand-lightblue text-lg font-semibold mt-1">{member.spec}</p>
      <p className="text-brand-lightblue text-lg font-semibold mt-1">{member.role}</p>
    </div>
  </div>
);

export default TeamMemberCard;