"use client"
import { useState, useEffect } from "react"
import Report from "@/components/Report"
import Header from "@/components/Header"
import ReportTiles from "@/components/ReportTiles"
import ReportEdit from "@/components/ReportEdit"
import DeleteTileConfirmation from "@/components/DeleteTileConfirmation"
import StatusBadge from "@/components/shared/StatusBadge"

export default function ReportDashboard(){
    const [reports, setReports] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);

    //const handleAddReport = (ReportData) => {
      //  setReports((prev) => [...prev, ReportData]);
    //};

    const handleAddReport = (newReport) => {
        setReports((prev) => [...prev, newReport]);
    };

    const handleUpdateReport = (updatedReport) => {
        setReports((prev) =>
        prev.map((Report, i) => (i === editIndex ? updatedReport : Report))
        );
        setEditIndex(null);
    };

    const handleDeleteReport = () => {
        setReports((prev) => prev.filter((_, i) => i !== deleteIndex));
        setDeleteIndex(null);
    };

    return(
        <div>
            <Header text="My Reports" size="text-6xl"></Header>
            <ReportTiles 
                tiles={reports.map(report => ({
                    ...report,
                    major: report.major || "N/A",
                    selectedCourses: report.selectedCourses || []
                }))} 
                onEditClick={(index) => setEditIndex(index)}
                onDeleteClick={(index) => setDeleteIndex(index)}
            ></ReportTiles>
            <Report onAddTile={handleAddReport}></Report>
            {editIndex !== null && (
                <ReportEdit
                report={reports[editIndex]}
                onSave={handleUpdateReport}
                onCancel={() => setEditIndex(null)}
                />
            )}
            {deleteIndex !== null && (
                <DeleteTileConfirmation
                type="report"
                onConfirm={handleDeleteReport}
                onCancel={() => setDeleteIndex(null)}
                />
            )}
        </div>
    )
}