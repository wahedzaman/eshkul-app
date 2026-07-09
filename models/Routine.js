import RoutinePeriod from './RoutinePeriod';
import RoutineDetail from './RoutineDetail';

export default class Routine {
  constructor(data = {}) {
    this.Id = data.Id || 0;
    this.InstituteId = data.InstituteId || 0;
    this.AcademicBranchId = data.AcademicBranchId || 0;
    this.AcademicClassId = data.AcademicClassId || 0;
    this.AcademicSectionId = data.AcademicSectionId || 0;
    this.AcademicSessionId = data.AcademicSessionId || 0;
    this.RoutineTypeId = data.RoutineTypeId || 0;
    this.BuildingRoomId = data.BuildingRoomId || 0;

    this.RoutinePeriodList = (data.RoutinePeriodList || []).map(
      (item) => new RoutinePeriod(item)
    );
    this.RoutineDetails = (data.RoutineDetails || []).map(
      (item) => new RoutineDetail(item)
    );
  }
}
