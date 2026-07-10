class Employee {
  constructor(data) {
    this.employeeId = data.EmployeeId || null;
    this.instituteId = data.InstituteId || null;
    this.pin = data.PIN || '';
    this.firstName = data.FirstName || '';
    this.middleName = data.MiddleName || '';
    this.lastName = data.LastName || '';
    this.name = (data.Name || '').trim();
    this.shortName = data.ShortName || '';
    this.contactNumber1 = data.ContactNumber1 || '';
    this.contactNumber2 = data.ContactNumber2 || '';
    this.ssn = data.SSN || '';
    this.dob = data.DOB || '';
    this.genderId = data.GenderId || null;
    this.gender = data.Gender || '';
    this.nationalityId = data.NationalityId || null;
    this.nationality = data.Nationality || '';
    this.religionId = data.ReligionId || null;
    this.religion = data.Religion || '';
    this.bloodGroupId = data.BloodGroupId || null;
    this.bloodGroup = data.BloodGroup || '';
    this.maritalStatusId = data.MaritalStatusId || null;
    this.maritalStatus = data.MaritalStatus || '';
    this.designationId = data.DesignationId || null;
    this.designation = data.Designation || '';
    this.departmentId = data.DepartmentId || null;
    this.department = data.Department || '';
    this.fatherName = data.FatherName || '';
    this.motherName = data.MotherName || '';
    this.roles = data.Roles || '';
    this.branches = data.Branches || '';
    this.isActive = data.IsActive ?? true;
    this.tinyImageUrl = data.TinyImageUrl || '';
    this.smallImageUrl = data.SmallImageUrl || '';
    this.largeImageUrl = data.LargeImageUrl || '';
    this.birthCity = data.BirthCity || '';
    this.birthCountry = data.BirthCountry || '';
    this.joiningDate = data.JoiningDate || '';
    this.employeeTypeId = data.EmployeeTypeId || null;
    this.employeeTypeName = data.EmployeeTypeName || '';
    this.userInfoTypeId = data.UserInfoTypeId || null;
  }
}

export default Employee;
