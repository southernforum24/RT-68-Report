import Papa from 'papaparse';
import { StudentScore, Statistics, Logos } from '../types';
import { mockStatistics } from './mockData';

const SHEET_ID = '18xcxFG0sezTQm7Eg5_4WU-ts1wXo-6mXOPNxALrc66g';
const STUDENTS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
const STATS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=644248229`;
const LOGOS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=983535933`; // logos sheet

export const fetchOnetData = async (): Promise<{ students: StudentScore[], statistics: Statistics, logos: Logos }> => {
  try {
    const [studentsRes, statsRes, logosRes] = await Promise.all([
      fetch(STUDENTS_CSV_URL),
      fetch(STATS_CSV_URL),
      fetch(LOGOS_CSV_URL)
    ]);

    if (!studentsRes.ok || !statsRes.ok) {
      throw new Error('Failed to fetch CSV data');
    }

    const studentsCsv = await studentsRes.text();
    const statsCsv = await statsRes.text();
    const logosCsv = logosRes.ok ? await logosRes.text() : '';

    const students: StudentScore[] = [];
    let stats: Statistics = { ...mockStatistics };
    let logos: Logos = { obec: null, school: null, niets: null };

    // Helper to convert Google Drive links to direct image links
    const getDirectImageUrl = (url: string) => {
      if (!url) return null;
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // Use lh3.googleusercontent.com which has better CORS support for html2canvas
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
      }
      return url;
    };

    // Parse Logos from A1, A2, A3
    if (logosCsv) {
      Papa.parse(logosCsv, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as string[][];
          // A1 = School, A2 = OBEC, A3 = NIETS
          if (data.length > 0 && data[0].length > 0) {
            const val = String(data[0][0]).trim();
            if (val.startsWith('http')) logos.school = getDirectImageUrl(val);
          }
          if (data.length > 1 && data[1].length > 0) {
            const val = String(data[1][0]).trim();
            if (val.startsWith('http')) logos.obec = getDirectImageUrl(val);
          }
          if (data.length > 2 && data[2].length > 0) {
            const val = String(data[2][0]).trim();
            if (val.startsWith('http')) logos.niets = getDirectImageUrl(val);
          }
        }
      });
    }

    // Parse Students
    Papa.parse(studentsCsv, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as string[][];
        
        let headerRowIdx = -1;
        for (let i = 0; i < Math.min(20, data.length); i++) {
          if (data[i].some(cell => {
            const str = String(cell).replace(/\s+/g, '');
            return str.includes('ชื่อ-สกุล') || str === 'ชื่อ' || str === 'name';
          })) {
            headerRowIdx = i;
            break;
          }
        }

        if (headerRowIdx !== -1) {
          let nameIdx = -1, thaiIdx = -1, mathIdx = -1, sciIdx = -1, engIdx = -1;
          const searchRows = [data[headerRowIdx], data[headerRowIdx + 1], data[headerRowIdx + 2]].filter(Boolean);
          
          nameIdx = data[headerRowIdx].findIndex(cell => {
            const str = String(cell).replace(/\s+/g, '');
            return str.includes('ชื่อ-สกุล') || str === 'ชื่อ' || str === 'name';
          });
          
          searchRows.forEach(row => {
            row.forEach((cell, idx) => {
              const val = String(cell).toLowerCase();
              if (val.includes('ไทย') || val.includes('thai')) thaiIdx = idx;
              if (val.includes('คณิต') || val.includes('math')) mathIdx = idx;
              if (val.includes('วิทย') || val.includes('science')) sciIdx = idx;
              if (val.includes('อังกฤษ') || val.includes('english')) engIdx = idx;
            });
          });

          for (let i = headerRowIdx + 1; i < data.length; i++) {
            const row = data[i];
            const name = nameIdx > -1 ? String(row[nameIdx]).trim() : '';
            
            if (!name || name === 'ปรนัย' || name === 'อัตนัย' || name === 'รวม') continue;

            const scores = {
              thai_obj: thaiIdx > -1 ? parseFloat(row[thaiIdx]) || 0 : 0,
              thai_sub: thaiIdx > -1 ? parseFloat(row[thaiIdx + 1]) || 0 : 0,
              thai: thaiIdx > -1 ? parseFloat(row[thaiIdx + 2]) || 0 : 0,
              math: mathIdx > -1 ? parseFloat(row[mathIdx]) || 0 : 0,
              science: sciIdx > -1 ? parseFloat(row[sciIdx]) || 0 : 0,
              english: engIdx > -1 ? parseFloat(row[engIdx]) || 0 : 0,
            };

            if (!name.includes('เฉลี่ย') && !name.includes('โรงเรียน') && !name.includes('เขต') && !name.includes('จังหวัด') && !name.includes('ประเทศ')) {
              students.push({ id: String(i), name, scores });
            }
          }
        }
      }
    });

    // Parse Statistics
    Papa.parse(statsCsv, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as string[][];
        
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const name = String(row[0]).trim();
          
          if (!name) continue;

          // Based on the CSV structure:
          // Col 1: thai_obj, Col 2: thai_sub, Col 3: thai, Col 4: english, Col 5: math, Col 6: science
          const scores = {
            thai_obj: parseFloat(row[1]) || 0,
            thai_sub: parseFloat(row[2]) || 0,
            thai: parseFloat(row[3]) || 0,
            english: parseFloat(row[4]) || 0,
            math: parseFloat(row[5]) || 0,
            science: parseFloat(row[6]) || 0,
          };

          if (name.includes('โรงเรียน')) stats.school = scores;
          else if (name.includes('เขต')) stats.district = scores;
          else if (name.includes('จังหวัด')) stats.province = scores;
          else if (name.includes('ภาค') || name.includes('ศธ')) stats.region = scores;
          else if (name.includes('ประเทศ') || name.includes('สพฐ')) stats.national = scores;
        }
      }
    });

    return { students, statistics: stats, logos };
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
};
