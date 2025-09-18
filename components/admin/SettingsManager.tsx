import React, { useState } from 'react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    linkedin: string;
    instagram: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'RESUSBIH - Udruženje Resuscitacijski savjet u BiH',
    siteDescription: 'Znanje koje spašava živote',
    contactEmail: 'office@resusbih.org',
    contactPhone: '+387 XX XXX XXX',
    address: 'Jablanska 155, Bihać, Bosna i Hercegovina',
    socialMedia: {
      facebook: '',
      linkedin: 'https://www.linkedin.com/company/resusbih',
      instagram: '',
    },
    seo: {
      metaTitle: 'RESUSBIH - Resuscitacijski savjet Bosne i Hercegovine',
      metaDescription: 'Udruženje posvećeno promicanju znanja i vještina oživljavanja u BiH. Certificirani kursevi prve pomoći i reanimacije.',
      keywords: 'reanimacija, prva pomoć, kursevi, BiH, oživljavanje, CPR, AED',
    },
    maintenance: {
      enabled: false,
      message: 'Sajt je trenutno u održavanju. Molimo pokušajte kasnije.',
    },
  });

  const [activeSection, setActiveSection] = useState<'general' | 'contact' | 'social' | 'seo' | 'maintenance'>('general');
  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...prev[section], [field]: value }
        : value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    alert('Postavke su uspješno spremljene!');
  };

  const sections = [
    { id: 'general' as const, label: 'Opće postavke', icon: '🏠' },
    { id: 'contact' as const, label: 'Kontakt informacije', icon: '📞' },
    { id: 'social' as const, label: 'Društvene mreže', icon: '📱' },
    { id: 'seo' as const, label: 'SEO postavke', icon: '🔍' },
    { id: 'maintenance' as const, label: 'Održavanje', icon: '🔧' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Postavke sajta</h2>
          <p className="text-gray-600">Upravljajte osnovnim postavkama vašeg sajta</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>💾</span>
            <span>Spremi promjene</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeSection === 'general' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-blue mb-4">Opće postavke</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Naziv sajta</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => updateSettings('siteName', '', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opis sajta</label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => updateSettings('siteDescription', '', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-blue mb-4">Kontakt informacije</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email adresa</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSettings('contactEmail', '', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => updateSettings('contactPhone', '', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresa</label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => updateSettings('address', '', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeSection === 'social' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-blue mb-4">Društvene mreže</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => updateSettings('socialMedia', 'facebook', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="https://facebook.com/resusbih"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => updateSettings('socialMedia', 'linkedin', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="https://linkedin.com/company/resusbih"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => updateSettings('socialMedia', 'instagram', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="https://instagram.com/resusbih"
                  />
                </div>
              </div>
            )}

            {activeSection === 'seo' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-blue mb-4">SEO postavke</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta naslov</label>
                  <input
                    type="text"
                    value={settings.seo.metaTitle}
                    onChange={(e) => updateSettings('seo', 'metaTitle', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Preporučeno: 50-60 znakova</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta opis</label>
                  <textarea
                    value={settings.seo.metaDescription}
                    onChange={(e) => updateSettings('seo', 'metaDescription', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Preporučeno: 150-160 znakova</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ključne riječi</label>
                  <input
                    type="text"
                    value={settings.seo.keywords}
                    onChange={(e) => updateSettings('seo', 'keywords', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="reanimacija, prva pomoć, kursevi..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Odvojite zarezom</p>
                </div>
              </div>
            )}

            {activeSection === 'maintenance' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-blue mb-4">Režim održavanja</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={settings.maintenance.enabled}
                    onChange={(e) => updateSettings('maintenance', 'enabled', e.target.checked)}
                    className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  />
                  <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
                    Aktiviraj režim održavanja
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poruka za korisnike</label>
                  <textarea
                    value={settings.maintenance.message}
                    onChange={(e) => updateSettings('maintenance', 'message', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                {settings.maintenance.enabled && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <span className="text-yellow-400 text-xl mr-3">⚠️</span>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Režim održavanja je aktivan</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Korisnici neće moći pristupiti sajtu i vidjet će poruku o održavanju.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;