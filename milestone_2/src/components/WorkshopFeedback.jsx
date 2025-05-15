import { useState } from 'react';
import { FaStar, FaDownload, FaEye } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WorkshopFeedback = ({ isOpen, onClose, workshopTitle, studentName, workshopEnded }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '500px',
    zIndex: 1000,
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px 24px',
    background: '#318FA8',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
  };

  const generateCertificate = async () => {
    const certificateHtml = `
      <div id="certificate" style="
        width: 800px;
        height: 600px;
        padding: 40px;
        background-color: white;
        position: relative;
        font-family: 'IBM Plex Sans', sans-serif;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 15px solid #318FA8;
          border-radius: 10px;
        "></div>
        <div style="
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        ">
          <div style="
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 14px;
            color: #2A5F74;
          ">Date: ${new Date().toLocaleDateString()}</div>
          <h1 style="
            font-size: 48px;
            color: #318FA8;
            margin-bottom: 30px;
            font-weight: bold;
          ">Certificate of Completion</h1>
          <p style="
            font-size: 24px;
            color: #2A5F74;
            line-height: 1.6;
            margin-bottom: 40px;
          ">This is to certify that</p>
          <h2 style="
            font-size: 36px;
            color: #318FA8;
            margin-bottom: 20px;
            font-weight: bold;
          ">${studentName}</h2>
          <p style="
            font-size: 24px;
            color: #2A5F74;
            line-height: 1.6;
          ">has successfully completed the workshop:</p>
          <h3 style="
            font-size: 30px;
            color: #318FA8;
            margin: 20px 0;
            font-weight: 600;
          ">${workshopTitle}</h3>
          <div style="
            margin-top: 60px;
            width: 200px;
            border-top: 2px solid #318FA8;
            padding-top: 10px;
            font-style: italic;
            color: #2A5F74;
          ">Instructor Signature</div>
        </div>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = certificateHtml;
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv.firstChild);
    document.body.removeChild(tempDiv);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 800, 600);
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setCertificateUrl(url);
    pdf.save(`${workshopTitle}-Certificate.pdf`);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please rate the workshop before submitting');
      return;
    }
    setShowCertificate(true);
  };

  const viewCertificate = () => {
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
    }
  };

  if (!isOpen || !workshopEnded) return null;

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        {!showCertificate ? (
          <>
            <h2 style={{ color: '#2A5F74', marginBottom: '20px', textAlign: 'center' }}>
              Workshop Feedback
            </h2>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#2A5F74', marginBottom: '10px' }}>How would you rate this workshop?</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      color: star <= rating ? '#318FA8' : '#D9F0F4',
                      cursor: 'pointer',
                    }}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about the workshop..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #318FA8',
                marginBottom: '20px',
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
              <button onClick={handleSubmit} style={buttonStyle}>
                Submit Feedback
              </button>
              <button
                onClick={onClose}
                style={{
                  ...buttonStyle,
                  background: '#D9F0F4',
                  color: '#2A5F74',
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#2A5F74', marginBottom: '20px' }}>
              Thank you for your feedback!
            </h2>
            <p style={{ marginBottom: '30px', color: '#2A5F74' }}>
              You can now download your certificate of attendance.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button onClick={generateCertificate} style={buttonStyle}>
                <FaDownload /> Download Certificate
              </button>
              {certificateUrl && (
                <button onClick={viewCertificate} style={{...buttonStyle, background: '#2A5F74'}}>
                  <FaEye /> View Certificate
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkshopFeedback;