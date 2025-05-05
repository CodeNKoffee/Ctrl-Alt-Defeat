import { faFile, faFilePdf, faFileImage, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CompanyDocumentsCard({ documents = [] }) {
  return (
    <div className="companydocumentscard-root">
      <div className="companydocumentscard-title">Verification Documents</div>
      <div className="companydocumentscard-list">
        {documents.length === 0 && <div className="companydocumentscard-empty">No documents provided.</div>}
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