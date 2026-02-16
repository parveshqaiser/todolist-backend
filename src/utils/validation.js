
// this is the best way. 
const checkValidation = (title, dueDate) => {

    if (!title?.trim() || !dueDate?.trim()) {
        return "Input Fields Required";
    }
    return null;
};

export default checkValidation;
