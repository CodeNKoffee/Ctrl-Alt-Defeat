"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman', // Built-in font
    fontSize: 10,
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  listItem: {
    marginLeft: 8,
  },
});

export default function ReportPDF({ data, dateRange }) {
  const latestCycleName = Object.keys(data.cycles).slice(-1)[0];
  const latestCycleData = data.cycles[latestCycleName];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.title}>Statistics Report</Text>
          <Text style={styles.text}>
            Date Range: {dateRange.start.toDateString()} - {dateRange.end.toDateString()}
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Summary</Text>
          <Text style={styles.text}>Total Reports: {data.totalReports}</Text>
          <Text style={styles.text}>Average Review Time: {data.avgReviewTime}</Text>
        </View>

        {/* Latest Cycle Stats */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Latest Cycle: {latestCycleName}</Text>
          <Text style={styles.text}>Accepted Reports: {latestCycleData.accepted}</Text>
          <Text style={styles.text}>Flagged Reports: {latestCycleData.flagged}</Text>
          <Text style={styles.text}>Rejected Reports: {latestCycleData.rejected}</Text>
        </View>

        {/* Top Courses */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Top Courses</Text>
          {data.topCourses.map((course, index) => (
            <Text key={index} style={[styles.text, styles.listItem]}>
              • {course.name} — {course.count} reports (Rating: {course.rating})
            </Text>
          ))}
        </View>

        {/* Top Companies */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Top Companies</Text>
          {data.topCompanies.map((company, index) => (
            <Text key={index} style={[styles.text, styles.listItem]}>
              • {company.name} — Rating: {company.rating}
            </Text>
          ))}
        </View>

        {/* Top Internship Companies */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>Top Internship Companies</Text>
          {data.topInternshipCompanies.map((company, index) => (
            <Text key={index} style={[styles.text, styles.listItem]}>
              • {company.name} — {company.count} internships
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
