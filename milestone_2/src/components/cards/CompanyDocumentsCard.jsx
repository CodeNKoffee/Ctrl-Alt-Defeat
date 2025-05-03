import { faFile, faFilePdf, faFileImage, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function getFileIcon(type) {
  if (!type) return <FontAwesomeIcon icon={faFile} className="text-gray-400 text-2xl" />;
  if (type.toLowerCase().includes('pdf')) return <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-2xl" />;
  if (type.toLowerCase().includes('png') || type.toLowerCase().includes('jpg') || type.toLowerCase().includes('jpeg')) return <FontAwesomeIcon icon={faFileImage} className="text-blue-400 text-2xl" />;
  return <FontAwesomeIcon icon={faFile} className="text-gray-400 text-2xl" />;
}

export default function CompanyDocumentsCard({ documents = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-all border border-gray-200 w-full">
      <div className="text-lg font-bold text-gray-800 mb-2 text-center">Verification Documents</div>
      <div className="flex flex-col gap-3 w-full items-center">
        {documents.length === 0 && <div className="text-gray-400 text-sm text-center">No documents provided.</div>}
        {documents.map((doc, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 w-full max-w-xs border border-gray-100 hover:bg-gray-100 shadow-sm">
            {getFileIcon(doc.type || doc.url)}
            <div className="flex flex-col flex-1 items-center text-center">
              <span className="font-medium text-gray-800">{doc.name || doc.url.split('/').pop()}</span>
              <span className="text-xs text-gray-500 uppercase mt-1">{(doc.type || doc.url.split('.').pop() || '').toUpperCase()}</span>
            </div>
            <a href={doc.url} download className="text-blue-600 hover:text-blue-800 p-1" title="Download">
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 