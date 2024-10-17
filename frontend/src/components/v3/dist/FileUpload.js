"use strict";
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var fileParser_1 = require("../utils/fileParser");
var FileUpload = function (_a) {
    var onUpload = _a.onUpload, type = _a.type;
    var _b = react_1.useState(false), dragActive = _b[0], setDragActive = _b[1];
    var _c = react_1.useState(null), file = _c[0], setFile = _c[1];
    var _d = react_1.useState(0), uploadProgress = _d[0], setUploadProgress = _d[1];
    var _e = react_1.useState('idle'), uploadStatus = _e[0], setUploadStatus = _e[1];
    var _f = react_1.useState(''), errorMessage = _f[0], setErrorMessage = _f[1];
    var handleDrag = react_1.useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        }
        else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);
    var validateFile = function (file) {
        if (!file.name.endsWith('.csv')) {
            setErrorMessage('Please upload a CSV file.');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('File size should not exceed 5MB.');
            return false;
        }
        return true;
    };
    var handleDrop = react_1.useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);
    var handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    var handleFile = function (file) {
        if (validateFile(file)) {
            setFile(file);
            setUploadStatus('uploading');
            setErrorMessage('');
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                var content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                var fileContent = fileParser_1.parseCSV(content);
                var schema = fileParser_1.inferSchemaFromFileContent(file.name, fileContent);
                onUpload(schema);
                setUploadStatus('success');
            };
            reader.onprogress = function (e) {
                if (e.lengthComputable) {
                    var progress = (e.loaded / e.total) * 100;
                    setUploadProgress(progress);
                }
            };
            reader.onerror = function () {
                setUploadStatus('error');
                setErrorMessage('An error occurred while reading the file.');
            };
            reader.readAsText(file);
        }
        else {
            setUploadStatus('error');
        }
    };
    return (react_1["default"].createElement("div", { className: "mb-6" },
        react_1["default"].createElement("h3", { className: "text-lg font-semibold mb-2 capitalize" },
            type,
            " File Upload"),
        react_1["default"].createElement("div", { className: "border-2 border-dashed rounded-lg p-4 text-center " + (dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'), onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop },
            react_1["default"].createElement("input", { type: "file", id: type + "-file-upload", className: "hidden", onChange: handleChange, accept: ".csv" }),
            react_1["default"].createElement("label", { htmlFor: type + "-file-upload", className: "cursor-pointer flex flex-col items-center justify-center" },
                react_1["default"].createElement(lucide_react_1.Upload, { className: "w-12 h-12 text-gray-400 mb-2" }),
                react_1["default"].createElement("p", { className: "text-sm text-gray-600" }, "Drag and drop your CSV file here, or click to select a file"),
                react_1["default"].createElement("p", { className: "text-xs text-gray-400 mt-1" }, "Supported format: CSV (max 5MB)"))),
        uploadStatus !== 'idle' && (react_1["default"].createElement("div", { className: "mt-4" },
            uploadStatus === 'uploading' && (react_1["default"].createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5 mb-2" },
                react_1["default"].createElement("div", { className: "bg-blue-600 h-2.5 rounded-full", style: { width: uploadProgress + "%" } }))),
            react_1["default"].createElement("div", { className: "flex items-center" },
                uploadStatus === 'success' && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(lucide_react_1.CheckCircle, { className: "text-green-500 mr-2" }),
                    react_1["default"].createElement("span", { className: "text-green-500" },
                        "File uploaded successfully: ", file === null || file === void 0 ? void 0 :
                        file.name))),
                uploadStatus === 'error' && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(lucide_react_1.XCircle, { className: "text-red-500 mr-2" }),
                    react_1["default"].createElement("span", { className: "text-red-500" }, errorMessage))))))));
};
exports["default"] = FileUpload;
