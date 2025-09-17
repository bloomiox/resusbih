import React, { useRef, useState } from 'react';
import PageHeader from '../PageHeader';

// EmailJS je učitan putem script taga u index.html,
// ova deklaracija obavještava TypeScript o njegovom postojanju.
declare const emailjs: {
  sendForm: (serviceID: string, templateID: string, form: HTMLFormElement, publicKey: string) => Promise<{ status: number; text: string }>;
};

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!form.current) return;

    // TODO: Zamijenite sa vašim EmailJS podacima
    const serviceID = 'service_pfzs5ul';
    const templateID = 'template_lhxqaas';
    const publicKey = 'mfhzwFF820NKsSaWk';

    setStatus('sending');
    setFeedbackMessage('');

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          console.log('SUCCESS!', result.text);
          setStatus('success');
          setFeedbackMessage('Vaša poruka je uspješno poslana! Javit ćemo vam se uskoro.');
          form.current?.reset();
      }, (error) => {
          console.log('FAILED...', error.text);
          setStatus('error');
          setFeedbackMessage('Došlo je do pogreške prilikom slanja poruke. Molimo pokušajte ponovo.');
      });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-brand-blue mb-6">Pošaljite nam poruku</h2>
      <form ref={form} onSubmit={sendEmail}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Ime i prezime</label>
          <input type="text" id="name" name="name" className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-lightblue" required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email adresa</label>
          <input type="email" id="email" name="email" className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-lightblue" required />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">Naslov</label>
          <input type="text" id="subject" name="subject" className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-lightblue" required />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Vaša poruka</label>
          <textarea id="message" name="message" rows={5} className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-lightblue" required></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-brand-blue hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Slanje...' : 'Pošalji'}
        </button>
        {status === 'success' && <p className="mt-4 text-center text-green-600 font-semibold">{feedbackMessage}</p>}
        {status === 'error' && <p className="mt-4 text-center text-brand-red font-semibold">{feedbackMessage}</p>}
      </form>
    </div>
  );
};

const ContactInfo: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-2xl font-bold text-brand-blue mb-2">Informacije</h3>
      <p className="text-gray-600"><strong>Adresa:</strong> Jablanska 155, Bihać, Bosna i Hercegovina</p>
      <p className="text-gray-600"><strong>Email:</strong> office@resusbih.org</p>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-brand-blue mb-2">Radno vrijeme</h3>
      <p className="text-gray-600">Ponedjeljak - Petak: 09:00 - 17:00</p>
      <p className="text-gray-600">Vikendom i praznicima zatvoreno.</p>
    </div>
    <div className="h-64 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45663.75336048123!2d15.84025134105151!3d44.81630182415174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476144e13207b539%3A0x2600ad515321520!2sBiha%C4%87%2C%20Bosnia%20and%20Herzegovina!5e0!3m2!1sen!2s!4v1689253483321!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokacija ureda"
      ></iframe>
    </div>
  </div>
);

const ContactPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Kontaktirajte Nas"
        subtitle="Imate pitanje o kursevima, članstvu ili suradnji? Javite nam se!"
      />

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;