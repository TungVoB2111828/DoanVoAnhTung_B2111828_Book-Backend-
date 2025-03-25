const ApiError = require("../api-error");
const BorrowService = require("../services/borrow.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    console.log("Received request body:", req.body); // Xem dữ liệu client gửi lên

    if (!req.body?.MaDocGia || !req.body?.MaSach || !req.body?.NgayMuon) {
        console.error("❌ Lỗi: Dữ liệu không hợp lệ", req.body);
        return next(new ApiError(400, "Thông tin mượn sách không được để trống"));
    }

    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.error("❌ Lỗi server:", error); // In lỗi ra terminal
        return next(new ApiError(500, "Đã xảy ra lỗi khi thêm giao dịch mượn sách"));
    }
};


exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.find({});
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách mượn sách"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy giao dịch mượn sách"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi truy xuất giao dịch mượn sách với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }

    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy giao dịch mượn sách"));
        }
        return res.send({ message: "Giao dịch mượn sách đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật giao dịch mượn sách với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy giao dịch mượn sách"));
        }
        return res.send({ message: "Giao dịch mượn sách đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa giao dịch mượn sách với id=${req.params.id}`));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const deletedCount = await borrowService.deleteAll();
        return res.send({
            message: `${deletedCount} giao dịch mượn sách đã được xóa thành công`,
        });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả giao dịch mượn sách"));
    }
};
