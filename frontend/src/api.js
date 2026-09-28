const API_ROOT_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const API_BASE_URL =
    `${API_ROOT_URL}/api`;


/* =========================================================
   CLEAR AUTH DATA
   ========================================================= */

function clearAuthStorage() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
}


/* =========================================================
   API FETCH
   ========================================================= */

export async function apiFetch(
    endpoint,
    options = {}
) {
    let accessToken =
        localStorage.getItem("accessToken");


    const makeRequest = (token) => {
        const headers = {
            ...(options.headers || {}),
        };


        if (token) {
            headers.Authorization =
                `Bearer ${token}`;
        }


        return fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers,
            }
        );
    };


    let response =
        await makeRequest(accessToken);


    /* =====================================================
       ACCESS TOKEN EXPIRED
       ===================================================== */

    if (response.status === 401) {
        const refreshToken =
            localStorage.getItem(
                "refreshToken"
            );


        if (!refreshToken) {
            clearAuthStorage();

            throw new Error(
                "SESSION_EXPIRED"
            );
        }


        const refreshResponse =
            await fetch(
                `${API_BASE_URL}/token/refresh/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        refresh:
                            refreshToken,
                    }),
                }
            );


        if (!refreshResponse.ok) {
            clearAuthStorage();

            throw new Error(
                "SESSION_EXPIRED"
            );
        }


        const refreshData =
            await refreshResponse.json();


        if (!refreshData.access) {
            clearAuthStorage();

            throw new Error(
                "SESSION_EXPIRED"
            );
        }


        localStorage.setItem(
            "accessToken",
            refreshData.access
        );


        if (refreshData.refresh) {
            localStorage.setItem(
                "refreshToken",
                refreshData.refresh
            );
        }


        accessToken =
            refreshData.access;


        /* Retry original request */

        response =
            await makeRequest(
                accessToken
            );
    }


    return response;
}


/* =========================================================
   EXPORT URLS
   ========================================================= */

export {
    API_ROOT_URL,
    API_BASE_URL,
};