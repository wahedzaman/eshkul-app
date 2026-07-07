export default class HomeworkResource {
  constructor(data = {}) {
    this.Id = data.Id || 0;
    this.VcrDiaryId = data.VcrDiaryId || 0;
    this.Url = data.Url || '';
    this.Description = data.Description || '';
    this.IsForClasswork = data.IsForClasswork || false;
    this.IsFileUpload = data.IsFileUpload || false;
  }
}
