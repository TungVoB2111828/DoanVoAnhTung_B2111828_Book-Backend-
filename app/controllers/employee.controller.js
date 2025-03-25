const ApiError = require("../api-error");
const EmployeeService = require("../services/employee.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body?.HoTenNV || !req.body?.Email || !req.body?.ChucVu) {
        return next(new ApiError(400, "Thông tin nhân viên không được để trống"));
    }

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi thêm nhân viên"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        documents = await employeeService.find({});
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách nhân viên"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi truy xuất nhân viên với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({ message: "Nhân viên đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật nhân viên với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({ message: "Nhân viên đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa nhân viên với id=${req.params.id}`));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const deletedCount = await employeeService.deleteAll();
        return res.send({
            message: `${deletedCount} nhân viên đã được xóa thành công`,
        });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả nhân viên"));
    }
};
