class Institute {
  constructor(data) {
    this.id = data.Id || null;
    this.name = data.Name || '';
    this.code = data.Code || '';
    this.url = data.Url || '';
    this.latitude = data.latitude ?? null;
    this.longitude = data.longitude ?? null;
    this.isActive = data.IsActive ?? false;
    this.logoBigUrl = data.LogoBigUrl || '';
    this.groupName = data.GroupName || '';
    this.groupCode = data.GroupCode || '';
  }
}

export default Institute;
