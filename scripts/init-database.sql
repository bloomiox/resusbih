-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publish_date VARCHAR(20) NOT NULL,
    short_description TEXT NOT NULL,
    full_content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    audience VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    certification VARCHAR(255) NOT NULL,
    topics TEXT[] NOT NULL DEFAULT '{}',
    registration_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    spec VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    date_of_birth DATE,
    profession VARCHAR(255),
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completion_date DATE,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page_key VARCHAR(50) NOT NULL UNIQUE,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_date ON news_articles(publish_date);
CREATE INDEX IF NOT EXISTS idx_participants_course_id ON participants(course_id);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content(page_key);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO news_articles (title, publish_date, short_description, full_content, image_url) VALUES
('Osnivanje Udruženja', '08.08.2025.', 'S ponosom objavljujemo osnivanje Udruženja Resuscitacijski savjet u Bosni i Hercegovini.', 'Službeno je osnovano Udruženje Resuscitacijski savjet u Bosni i Hercegovini (Удружење Ресусцитацијски савјет у Босни и Херцеговини) dana 08.08.2025. godine.

Adresa sjedišta je: Bihać, ulica Jablanska broj 155.

Cilj udruženja je promicanje i unaprjeđenje znanja i vještina oživljavanja širom zemlje, u skladu s najnovijim europskim i svjetskim smjernicama. Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu spašavanja života.', 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUS%20LOGO%20(3).png'),

('Objavljene nove ERC smjernice za reanimaciju 2025', '25.09.2025.', 'Europski Resuscitacijski Savjet (ERC) objavio je ažurirane smjernice. Naše udruženje započinje s implementacijom u sve kurseve.', 'Kao i svakih pet godina, Europski Resuscitacijski Savjet (ERC) objavio je nove, ažurirane smjernice za oživljavanje. Nove smjernice stavljaju još veći naglasak na kvalitetu masaže srca, timsku suradnju i post-reanimacijsku skrb.

Naše udruženje, kao punopravni član ERC-a, odmah započinje proces implementacije novih smjernica u sve naše certificirane kurseve. Svi naši instruktori proći će dodatnu obuku kako bi osigurali da polaznici dobiju najsuvremenija znanja i vještine.', 'https://www.aspenmedical.ae/wp-content/uploads/2024/02/BLS-Left.jpg'),

('Zašto je važna rana defibrilacija? Uloga AVD uređaja.', '18.09.2025.', 'Automatski vanjski defibrilator (AVD) je uređaj koji može spasiti život. Saznajte zašto je njegova rana primjena ključna.', 'Kod iznenadnog srčanog zastoja, srce često uđe u stanje ventrikularne fibrilacije - kaotičnog, neučinkovitog treperenja. Jedini način da se ovaj poremećaj ritma prekine je primjena električnog šoka, odnosno defibrilacije.

Svaka minuta odgode defibrilacije smanjuje šansu za preživljavanje za oko 10%. Zbog toga je postavljanje AVD uređaja na javna mjesta (trgovački centri, zračne luke, sportski objekti) i edukacija laika o njihovoj uporabi od presudne važnosti. AVD uređaji su dizajnirani da budu jednostavni za korištenje i sigurni, te glasovnim uputama vode korisnika kroz cijeli postupak.', 'https://nursingexercise.com/wp-content/uploads/2023/04/Cardiopulmonary-resuscitation-cpr-procedure-in-hospital.jpg'),

('Kako prepoznati srčani zastoj i zašto je važno odmah djelovati?', '18.09.2025', 'Prepoznavanje znakova srčanog zastoja prvi je korak u lancu preživljavanja. Naučite ključne znakove.', 'Srčani zastoj je stanje u kojem srce prestaje pumpati krv, što dovodi do prestanka disanja i gubitka svijesti. Ključni znakovi za prepoznavanje su:

1.  **Osoba ne reagira:** Ne miče se, ne otvara oči i ne odgovara na dozivanje ili nježno protresanje.
2.  **Osoba ne diše normalno:** Može prestati disati ili imati agonalne udahe (nepravilno, bučno disanje slično hrkanju ili krkljanju).

Ako primijetite ove znakove, odmah pozovite hitnu medicinsku pomoć (124) i započnite s masažom srca. Ne bojte se djelovati - vaša reakcija može spasiti život. Svaka sekunda je važna!', 'https://www.rrcpr.com/wp-content/uploads/2020/07/BLS_Course.jpg');

INSERT INTO courses (title, description, audience, image_url, duration, certification, topics, registration_enabled) VALUES
('Osnovne vještine reanimacije', 'Naučite ključne vještine kardiopulmonalne reanimacije (KPR) i korištenja automatskog vanjskog defibrilatora (AVD).', 'Polaznici prve pomoći, studenti, nezdravstveni djelatnici', 'https://nursingexercise.com/wp-content/uploads/2023/04/Cardiopulmonary-resuscitation-cpr-procedure-in-hospital.jpg', '4 sata', 'Certifikat vrijedi 2 godine', ARRAY['Prepoznavanje srčanog zastoja', 'Kvalitetna masaža srca', 'Primjena umjetnog disanja', 'Sigurna uporaba AVD-a', 'Zbrinjavanje gušenja'], true),

('Napredni kurs oživljavanja', 'Kurs za zdravstvene djelatnike koji pokriva napredne tehnike oživljavanja, farmakoterapiju i vođenje tima.', 'Liječnici, medicinske sestre/tehničari', 'https://www.aspenmedical.ae/wp-content/uploads/2024/02/BLS-Left.jpg', '2 dana', 'ERC ALS Provider certifikat', ARRAY['Napredno osiguravanje dišnog puta', 'Prepoznavanje i terapija poremećaja ritma', 'Primjena lijekova u oživljavanju', 'Vođenje reanimacijskog tima (CRM)', 'Post-reanimacijska skrb'], true),

('Oživljavanje djece (PLS)', 'Specijalizirani kurs usmjeren na specifičnosti kardiopulmonalne reanimacije kod novorođenčadi, dojenčadi i djece.', 'Pedijatri, osoblje hitne pomoći', 'https://www.rrcpr.com/wp-content/uploads/2020/07/BLS_Course.jpg', '1 dan', 'Certifikat vrijedi 2 godine', ARRAY['Specifičnosti dječje anatomije i fiziologije', 'Oživljavanje novorođenčeta', 'Hitna stanja u pedijatriji', 'Timska dinamika'], false);

INSERT INTO team_members (name, role, spec, image_url) VALUES
('Spec. dr. med. Havić Hajrudin', 'Osnivač i predsjednik', 'Specijalista urgentne medicine', 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/Untitled%20design%20(10).png'),
('Spec. dr. med. Amel Mizić', 'Sekretar', 'Specijalista urgentne medicine', 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/Untitled%20design%20(11).png');

INSERT INTO page_content (page_key, content) VALUES
('home', '{"heroTitle": "Udruženje Resuscitacijski savjet u Bosni i Hercegovini", "heroSubtitle": "Znanje koje spašava živote", "aboutSection": "Naša misija je promicanje i unaprjeđenje znanja i vještina oživljavanja u Bosni i Hercegovini, kako među zdravstvenim djelatnicima, tako i u široj javnosti. Vjerujemo da edukacijom možemo značajno povećati stopu preživljavanja kod iznenadnog srčanog zastoja."}'),
('about', '{"title": "O nama", "content": "Udruženje Resuscitacijski savjet u Bosni i Hercegovini osnovano je s ciljem promicanja i unaprjeđenja znanja i vještina oživljavanja širom zemlje, u skladu s najnovijim europskim i svjetskim smjernicama. Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu spašavanja života."}'),
('contact', '{"title": "Kontakt", "content": "Kontaktirajte nas za više informacija o našim kursevima i aktivnostima. Naš tim stručnjaka spreman je odgovoriti na sva vaša pitanja."}');

-- Sample participants data
INSERT INTO participants (first_name, last_name, email, phone, address, date_of_birth, profession, course_id, course_name, registration_date, completion_date, certificate_issued, certificate_number, status, notes) VALUES
('Marko', 'Petrović', 'marko.petrovic@email.com', '+387 61 123 456', 'Sarajevo, Bosna i Hercegovina', '1985-03-15', 'Medicinska sestra', 1, 'Osnovne vještine reanimacije', '2025-01-15', '2025-01-20', true, 'RESUSBIH-2025-001', 'completed', 'Odličan polaznik, aktivno sudjelovanje'),
('Ana', 'Marić', 'ana.maric@email.com', '+387 62 234 567', 'Banja Luka, Bosna i Hercegovina', '1990-07-22', 'Liječnik', 2, 'Napredni kurs oživljavanja', '2025-01-10', '2025-01-12', true, 'RESUSBIH-2025-002', 'completed', 'Izvrsno znanje, preporučuje se za instruktora'),
('Stefan', 'Nikolić', 'stefan.nikolic@email.com', '+387 63 345 678', 'Tuzla, Bosna i Hercegovina', '1988-11-08', 'Medicinski tehničar', 1, 'Osnovne vještine reanimacije', '2025-01-18', NULL, false, NULL, 'registered', 'Čeka početak kursa'),
('Milica', 'Jovanović', 'milica.jovanovic@email.com', '+387 64 456 789', 'Mostar, Bosna i Hercegovina', '1992-05-14', 'Pedijatar', 3, 'Oživljavanje djece (PLS)', '2025-01-12', '2025-01-13', false, 'RESUSBIH-2025-003', 'completed', 'Završila kurs, čeka izdavanje certifikata'),
('Aleksandar', 'Stojanović', 'aleksandar.stojanovic@email.com', '+387 65 567 890', 'Zenica, Bosna i Hercegovina', '1987-09-30', 'Hitna pomoć', 2, 'Napredni kurs oživljavanja', '2025-01-20', NULL, false, NULL, 'registered', 'Iskusan u hitnoj medicini');

-- Enable Row Level Security (RLS)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON courses FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON team_members FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON participants FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON page_content FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to insert/update/delete
CREATE POLICY "Enable insert for authenticated users only" ON news_articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON news_articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON news_articles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON courses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON courses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON courses FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON team_members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all users" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON participants FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON participants FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON page_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON page_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON page_content FOR DELETE USING (auth.role() = 'authenticated');