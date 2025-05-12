import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
});

export default function ReportPDF({ data, dateRange }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Statistics Report</Text>
          <Text style={styles.text}>
            Date Range: {dateRange.start.toDateString()} - {dateRange.end.toDateString()}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Summary</Text>
          <Text style={styles.text}>Total Reports: {data.totalReports}</Text>
          <Text style={styles.text}>Accepted Reports: {data.accepted}</Text>
          <Text style={styles.text}>Flagged Reports: {data.flagged}</Text>
          <Text style={styles.text}>Average Review Time: {data.avgReviewTime}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Top Courses</Text>
          {data.topCourses.map((course, index) => (
            <Text key={index} style={styles.text}>
              {course.name}: {course.count} reports
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Top Companies</Text>
          {data.topCompanies.map((company, index) => (
            <Text key={index} style={styles.text}>
              {company.name}: {company.rating} stars
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}