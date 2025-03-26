const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    extractUserData(payload) {
        const user = {
            MaDocGia: payload.MaDocGia,
            HoLot: payload.HoLot,
            Ten: payload.Ten,
            NgaySinh: payload.NgaySinh,
            Phai: payload.Phai,
            DiaChi: payload.DiaChi,
            DienThoai: payload.DienThoai,
            Email: payload.Email,
        };
        Object.keys(user).forEach((key) => user[key] === undefined && delete user[key]);
        return user;
    }

    async create(payload) {
        const user = this.extractUserData(payload);
        return await this.User.insertOne(user);
    }

    async find(filter) {
        return await this.User.find(filter).toArray();
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractUserData(payload);
        return await this.User.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });
    }

    async delete(id) {
        return await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        const result = await this.User.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = UserService;
