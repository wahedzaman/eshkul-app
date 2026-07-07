export default class HomeworkGroup {
  constructor(data = {}) {
    this.Id = data.Id || 0;
    this.VcrDiaryId = data.VcrDiaryId || 0;
    this.Description = data.Description || '';
  }
}
