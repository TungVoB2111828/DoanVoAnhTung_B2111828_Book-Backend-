const { ObjectId } = require("mongodb");

class EmployeeService {
    constructor(client) {
        this.Employee = client.db().collection("employees");
    }

    extractEmployeeData(payload) {
        const employee = {
            MSNV: payload.MSNV,
            HoTenNV: payload.HoTenNV,
            Password: payload.Password,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
            Email: payload.Email,
        };
        Object.keys(employee).forEach((key) => employee[key] === undefined && delete employee[key]);
        return employee;
    }

    async create(payload) {
        const employee = this.extractEmployeeData(payload);
        return await this.Employee.insertOne(employee);
    }

    async find(filter) {
        return await this.Employee.find(filter).toArray();
    }

    async findById(id) {
        return await this.Employee.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractEmployeeData(payload);
        return await this.Employee.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });
    }

    async delete(id) {
        return await this.Employee.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        const result = await this.Employee.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = EmployeeService;
