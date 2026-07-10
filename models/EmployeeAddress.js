class EmployeeAddress {
  constructor(data) {
    this.id = data.Id || null;
    this.addressTypeId = data.AddressTypeId || null;
    this.addressTypeName = data.AddressTypeName || '';
    this.refPrimaryKey = data.RefPrimaryKey || null;
    this.districtOrStateId = data.DistrictOrStateId || null;
    this.districtOrStateName = data.DistrictOrStateName || '';
    this.zipCode = data.ZipCode || '';
    this.addressBody = data.AddressBody || '';
    this.isActive = data.IsActive ?? true;
    this.countryName = data.CountryName || '';
  }
}

export default EmployeeAddress;
