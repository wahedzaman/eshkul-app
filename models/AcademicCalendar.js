class AcademicCalendar {
  constructor(data) {
    this.id = data.Id || null;
    this.instituteId = data.InstituteId || null;
    this.academicBranchId = data.AcademicBranchId || null;
    this.academicSessionId = data.AcademicSessionId || null;
    this.fromDate = data.FromDate || '';
    this.toDate = data.ToDate || '';
    this.title = data.Title || '';
    this.description = data.Description || '';
    this.isInstituteClose = data.IsInstituteClose || false;
  }
}

export default AcademicCalendar;
