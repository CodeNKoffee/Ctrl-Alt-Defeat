import Image from "next/image";

export default function CompanyDetailsBig({ version, companyName, companyEmail, companyLogo, industry, size, documentation, onCollapse }) {
  return (
    <div id={version} className="company-details">
      <div className="tab">Company Details</div>
      <div className="company-content">
        <div className="row-one">
          <div className="comp-cont profile-info">
            <div className="image-container">
              <Image
                className="company-logo"
                alt="Company Logo"
                src={companyLogo}
                width={100}
                height={100}
              />
            </div>
            <div className="company-name">{companyName}</div>
            <div className="company-email">{companyEmail}</div>
          </div>
          <div className="notepad">
            <div className="note">Note Pad</div>
            <div className="comp-cont note-container">
              <input
                type="text"
                className="note-input"
                placeholder="Add notes here..."
              />
              <input
                type="text"
                className="note-input"
                placeholder="Add notes here..."
              />
              <input
                type="text"
                className="note-input"
                placeholder="Add notes here..."
              />
            </div>
          </div>
        </div>
        <div className="row-two">
          <div className="comp-cont documentations">
            <h3>Documentation</h3>
            {documentation.map((doc, index) => (
              <div key={index} className="doc-item">
                <span>{doc.type}</span>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </div>
            ))}
          </div>
          <div className="comp-cont industry">
            <h3>Industry</h3>
            <p>{industry}</p>
          </div>
          <div className="comp-cont company-size">
            <h3>Company Size</h3>
            <p>{size}</p>
          </div>
        </div>
      </div>
      <div className="verdict">
        <button className="accept" onClick={onCollapse}>Collapse</button>
        <button className="reject">Reject</button>
      </div>
    </div>
  );
}