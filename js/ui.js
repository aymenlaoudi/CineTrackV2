export function showMessage(el, text, type = "info") {
    const colors = { info: "text-gray-300", error: "text-red-500", success: "text-green-500" };
    el.className = "p-4 text-center " + colors[type];
    el.textContent = text;
}

