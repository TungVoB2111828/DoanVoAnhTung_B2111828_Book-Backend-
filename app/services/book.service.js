const { ObjectId } = require("mongodb");

class BookService {
    constructor(client) {
        this.Book = client.db().collection("books"); // Dùng collection "books"
    }

    extractBookData(payload) {
        const book = {
            MaSach: payload.MaSach,
            TenSach: payload.TenSach,
            DonGia: payload.DonGia,
            SoQuyen: payload.SoQuyen,
            NamXuatBan: payload.NamXuatBan,
            MaNXB: payload.MaNXB,
            TacGia: payload.TacGia,
        };
        Object.keys(book).forEach((key) => book[key] === undefined && delete book[key]);
        return book;
    }

    async create(payload) {
        const book = this.extractBookData(payload);
        const result = await this.Book.insertOne(book);
        return result;
    }

    async find(filter) {
        return await this.Book.find(filter).toArray();
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });
        return result;
    }

    async delete(id) {
        return await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BookService;
