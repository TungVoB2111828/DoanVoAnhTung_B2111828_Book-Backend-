const { ObjectId } = require("mongodb");

class BorrowService {
    constructor(client) {
        this.Borrow = client.db().collection("borrowRecords");
    }

    extractBorrowData(payload) {
        const borrow = {
            MaDocGia: payload.MaDocGia,
            MaSach: payload.MaSach,
            NgayMuon: payload.NgayMuon,
            NgayTra: payload.NgayTra,
        };
        Object.keys(borrow).forEach((key) => borrow[key] === undefined && delete borrow[key]);
        return borrow;
    }

    async create(payload) {
        const borrow = this.extractBorrowData(payload);
        console.log("Saving borrow record:", borrow);
        return await this.Borrow.insertOne(borrow);
    }

    async find(filter) {
        return await this.Borrow.find(filter).toArray();
    }

    async findById(id) {
        return await this.Borrow.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractBorrowData(payload);
        return await this.Borrow.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });
    }

    async delete(id) {
        return await this.Borrow.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        const result = await this.Borrow.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BorrowService;
