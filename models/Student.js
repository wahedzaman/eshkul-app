class Student {
  constructor(data) {
    this.studentId = data.StudentId || null;
    this.instituteId = data.InstituteId || null;
    this.currentAcademicSessionId = data.CurrentAcademicSessionId || null;
    this.currentAcademicBranchId = data.CurrentAcademicBranchId || null;
    this.currentAcademicClassId = data.CurrentAcademicClassId || null;
    this.currentAcademicShiftId = data.CurrentAcademicShiftId || null;
    this.currentAcademicSectionId = data.CurrentAcademicSectionId || null;
    this.currentAcademicVerssionId = data.CurrentAcademicVerssionId || null;
    this.currentAcademicGroupId = data.CurrentAcademicGroupId || null;
    this.currentRollNo = data.CurrentRollNo || '';
    this.pin = data.PIN || '';
    this.firstName = data.FirstName || '';
    this.middleName = data.MiddleName || '';
    this.lastName = data.LastName || '';
    this.name = data.Name || '';
    this.contactNumber1 = data.ContactNumber1 || '';
    this.contactNumber2 = data.ContactNumber2 || '';
    this.fatherName = data.FatherName || '';
    this.motherName = data.MotherName || '';
    this.academicSession = data.AcademicSession || '';
    this.academicBranch = data.AcademicBranch || '';
    this.academicClass = data.AcademicClass || '';
    this.academicShift = data.AcademicShift || '';
    this.academicSection = data.AcademicSection || '';
    this.academicVerssion = data.AcademicVerssion || '';
    this.academicGroup = data.AcademicGroup || '';
    this.tinyImageUrl = data.TinyImageUrl || '';
    this.smallImageUrl = data.SmallImageUrl || '';
    this.largeImageUrl = data.LargeImageUrl || '';
    this.academicSessionCode = data.AcademicSessionCode || '';
    this.academicBranchCode = data.AcademicBranchCode || '';
    this.academicClassCode = data.AcademicClassCode || '';
    this.academicShiftCode = data.AcademicShiftCode || '';
    this.academicVerssionCode = data.AcademicVerssionCode || '';
    this.orderBy = data.OrderBy || 0;
    this.joiningDate = data.JoiningDate || '';
    this.joiningAcademicSessionId = data.JoiningAcademicSessionId || null;
    this.joiningAcademicBranchId = data.JoiningAcademicBranchId || null;
    this.joiningAcademicClassId = data.JoiningAcademicClassId || null;
    this.leaveDate = data.LeaveDate || '';
    this.feeStartDate = data.FeeStartDate || '';
    this.classStartDate = data.ClassStartDate || '';
    this.emailAddress = data.EmailAddress || null;
    this.tcReason = data.TcReason || '';
  }
}

export default Student;
