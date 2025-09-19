const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to database
    await db.connect();

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'office@resusbih.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AmelWeb1.1';
    
    // Check if admin user already exists
    const existingAdmin = await db.get('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await db.run(`
        INSERT INTO users (email, password_hash, role)
        VALUES (?, ?, 'admin')
      `, [adminEmail, hashedPassword]);
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Insert sample data
    await insertSampleData();
    
    console.log('✅ Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  // Insert sample news
  const newsData = [
    {
      title: 'Osnivanje Udruženja',
      publish_date: '08.08.2025.',
      short_description: 'S ponosom objavljujemo osnivanje Udruženja Resuscitacijski savjet u Bosni i Hercegovini.',
      full_content: `Službeno je osnovano Udruženje Resuscitacijski savjet u Bosni i Hercegovini (Удружење Ресусцитацијски савјет у Босни и Херцеговини) dana 08.08.2025. godine.

Adresa sjedišta je: Bihać, ulica Jablanska broj 155.

Cilj udruženja je promicanje i unaprjeđenje znanja i vještina oživljavanja širom zemlje, u skladu s najnovijim europskim i svjetskim smjernicama. Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu spašavanja života.`,
      image_url: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUS%20LOGO%20(3).png'
    },
    {
      title: 'Objavljene nove ERC smjernice za reanimaciju 2025',
      publish_date: '25.09.2025.',
      short_description: 'Europski Resuscitacijski Savjet (ERC) objavio je ažurirane smjernice. Naše udruženje započinje s implementacijom u sve kurseve.',
      full_content: `Kao i svakih pet godina, Europski Resuscitacijski Savjet (ERC) objavio je nove, ažurirane smjernice za oživljavanje. Nove smjernice stavljaju još veći naglasak na kvalitetu masaže srca, timsku suradnju i post-reanimacijsku skrb.

Naše udruženje, kao punopravni član ERC-a, odmah započinje proces implementacije novih smjernica u sve naše certificirane kurseve. Svi naši instruktori proći će dodatnu obuku kako bi osigurali da polaznici dobiju najsuvremenija znanja i vještine.`,
      image_url: 'https://www.aspenmedical.ae/wp-content/uploads/2024/02/BLS-Left.jpg'
    }
  ];

  for (const news of newsData) {
    const existing = await db.get('SELECT id FROM news WHERE title = ?', [news.title]);
    if (!existing) {
      await db.run(`
        INSERT INTO news (title, publish_date, short_description, full_content, image_url)
        VALUES (?, ?, ?, ?, ?)
      `, [news.title, news.publish_date, news.short_description, news.full_content, news.image_url]);
    }
  }

  // Insert sample courses
  const coursesData = [
    {
      title: 'Osnovne vještine reanimacije',
      description: 'Naučite ključne vještine kardiopulmonalne reanimacije (KPR) i korištenja automatskog vanjskog defibrilatora (AVD).',
      audience: 'Polaznici prve pomoći, studenti, nezdravstveni djelatnici',
      image_url: 'https://nursingexercise.com/wp-content/uploads/2023/04/Cardiopulmonary-resuscitation-cpr-procedure-in-hospital.jpg',
      duration: '4 sata',
      certification: 'Certifikat vrijedi 2 godine',
      topics: JSON.stringify([
        'Prepoznavanje srčanog zastoja',
        'Kvalitetna masaža srca',
        'Primjena umjetnog disanja',
        'Sigurna uporaba AVD-a',
        'Zbrinjavanje gušenja'
      ]),
      registration_enabled: 0
    },
    {
      title: 'Napredni kurs oživljavanja',
      description: 'Kurs za zdravstvene djelatnike koji pokriva napredne tehnike oživljavanja, farmakoterapiju i vođenje tima.',
      audience: 'Liječnici, medicinske sestre/tehničari',
      image_url: 'https://www.aspenmedical.ae/wp-content/uploads/2024/02/BLS-Left.jpg',
      duration: '2 dana',
      certification: 'ERC ALS Provider certifikat',
      topics: JSON.stringify([
        'Napredno osiguravanje dišnog puta',
        'Prepoznavanje i terapija poremećaja ritma',
        'Primjena lijekova u oživljavanju',
        'Vođenje reanimacijskog tima (CRM)',
        'Post-reanimacijska skrb'
      ]),
      registration_enabled: 0
    }
  ];

  for (const course of coursesData) {
    const existing = await db.get('SELECT id FROM courses WHERE title = ?', [course.title]);
    if (!existing) {
      await db.run(`
        INSERT INTO courses (title, description, audience, image_url, duration, certification, topics, registration_enabled)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [course.title, course.description, course.audience, course.image_url, course.duration, course.certification, course.topics, course.registration_enabled]);
    }
  }

  // Insert sample team members
  const teamData = [
    {
      name: 'Spec. dr. med. Havić Hajrudin',
      role: 'Osnivač i predsjednik',
      specialization: 'Specijalista urgentne medicine',
      image_url: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/Untitled%20design%20(10).png'
    },
    {
      name: 'Spec. dr. med. Amel Mizić',
      role: 'Sekretar',
      specialization: 'Specijalista urgentne medicine',
      image_url: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/Untitled%20design%20(11).png'
    }
  ];

  for (const member of teamData) {
    const existing = await db.get('SELECT id FROM team_members WHERE name = ?', [member.name]);
    if (!existing) {
      await db.run(`
        INSERT INTO team_members (name, role, specialization, image_url)
        VALUES (?, ?, ?, ?)
      `, [member.name, member.role, member.specialization, member.image_url]);
    }
  }

  // Insert sample page content
  const pageContentData = [
    {
      page_key: 'home',
      content: JSON.stringify({
        heroTitle: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini',
        heroSubtitle: 'Znanje koje spašava živote',
        aboutSection: 'Naša misija je promicanje i unaprjeđenje znanja i vještina oživljavanja u Bosni i Hercegovini, kako među zdravstvenim djelatnicima, tako i u široj javnosti. Vjerujemo da edukacijom možemo značajno povećati stopu preživljavanja kod iznenadnog srčanog zastoja.'
      })
    },
    {
      page_key: 'about',
      content: JSON.stringify({
        title: 'O nama',
        content: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini osnovano je s ciljem promicanja i unaprjeđenja znanja i vještina oživljavanja širom zemlje, u skladu s najnovijim europskim i svjetskim smjernicama. Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu spašavanja života.'
      })
    },
    {
      page_key: 'contact',
      content: JSON.stringify({
        title: 'Kontakt',
        content: 'Kontaktirajte nas za više informacija o našim kursevima i aktivnostima. Naš tim stručnjaka spreman je odgovoriti na sva vaša pitanja.'
      })
    }
  ];

  for (const content of pageContentData) {
    const existing = await db.get('SELECT id FROM page_content WHERE page_key = ?', [content.page_key]);
    if (!existing) {
      await db.run(`
        INSERT INTO page_content (page_key, content)
        VALUES (?, ?)
      `, [content.page_key, content.content]);
    }
  }

  console.log('✅ Sample data inserted');
}

// Run initialization
initializeDatabase();