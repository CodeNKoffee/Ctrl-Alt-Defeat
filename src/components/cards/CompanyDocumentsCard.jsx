import { faFile, faFilePdf, faFileImage, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function CompanyDocumentsCard({ documents = [] }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  return (
    <div className="companydocumentscard-root">
      <div className="companydocumentscard-title">{safeT('scad.companyDetails.verificationDocs')}</div>
      <div className="companydocumentscard-list">
        {documents.length === 0 && <div className="companydocumentscard-empty">{safeT('scad.companyDetails.noDocuments')}</div>}
        {documents.map((doc, idx) => (
          <div key={idx} className="companydocumentscard-item">
            <FontAwesomeIcon icon={faFile} className="text-metallica-blue-500 text-2xl" />
            <div className="companydocumentscard-item-info">
              <span className="companydocumentscard-item-name">{doc.name || doc.url.split('/').pop()}</span>
              <span className="companydocumentscard-item-type">{(doc.type || doc.url.split('.').pop() || '').toUpperCase()}</span>
            </div>
            <a href={doc.url} download className="companydocumentscard-download" title="Download">
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 