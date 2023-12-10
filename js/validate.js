const nameValidate = document.getElementById("form_vis_name");
const nameErrMsg = document.getElementById("name_error");
const nameInfoMsg = document.getElementById("name_info_msg");

const emailValidate = document.getElementById("form_vis_email");
const emailErrMsg = document.getElementById("email_error");
const emailInfoMsg = document.getElementById("email_info_msg");

const commentValidate = document.getElementById("form_vis_comment");
const commentErrMsg = document.getElementById("comment_error");
const commentInfoMsg = document.getElementById("comment_info_msg");

const nameRegex = /^[A-Za-z0-9]+$/
const commentRegex = /^[ -~\n]+$/;
const emailRegex = /^[ -~]+@[ -~]+$/;

var formErrors = {};
var errorCnt = 0;

function flashWarning(warnedElement) {
    warnedElement.classList.add("flash-warning");
    // console.log("flashWarning invoked");
    setTimeout(() => {
        warnedElement.classList.remove("flash-warning");
    }, 2000);
}

document.addEventListener("DOMContentLoaded", function() {

    if (nameValidate.validity.valueMissing) {
        nameErrMsg.textContent = "No name detected";
        nameInfoMsg.textContent = "Please input a name it's required";
        nameValidate.setCustomValidity("Please input a name");
    } else if (!nameRegex.test(nameValidate.value)) {
        nameErrMsg.textContent = "Invalid Name characters";
        nameInfoMsg.textContent = "Only English alphabet letters and numbers are accepted";
        flashWarning(nameErrMsg);
        nameValidate.setCustomValidity("Please fix name characters");
    } else {        
        nameErrMsg.textContent = "No name errors";
        nameInfoMsg.textContent = "Nice, this looks good";
        // console.log("Valid name");
    }

    if (emailValidate.validity.valueMissing) {

        emailErrMsg.textContent = "No email detected";
        emailInfoMsg.textContent = "please input an email, it's required";
        emailValidate.setCustomValidity("Please input a valid email address");
    } else if (emailValidate.validity.typeMismatch) {
        emailErrMsg.textContent = "Invalid email address";
        emailInfoMsg.textContent = "Did you forget to put @?";
        emailValidate.setCustomValidity("Please input an email");
    } else if (!emailRegex.test(emailValidate.value)) {

        emailErrMsg.textContent = "Invalid email characters";
        emailInfoMsg.textContent = "Only ASCII characters are accepted";
        emailValidate.setCustomValidity("Please fix email characters");
        flashWarning(emailErrMsg);
    } else {        
        emailErrMsg.textContent = "No email errors";
        emailInfoMsg.textContent = "Nice, this looks good";
        emailValidate.setCustomValidity("");
        // console.log("Valid email");
    }

    if (commentValidate.validity.valueMissing) {
        commentErrMsg.textContent = "No comment detected";
        commentInfoMsg.textContent = "Please input some comments, it's required";
        commentValidate.setCustomValidity("Please input some comments");
    } else if (!commentRegex.test(commentValidate.value)) {
        commentErrMsg.textContent = "Invalid Comment";
        commentInfoMsg.textContent = "Only ASCII characters are accepted";
        commentValidate.setCustomValidity("Please fix comment characters");
        flashWarning(commentErrMsg);
    } else if (commentValidate.validity.tooLong){
        commentErrMsg.textContent = "Comment too long";
        commentInfoMsg.textContent = "Please make it shorter, less than 200 characters";
        commentValidate.setCustomValidity("Please make the message shorter");
    } else {        
        commentErrMsg.textContent = "No comment errors";
        commentInfoMsg.textContent = (300 - commentValidate.value.length) + " Characters left";
        if (300 - commentValidate.value.length < 50) {
            flashWarning(commentInfoMsg);
        }
        commentValidate.setCustomValidity("");
        // console.log("Valid comment");
    }
});

function trackFormError() {
    // console.log("Tried to submit");

    if (!nameValidate.checkValidity()) {
        errorCnt += 1;
        let tmp_name = "Error#" + errorCnt;
        formErrors[tmp_name] = nameErrMsg.value;
    }

    if (!emailValidate.checkValidity()) {
        errorCnt += 1;
        let tmp_name = "Error#" + errorCnt;
        formErrors[tmp_name] = emailErrMsg.value;
    }

    if (!commentValidate.checkValidity()) {
        errorCnt += 1;
        let tmp_name = "Error#" + errorCnt;
        formErrors[tmp_name] = commentErrMsg.value;
    }
    // console.log(formErrors);
    document.getElementById('jsonFormError').value = JSON.stringify(formErrors);
}

// ! Need to set CustomValidity to default in the case of no errors.
// ! Otherwise the form display won't be updated on the fly
nameValidate.addEventListener("input", (event) => {
    // console.log("Name validate() invoked");
    
    // console.log("Invalid name");        
    if (nameValidate.validity.valueMissing) {
        nameErrMsg.textContent = "No name detected";
        nameInfoMsg.textContent = "Please input a name it's required";
        nameValidate.setCustomValidity("Please input a name");
        
    } else if (!nameRegex.test(nameValidate.value)) {
        nameErrMsg.textContent = "Invalid Name characters";
        nameInfoMsg.textContent = "Only English alphabet letters and numbers are accepted";
        nameValidate.setCustomValidity("Please use valid characters");
        flashWarning(nameErrMsg);
    } else {
        nameErrMsg.textContent = "No name errors";
        nameInfoMsg.textContent = "Nice, this looks good";
        nameValidate.setCustomValidity("");
        // console.log("Valid name");
    }
});

emailValidate.addEventListener("input", (event) => {
    // console.log("Email validate() invoked");
    
    // console.log("Invalid email");
    if (emailValidate.validity.valueMissing) {

        emailErrMsg.textContent = "No email detected";
        emailInfoMsg.textContent = "please input an email, it's required";
        emailValidate.setCustomValidity("Please input an email");
    } else if (emailValidate.validity.typeMismatch) {
        emailErrMsg.textContent = "Invalid email address";
        emailInfoMsg.textContent = "Did you forget to put @?";
        emailValidate.setCustomValidity("Please input a valid email address");
    } else if (!emailRegex.test(emailValidate.value)) {

        emailErrMsg.textContent = "Invalid email characters";
        emailInfoMsg.textContent = "Only ASCII characters are accepted";
        emailValidate.setCustomValidity("Please input a valid email address");
    } else {        
        emailErrMsg.textContent = "No email errors";
        emailInfoMsg.textContent = "Nice, this looks good";
        emailValidate.setCustomValidity("");
        // console.log("Valid email");
    }
});

commentValidate.addEventListener("input", (event) => {
    // console.log("Comment validate() invoked");
   
    if (commentValidate.validity.valueMissing) {
        commentErrMsg.textContent = "No comment detected";
        commentInfoMsg.textContent = "Please input some comments, it's required";
        commentValidate.setCustomValidity("Please input some comments");
    } else if (!commentRegex.test(commentValidate.value)) {
        commentErrMsg.textContent = "Invalid Comment";
        commentInfoMsg.textContent = "Only ASCII characters are accepted";
        commentValidate.setCustomValidity("Please use valid characters");
        flashWarning(commentErrMsg);
    } else if (commentValidate.validity.tooLong){
        commentErrMsg.textContent = "Comment too long";
        commentInfoMsg.textContent = "Please make it shorter, less than 200 characters";
        commentValidate.setCustomValidity("Please make the message shorter");
    } else {
        commentErrMsg.textContent = "No comment errors";
        commentInfoMsg.textContent = (300 - commentValidate.value.length) + " Characters left";
        if (300 - commentValidate.value.length < 50) {
            flashWarning(commentInfoMsg);
        }
        commentValidate.setCustomValidity("");
        // console.log("Valid comment");
    }
})