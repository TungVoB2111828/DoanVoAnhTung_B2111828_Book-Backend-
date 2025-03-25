const express = require("express");
const cors = require("cors");

const booksRouter = require("./app/routes/book.route");
const usersRouter = require("./app/routes/user.route");
const employeesRouter = require("./app/routes/employee.route");
const publishersRouter = require("./app/routes/publisher.route");
const borrowsRouter = require("./app/routes/borrow.route");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Library Management System!" });
});

// Định nghĩa các route API
app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/publishers", publishersRouter);
app.use("/api/borrows", borrowsRouter);

// Xử lý lỗi 404 (Không tìm thấy route)
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
