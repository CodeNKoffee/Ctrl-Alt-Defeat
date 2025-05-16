"use client";
import { useState, useEffect } from "react";
import WorkshopInterface from "../../../../../components/WorkshopInterface";

// Mock data (replace with API call if needed)
const sampleWorkshops = [
  {
    id: 1,
    title: "Introduction to Web Design",
    imageUrl: "/images/Workshop1.jpeg", // Use your existing image
    instructor: "Natalie Storm",
    instructorImage: "/images/icons8-avatar-50 (1).png", // Use your existing instructor image
    instructorBio: "Freelance designer, motion and graphic design enthusiast",
    date: new Date(),
    time: "10:00 AM - 12:00 PM",
    location: "Online",
    seatsAvailable: 15,
    description: "Learn the basics of web design and user experience.",
    prerequisites: "Basic computer skills",
  },
  {
    id: 2,
    title: "Advanced React Techniques",
    imageUrl: "/images/Workshop2.jpeg",
    instructor: "Alex Johnson",
    instructorImage: "/images/icons8-avatar-50.png",
    instructorBio: "Senior developer with 10+ years of experience",
    date: new Date(),
    time: "2:00 PM - 4:00 PM",
    location: "Online",
    seatsAvailable: 20,
    description: "Deep dive into React hooks and performance optimization.",
    prerequisites: "Intermediate React knowledge",
  },
];

export default function LiveWorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  useEffect(() => {
    // Client-side initialization if needed
  }, []);

  const handleBackFromWorkshop = () => {
    setSelectedWorkshop(null);
  };

  if (typeof window === "undefined") {
    return <div>Loading...</div>; // Fallback for SSR
  }

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Workshop List - Shown when no workshop is selected */}
      {!selectedWorkshop && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", textAlign: "left", color: "#2a5f74", position: "relative" }}>
              UPCOMING WORKSHOPS
              <span style={{ position: "absolute", bottom: "0", left: "0", width: "96px", height: "4px", backgroundColor: "#2a5f74" }}></span>
            </h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {sampleWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                onClick={() => setSelectedWorkshop(workshop)}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #86CBDA",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", height: "160px" }}>
                  <img
                    src={workshop.imageUrl}
                    alt={workshop.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px"
                    }}
                  />
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                    <img
                      src={workshop.instructorImage}
                      alt={workshop.instructor}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "8px",
                        border: "2px solid #318FA8"
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#2A5F74", fontWeight: "500" }}>
                      {workshop.instructor}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#2A5F74",
                    marginBottom: "8px"
                  }}>
                    {workshop.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workshop Interface - Shown when a workshop is selected */}
      {selectedWorkshop && (
        <WorkshopInterface workshop={selectedWorkshop} onBack={handleBackFromWorkshop} />
      )}
    </div>
  );
}