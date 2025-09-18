
import { Page, Course, TeamMember, NewsArticle, CourseParticipant } from './types';

export const NAV_LINKS = [
  { name: 'Početna', page: Page.Home },
  { name: 'O nama', page: Page.About },
  { name: 'Kursevi', page: Page.Courses },
  { name: 'Novosti', page: Page.News },
  { name: 'Kontakt', page: Page.Contact },
];

export const COURSES_DATA: Course[] = [
  {
    id: 1,
    title: 'Osnovne vještine reanimacije',
    description: 'Naučite ključne vještine kardiopulmonalne reanimacije (KPR) i korištenja automatskog vanjskog defibrilatora (AVD).',
    audience: 'Polaznici prve pomoći, studenti, nezdravstveni djelatnici',
    imageUrl: 'https://nursingexercise.com/wp-content/uploads/2023/04/Cardiopulmonary-resuscitation-cpr-procedure-in-hospital.jpg',
    details: {
      duration: '4 sata',
      certification: 'Certifikat vrijedi 2 godine',
      topics: [
        'Prepoznavanje srčanog zastoja',
        'Kvalitetna masaža srca',
        'Primjena umjetnog disanja',
        'Sigurna uporaba AVD-a',
        'Zbrinjavanje gušenja'
      ]
    }
  },
  {
    id: 2,
    title: 'Napredni kurs oživljavanja',
    description: 'Kurs za zdravstvene djelatnike koji pokriva napredne tehnike oživljavanja, farmakoterapiju i vođenje tima.',
    audience: 'Liječnici, medicinske sestre/tehničari',
    imageUrl: 'https://www.aspenmedical.ae/wp-content/uploads/2024/02/BLS-Left.jpg',
    details: {
      duration: '2 dana',
      certification: 'ERC ALS Provider certifikat',
      topics: [
        'Napredno osiguravanje dišnog puta',
        'Prepoznavanje i terapija poremećaja ritma',
        'Primjena lijekova u oživljavanju',
        'Vođenje reanimacijskog tima (CRM)',
        'Post-reanimacijska skrb'
      ]
    }
  },
  {
    id: 3,
    title: 'Oživljavanje djece (PLS)',
    description: 'Specijalizirani kurs usmjeren na specifičnosti kardiopulmonalne reanimacije kod novorođenčadi, dojenčadi i djece.',
    audience: 'Pedijatri, osoblje hitne pomoći',
    imageUrl: 'https://www.rrcpr.com/wp-content/uploads/2020/07/BLS_Course.jpg',
    details: {
      duration: '1 dan',
      certification: 'Certifikat vrijedi 2 godine',
      topics: [
        'Specifičnosti dječje anatomije i fiziologije',
        'Oživljavanje novorođenčeta',
        'Hitna stanja u pedijatriji',
        'Timska dinamika'
      ]
    }
  },
];

export const TEAM_DATA: TeamMember[] = [
  {
    id: 1,
    name: 'Spec. dr. med. Havić Hajrudin',
    spec: 'Specijalista urgentne medicine',
    role: 'Osnivač i predsjednik',
    imageUrl: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/Untitled%20design%20(10).png',
  },
  {
    id: 2,
    name: 'Spec. dr. med. Amel Mizić',
    spec: 'Specijalista urgentne medicine',
    role: 'Sekretar',
    imageUrl: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/Untitled%20design%20(11).png',
  },
];

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 1,
    title: 'Osnivanje Udruženja',
    publishDate: '08.08.2025.',
    shortDescription: 'S ponosom objavljujemo osnivanje Udruženja Resuscitacijski savjet u Bosni i Hercegovini.',
    fullContent: `Službeno je osnovano Udruženje Resuscitacijski savjet u Bosni i Hercegovini (Удружење Ресусцитацијски савјет у Босни и Херцеговини) dana 08.08.2025. godine.

Adresa sjedišta je: Bihać, ulica Jablanska broj 155.

Cilj udruženja je promicanje i unaprjeđenje znanja i vještina oživljavanja širom zemlje, u skladu s najnovijim europskim i svjetskim smjernicama. Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu spašavanja života.`,
    imageUrl: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUS%20LOGO%20(3).png'
  },
  {
    id: 2,
    title: 'Objavljene nove ERC smjernice za reanimaciju 2025',
    publishDate: '25.09.2025.',
    shortDescription: 'Europski Resuscitacijski Savjet (ERC) objavio je ažurirane smjernice. Naše udruženje započinje s implementacijom u sve kurseve.',
    fullContent: `Kao i svakih pet godina, Europski Resuscitacijski Savjet (ERC) objavio je nove, ažurirane smjernice za oživljavanje. Nove smjernice stavljaju još veći naglasak na kvalitetu masaže srca, timsku suradnju i post-reanimacijsku skrb.

Naše udruženje, kao punopravni član ERC-a, odmah započinje proces implementacije novih smjernica u sve naše certificirane kurseve. Svi naši instruktori proći će dodatnu obuku kako bi osigurali da polaznici dobiju najsuvremenija znanja i vještine.`,
    imageUrl: 'https://www.aspenmedical.ae/wp-content/uploads/2024/02/BLS-Left.jpg'
  },
  {
    id: 3,
    title: 'Zašto je važna rana defibrilacija? Uloga AVD uređaja.',
    publishDate: '18.09.2025.',
    shortDescription: 'Automatski vanjski defibrilator (AVD) je uređaj koji može spasiti život. Saznajte zašto je njegova rana primjena ključna.',
    fullContent: `Kod iznenadnog srčanog zastoja, srce često uđe u stanje ventrikularne fibrilacije - kaotičnog, neučinkovitog treperenja. Jedini način da se ovaj poremećaj ritma prekine je primjena električnog šoka, odnosno defibrilacije.

Svaka minuta odgode defibrilacije smanjuje šansu za preživljavanje za oko 10%. Zbog toga je postavljanje AVD uređaja na javna mjesta (trgovački centri, zračne luke, sportski objekti) i edukacija laika o njihovoj uporabi od presudne važnosti. AVD uređaji su dizajnirani da budu jednostavni za korištenje i sigurni, te glasovnim uputama vode korisnika kroz cijeli postupak.`,
    imageUrl: 'https://nursingexercise.com/wp-content/uploads/2023/04/Cardiopulmonary-resuscitation-cpr-procedure-in-hospital.jpg'
  },
  {
    id: 4,
    title: 'Kako prepoznati srčani zastoj i zašto je važno odmah djelovati?',
    publishDate: '18.09.2025',
    shortDescription: 'Prepoznavanje znakova srčanog zastoja prvi je korak u lancu preživljavanja. Naučite ključne znakove.',
    fullContent: `Srčani zastoj je stanje u kojem srce prestaje pumpati krv, što dovodi do prestanka disanja i gubitka svijesti. Ključni znakovi za prepoznavanje su:

1.  **Osoba ne reagira:** Ne miče se, ne otvara oči i ne odgovara na dozivanje ili nježno protresanje.
2.  **Osoba ne diše normalno:** Može prestati disati ili imati agonalne udahe (nepravilno, bučno disanje slično hrkanju ili krkljanju).

Ako primijetite ove znakove, odmah pozovite hitnu medicinsku pomoć (124) i započnite s masažom srca. Ne bojte se djelovati - vaša reakcija može spasiti život. Svaka sekunda je važna!`,
    imageUrl: 'https://www.rrcpr.com/wp-content/uploads/2020/07/BLS_Course.jpg'
  }
];

// Sample CRM data for course participants
export const PARTICIPANTS_DATA: CourseParticipant[] = [
  {
    id: 1,
    firstName: 'Marko',
    lastName: 'Petrović',
    email: 'marko.petrovic@email.com',
    phone: '+387 61 123 456',
    address: 'Sarajevo, Bosna i Hercegovina',
    dateOfBirth: '1985-03-15',
    profession: 'Medicinska sestra',
    courseId: 1,
    courseName: 'Osnovne vještine reanimacije',
    registrationDate: '2025-01-15',
    completionDate: '2025-01-20',
    certificateIssued: true,
    certificateNumber: 'RESUSBIH-2025-001',
    status: 'completed',
    notes: 'Odličan polaznik, aktivno sudjelovanje'
  },
  {
    id: 2,
    firstName: 'Ana',
    lastName: 'Marić',
    email: 'ana.maric@email.com',
    phone: '+387 62 234 567',
    address: 'Banja Luka, Bosna i Hercegovina',
    dateOfBirth: '1990-07-22',
    profession: 'Liječnik',
    courseId: 2,
    courseName: 'Napredni kurs oživljavanja',
    registrationDate: '2025-01-10',
    completionDate: '2025-01-12',
    certificateIssued: true,
    certificateNumber: 'RESUSBIH-2025-002',
    status: 'completed',
    notes: 'Izvrsno znanje, preporučuje se za instruktora'
  },
  {
    id: 3,
    firstName: 'Stefan',
    lastName: 'Nikolić',
    email: 'stefan.nikolic@email.com',
    phone: '+387 63 345 678',
    address: 'Tuzla, Bosna i Hercegovina',
    dateOfBirth: '1988-11-08',
    profession: 'Medicinski tehničar',
    courseId: 1,
    courseName: 'Osnovne vještine reanimacije',
    registrationDate: '2025-01-18',
    status: 'registered',
    certificateIssued: false,
    notes: 'Čeka početak kursa'
  },
  {
    id: 4,
    firstName: 'Milica',
    lastName: 'Jovanović',
    email: 'milica.jovanovic@email.com',
    phone: '+387 64 456 789',
    address: 'Mostar, Bosna i Hercegovina',
    dateOfBirth: '1992-05-14',
    profession: 'Pedijatar',
    courseId: 3,
    courseName: 'Oživljavanje djece (PLS)',
    registrationDate: '2025-01-12',
    completionDate: '2025-01-13',
    certificateIssued: false,
    certificateNumber: 'RESUSBIH-2025-003',
    status: 'completed',
    notes: 'Završila kurs, čeka izdavanje certifikata'
  },
  {
    id: 5,
    firstName: 'Aleksandar',
    lastName: 'Stojanović',
    email: 'aleksandar.stojanovic@email.com',
    phone: '+387 65 567 890',
    address: 'Zenica, Bosna i Hercegovina',
    dateOfBirth: '1987-09-30',
    profession: 'Hitna pomoć',
    courseId: 2,
    courseName: 'Napredni kurs oživljavanja',
    registrationDate: '2025-01-20',
    status: 'registered',
    certificateIssued: false,
    notes: 'Iskusan u hitnoj medicini'
  }
];