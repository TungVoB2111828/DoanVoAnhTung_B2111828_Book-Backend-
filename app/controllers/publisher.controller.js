const ApiError = require("../api-error");
const PublisherService = require("../services/publisher.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body?.TenNXB || !req.body?.MaNXB) {
        return next(new ApiError(400, "Thông tin nhà xuất bản không được để trống"));
    }

    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi thêm nhà xuất bản"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const publisherService = new PublisherService(MongoDB.client);
        documents = await publisherService.find({});
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách nhà xuất bản"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi truy xuất nhà xuất bản với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }

    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }
        return res.send({ message: "Nhà xuất bản đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật nhà xuất bản với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }
        return res.send({ message: "Nhà xuất bản đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa nhà xuất bản với id=${req.params.id}`));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const deletedCount = await publisherService.deleteAll();
        return res.send({
            message: `${deletedCount} nhà xuất bản đã được xóa thành công`,
        });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả nhà xuất bản"));
    }
};
