import React, { useRef } from 'react';
import { CourseParticipant } from '../../types';

interface CertificateGeneratorProps {
  participant: CourseParticipant;
  onClose: () => void;
  onCertificateIssued: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  participant,
  onClose,
  onCertificateIssued,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = certificateRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certifikat - ${participant.firstName} ${participant.lastName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', serif;
              background: white;
              padding: 0;
              margin: 0;
            }
            .certificate {
              width: 210mm;
              height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              background: white;
              position: relative;
              border: 3px solid #1e40af;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: 10mm;
              left: 10mm;
              right: 10mm;
              bottom: 10mm;
              border: 1px solid #3b82f6;
              pointer-events: none;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
            }
            .org-name {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
              line-height: 1.2;
            }
            .org-subtitle {
              font-size: 16px;
              color: #374151;
              margin-bottom: 30px;
            }
            .certificate-title {
              font-size: 36px;
              font-weight: bold;
              color: #1e40af;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 30px;
              text-align: center;
            }
            .certificate-text {
              font-size: 18px;
              line-height: 1.8;
              text-align: center;
              margin-bottom: 40px;
              color: #374151;
            }
            .participant-name {
              font-size: 32px;
              font-weight: bold;
              color: #1e40af;
              text-decoration: underline;
              margin: 20px 0;
              text-align: center;
            }
            .course-name {
              font-size: 24px;
              font-weight: bold;
              color: #dc2626;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 60px;
              padding-top: 30px;
            }
            .signature-section {
              text-align: center;
              flex: 1;
            }
            .signature-line {
              border-top: 2px solid #374151;
              width: 200px;
              margin: 40px auto 10px;
            }
            .signature-title {
              font-size: 14px;
              font-weight: bold;
              color: #374151;
            }
            .signature-name {
              font-size: 16px;
              color: #1e40af;
              margin-top: 5px;
            }
            .certificate-info {
              text-align: center;
              margin-top: 40px;
              font-size: 12px;
              color: #6b7280;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              color: rgba(30, 64, 175, 0.05);
              font-weight: bold;
              z-index: 0;
              pointer-events: none;
            }
            .content {
              position: relative;
              z-index: 1;
            }
            @media print {
              body { margin: 0; }
              .certificate { 
                width: 100%; 
                height: 100vh; 
                margin: 0; 
                padding: 15mm;
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadPDF = async () => {
    // For a real implementation, you would use a library like jsPDF or html2pdf
    // For now, we'll use the browser's print to PDF functionality
    handlePrint();
  };

  const handleIssueCertificate = () => {
    onCertificateIssued();
    alert('Certifikat je uspješno izdan!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hr-HR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generator certifikata</h2>
          <p className="text-gray-600">
            Certifikat za: {participant.firstName} {participant.lastName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>

      {/* Certificate Preview */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div 
          ref={certificateRef}
          className="certificate bg-white border-4 border-brand-blue relative"
          style={{ 
            width: '210mm', 
            height: '297mm', 
            padding: '20mm',
            margin: '0 auto',
            transform: 'scale(0.6)',
            transformOrigin: 'top center'
          }}
        >
          {/* Watermark */}
          <div className="watermark">RESUSBIH</div>
          
          {/* Content */}
          <div className="content">
            {/* Header */}
            <div className="header text-center mb-8">
              <img 
                src="https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png" 
                alt="RESUSBIH Logo" 
                className="logo w-20 h-20 mx-auto mb-5"
              />
              <div className="org-name text-2xl font-bold text-brand-blue mb-2 leading-tight">
                UDRUŽENJE RESUSCITACIJSKI SAVJET<br />
                U BOSNI I HERCEGOVINI
              </div>
              <div className="org-subtitle text-base text-gray-600 mb-8">
                Jablanska 155, Bihać • office@resusbih.org
              </div>
            </div>

            {/* Certificate Title */}
            <div className="certificate-title text-4xl font-bold text-brand-blue uppercase tracking-wider mb-8 text-center">
              CERTIFIKAT
            </div>

            {/* Certificate Text */}
            <div className="certificate-text text-lg leading-relaxed text-center mb-10 text-gray-700">
              Ovim se potvrđuje da je
            </div>

            {/* Participant Name */}
            <div className="participant-name text-3xl font-bold text-brand-blue underline mb-5 text-center">
              {participant.firstName} {participant.lastName}
            </div>

            {/* Course Text */}
            <div className="certificate-text text-lg leading-relaxed text-center mb-5 text-gray-700">
              uspješno završio/završila kurs
            </div>

            {/* Course Name */}
            <div className="course-name text-2xl font-bold text-red-600 mb-10 text-center">
              "{participant.courseName}"
            </div>

            {/* Completion Text */}
            <div className="certificate-text text-lg leading-relaxed text-center mb-12 text-gray-700">
              dana {participant.completionDate ? formatDate(participant.completionDate) : 'N/A'} godine<br />
              u skladu sa smjernicama Europskog Resuscitacijskog Savjeta (ERC)
            </div>

            {/* Footer with Signatures */}
            <div className="footer flex justify-between items-end mt-16 pt-8">
              <div className="signature-section text-center flex-1">
                <div className="signature-line border-t-2 border-gray-700 w-48 mx-auto mb-2"></div>
                <div className="signature-title text-sm font-bold text-gray-700">Predsjednik</div>
                <div className="signature-name text-base text-brand-blue mt-1">
                  Spec. dr. med. Havić Hajrudin
                </div>
              </div>
              
              <div className="signature-section text-center flex-1">
                <div className="signature-line border-t-2 border-gray-700 w-48 mx-auto mb-2"></div>
                <div className="signature-title text-sm font-bold text-gray-700">Sekretar</div>
                <div className="signature-name text-base text-brand-blue mt-1">
                  Spec. dr. med. Amel Mizić
                </div>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="certificate-info text-center mt-10 text-xs text-gray-500">
              <div>Broj certifikata: {participant.certificateNumber}</div>
              <div>Datum izdavanja: {formatDate(new Date().toISOString().split('T')[0])}</div>
              <div className="mt-2">www.resusbih.org</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>🖨️</span>
          <span>Ispiši certifikat</span>
        </button>
        
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>📄</span>
          <span>Preuzmi PDF</span>
        </button>

        {!participant.certificateIssued && (
          <button
            onClick={handleIssueCertificate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>✅</span>
            <span>Označi kao izdan</span>
          </button>
        )}
      </div>

      {participant.certificateIssued && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <span className="text-green-800 font-medium">
            ✅ Certifikat je već izdan za ovog polaznika
          </span>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;