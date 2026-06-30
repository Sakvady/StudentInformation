let students = [];
let editId = null;
let selectedRows = [];

const modal = new bootstrap.Modal(document.getElementById("studentModal"));
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));

$("#table").bootstrapTable({
    data: students,
    pagination: true,
    clickToSelect: true,
    columns: [
        { checkbox: true },
        { field: "id", title: "ID" },
        { field: "fullname", title: "Full Name" },
        { field: "sex", title: "Sex" },
        { field: "phone", title: "Phone Number" },
        { field: "dob", title: "Date of Birth" },
        { field: "email", title: "Email" }
    ]
});

let today = new Date().toISOString().split("T")[0];
$("#dob").attr("max", today);

function clearForm() {
    $("#fullname").val("");
    $("#sex").val("Male");
    $("#phone").val("");
    $("#dob").val("");
    $("#email").val("");
    clearErrors();
}

function clearErrors() {
    $(".form-control, .form-select").removeClass("is-invalid");
    $(".invalid-feedback").text("");
}

function showError(inputId, message) {
    $("#" + inputId).addClass("is-invalid");
    $("#" + inputId + "Error").text(message);
}

// Full Name letters only
$("#fullname").on("input", function () {
    let value = $(this).val().replace(/[^A-Za-z\s]/g, "");
    $(this).val(value);
});

// Phone digits only
$("#phone").on("input", function () {

    let value = $(this).val();

    value = value.replace(/[^0-9]/g, "");
    value = value.slice(0, 11);

    $(this).val(value);
});

// Email stop after .com
$("#email").on("input", function () {

    let value = $(this).val();

    if (value.includes(".com")) {

        let index = value.indexOf(".com") + 4;

        $(this).val(value.substring(0, index));
    }

});

// Add button
$("#btnAdd").click(function () {

    editId = null;

    clearForm();

    modal.show();

});

// Save button
$("#btnSave").click(function () {

    clearErrors();

    let valid = true;

    let student = {

        fullname: $("#fullname").val().trim(),
        sex: $("#sex").val(),
        phone: $("#phone").val().trim(),
        dob: $("#dob").val(),
        email: $("#email").val().trim()

    };

    // Full Name
    if (student.fullname === "") {

        showError("fullname", "Full Name is required.");
        valid = false;

    }
    else if (!/^[A-Za-z\s]+$/.test(student.fullname)) {

        showError("fullname", "Only letters are allowed.");
        valid = false;

    }

    // Phone
    if (student.phone === "") {

        showError("phone", "Phone Number is required.");
        valid = false;

    }
    else if (!/^[0-9]{1,11}$/.test(student.phone)) {

        showError("phone", "Phone must contain 1-11 digits.");
        valid = false;

    }

    // DOB
    if (student.dob === "") {

        showError("dob", "Date of Birth is required.");
        valid = false;

    }
    else {

        let dob = new Date(student.dob);

        let today = new Date();

        today.setHours(0,0,0,0);

        if(dob > today){

            showError("dob","Date cannot be in the future.");
            valid = false;

        }

    }

    // Email
    if (student.email === "") {

        showError("email","Email is required.");
        valid = false;

    }
    else if(!/^[^\s@]+@[^\s@]+\.com$/i.test(student.email)){

        showError("email","Email must end with .com");
        valid = false;

    }
        // Duplicate check
    let duplicate = students.find(s =>
        s.fullname.toLowerCase() === student.fullname.toLowerCase() &&
        s.email.toLowerCase() === student.email.toLowerCase() &&
        s.id !== editId
    );

    if (duplicate) {
        showError("email", "This student already exists.");
        valid = false;
    }

    if (!valid) {
        return;
    }

    // Add new student
    if (editId === null) {

        student.id = students.length
            ? Math.max(...students.map(x => x.id)) + 1
            : 1;

        students.push(student);

    }
    // Update existing student
    else {

        student.id = editId;

        let index = students.findIndex(x => x.id === editId);

        students[index] = student;

    }

    $("#table").bootstrapTable("load", students);

    modal.hide();

});




$("#btnEdit").click(function () {

    let rows = $("#table").bootstrapTable("getSelections");

    if (rows.length !== 1) {
        alert("Please select one student to edit.");
        return;
    }

    let row = rows[0];

    editId = row.id;

    $("#fullname").val(row.fullname);
    $("#sex").val(row.sex);
    $("#phone").val(row.phone);
    $("#dob").val(row.dob);
    $("#email").val(row.email);

    clearErrors();

    modal.show();

});

$("#btnDelete").click(function () {

    selectedRows = $("#table").bootstrapTable("getSelections");

    if (selectedRows.length === 0) {
        alert("Please select at least one student.");
        return;
    }

    deleteModal.show();

});



$("#confirmDelete").click(function () {

    selectedRows.forEach(function (row) {

        students = students.filter(student => student.id !== row.id);

    });

    $("#table").bootstrapTable("load", students);

    deleteModal.hide();

});



$("#studentModal").on("hidden.bs.modal", function () {

    clearForm();

    editId = null;

});



$("#deleteModal").on("hidden.bs.modal", function () {

    selectedRows = [];

});