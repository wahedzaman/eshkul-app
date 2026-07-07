import HomeworkGroup from './HomeworkGroup';
import HomeworkResource from './HomeworkResource';

export default class Homework {
  constructor(data = {}) {
    this.Id = data.Id || 0;
    this.LastUpdateTime = data.LastUpdateTime || '';
    this.Title = data.Title || '';
    this.Homework = data.Homework || '';
    this.StartDate = data.StartDate || '';
    this.EndDate = data.EndDate || '';
    this.TeacherName = data.TeacherName || '';
    
    this.VcrDiaryGroups = (data.VcrDiaryGroups || []).map(
      (item) => new HomeworkGroup(item)
    );
    this.VcrDiaryResources = (data.VcrDiaryResources || []).map(
      (item) => new HomeworkResource(item)
    );
  }
}
