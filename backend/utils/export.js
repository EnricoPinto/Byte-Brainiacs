const ExcelJS = require('exceljs');

const exportParticipantsToExcel = async (participants) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ByteBrainiacs';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Participants', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  ws.columns = [
    { header: 'Full Name', key: 'fullName', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Mobile', key: 'mobile', width: 15 },
    { header: 'College', key: 'college', width: 30 },
    { header: 'Degree', key: 'degree', width: 20 },
    { header: 'Year', key: 'yearOfStudy', width: 10 },
    { header: 'City', key: 'city', width: 15 },
    { header: 'State', key: 'state', width: 15 },
    { header: 'LinkedIn', key: 'linkedin', width: 30 },
    { header: 'GitHub', key: 'github', width: 25 },
    { header: 'Type', key: 'registrationType', width: 12 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Team Name', key: 'teamName', width: 20 },
    { header: 'Registered At', key: 'createdAt', width: 20 },
  ];

  // Style header row
  ws.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF4F46E5' } },
    };
  });
  ws.getRow(1).height = 28;

  participants.forEach((p, i) => {
    const row = ws.addRow({
      fullName: p.fullName,
      email: p.email,
      mobile: p.mobile,
      college: p.college,
      degree: p.degree,
      yearOfStudy: p.yearOfStudy,
      city: p.city || '',
      state: p.state || '',
      linkedin: p.linkedin || '',
      github: p.github || '',
      registrationType: p.registrationType,
      status: p.status,
      teamName: p.teamName || '',
      createdAt: new Date(p.createdAt).toLocaleDateString(),
    });

    // Alternate row shading
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
      });
    }
  });

  return workbook;
};

module.exports = { exportParticipantsToExcel };
