import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';
import Routine from '../models/Routine';

const WEEK_DAY_IDS = {
  0: 212, // Sunday
  1: 213, // Monday
  2: 214, // Tuesday
  3: 215, // Wednesday
  4: 216, // Thursday
  5: 217, // Friday
  6: 218, // Saturday
};

class RoutineService {
  static async fetchRoutine() {
    const headers = {
      'Authorization': AppSession.token || '',
    };

    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.TIMETABLE_STUDENT,
      {},
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data) {
      const routine = new Routine(response.data);
      return { success: true, data: routine };
    }

    return { success: false, error: response.error || 'Failed to fetch routine' };
  }

  static getTodayWeekDayId() {
    const dayOfWeek = new Date().getDay();
    return WEEK_DAY_IDS[dayOfWeek] || 212;
  }

  static getDetailsForDay(routine, weekDayId) {
    if (!routine || !routine.RoutineDetails) return [];
    return routine.RoutineDetails.filter(d => d.WeekDayId === weekDayId);
  }

  static getDayName(weekDayId) {
    const map = {
      212: 'Sunday',
      213: 'Monday',
      214: 'Tuesday',
      215: 'Wednesday',
      216: 'Thursday',
      217: 'Friday',
      218: 'Saturday'
    };
    return map[weekDayId] || '';
  }

  static buildScheduleForFilter(routine, filter) {
    if (!routine || !routine.RoutineDetails) return [];
    
    const todayId = this.getTodayWeekDayId();
    let details = routine.RoutineDetails;

    if (filter === 'today') {
      details = details.filter(d => d.WeekDayId === todayId);
    } else if (filter === 'upcoming') {
      details = details.filter(d => d.WeekDayId > todayId);
    }

    const periodMap = {};
    if (routine.RoutinePeriodList) {
      routine.RoutinePeriodList.forEach(p => {
        periodMap[p.Id] = p;
      });
    }

    const grouped = {};
    details.forEach(detail => {
      const period = periodMap[detail.RoutinePeriodId];
      if (!period) return;

      const key = `${detail.WeekDayId}-${detail.SubjectId}-${detail.TeacherId}`;
      if (!grouped[key]) {
        grouped[key] = {
          detail,
          periods: [period],
          minOrder: period.OrderBy,
        };
      } else {
        grouped[key].periods.push(period);
        if (period.OrderBy < grouped[key].minOrder) {
          grouped[key].minOrder = period.OrderBy;
        }
      }
    });

    const schedule = Object.values(grouped).map(group => {
      group.periods.sort((a, b) => a.OrderBy - b.OrderBy);
      const firstPeriod = group.periods[0];
      const lastPeriod = group.periods[group.periods.length - 1];

      return {
        id: group.detail.Id,
        weekDayId: group.detail.WeekDayId,
        dayName: this.getDayName(group.detail.WeekDayId),
        timeStart: firstPeriod.StartTimeStr,
        timeEnd: lastPeriod.EndTimeStr,
        subject: group.detail.SubjectShortName || group.detail.SubjectName,
        subjectFull: group.detail.SubjectName,
        room: `${group.detail.BuildingName}-${group.detail.BuildingRoomName}`,
        teacherName: (group.detail.TeacherName || '').trim(),
        teacherShortName: group.detail.TeacherShortName,
        teacherImage: group.detail.TeacherImage,
        orderBy: group.minOrder,
      };
    });

    schedule.sort((a, b) => {
      if (a.weekDayId !== b.weekDayId) {
        return a.weekDayId - b.weekDayId;
      }
      return a.orderBy - b.orderBy;
    });

    return schedule;
  }
}

export default RoutineService;
