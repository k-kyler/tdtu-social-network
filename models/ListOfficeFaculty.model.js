const mongoose = require("mongoose");

let listOfficeFacultySchema = new mongoose.Schema({
    name: String,
});

let ListOfficeFaculty = mongoose.model(
    "ListOfficeFaculty",
    listOfficeFacultySchema,
    "ListOfficeFaculty"
);

module.exports = ListOfficeFaculty;
