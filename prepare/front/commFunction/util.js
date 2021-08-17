export const IsNullOrEmpty = (str) => {
    let isEmpty = false
    if (str === undefined || str === "" || str === Infinity || str === null || str === "null" || str === "undefined") {
        isEmpty = true
    } else if (typeof str === "string" && str.trim() === "") {
        isEmpty = true
    }

    return isEmpty
}