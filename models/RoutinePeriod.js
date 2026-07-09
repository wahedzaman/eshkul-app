export default class RoutinePeriod {
  constructor(data = {}) {
    this.Id = data.Id || 0;
    this.InstituteId = data.InstituteId || 0;
    this.Name = data.Name || '';
    this.StartTime = data.StartTime || '';
    this.EndTime = data.EndTime || '';
    this.StartTimeStr = data.StartTimeStr || '';
    this.EndTimeStr = data.EndTimeStr || '';
    this.IsActive = data.IsActive || false;
    this.AcademicBranchId = data.AcademicBranchId || 0;
    this.OrderBy = data.OrderBy || 0;
    this.RoutinePeriodTypeId = data.RoutinePeriodTypeId || 0;
    this.Duration = data.Duration || 0;
    this.IsApplyForRoutine = data.IsApplyForRoutine || false;
    this.Description = data.Description || '';
  }
}
