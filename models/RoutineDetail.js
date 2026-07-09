export default class RoutineDetail {
  constructor(data = {}) {
    this.Id = data.Id || 0;
    this.RoutineId = data.RoutineId || 0;
    this.WeekDayId = data.WeekDayId || 0;
    this.RoutinePeriodId = data.RoutinePeriodId || 0;
    this.RoutinePeriodName = data.RoutinePeriodName || '';
    this.SubjectId = data.SubjectId || 0;
    this.SubjectName = data.SubjectName || '';
    this.SubjectShortName = data.SubjectShortName || '';
    this.TeacherId = data.TeacherId || 0;
    this.TeacherName = data.TeacherName || '';
    this.TeacherShortName = data.TeacherShortName || '';
    this.TeacherImage = data.TeacherImage || '';
    this.BuildingRoomId = data.BuildingRoomId || 0;
    this.BuildingRoomName = data.BuildingRoomName || '';
    this.BuildingName = data.BuildingName || '';
    this.AcademicClassName = data.AcademicClassName || '';
    this.AcademicSectionId = data.AcademicSectionId || 0;
    this.AcademicBranchId = data.AcademicBranchId || 0;
    this.AcademicClassId = data.AcademicClassId || 0;
  }
}
