import {toast} from "react-toastify";

export const toastSuccess = (message) => {
    toast.success(message, {
        className: "bg-green-500 text-white rounded-md shadow-md",
        bodyClassName: "text-sm",
        progressClassName: "bg-red-700",
    })
}

export const toastError = (message) => {
    toast.error(message, {
        className: "bg-red-500 text-white rounded-md shadow-md",
        bodyClassName: "text-sm font-bold",
        progressClassName: "bg-red-700",
    })
}