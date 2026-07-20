import { authClient } from "@/lib/auth-client";

export async function getAuthHeaders() {
    const { data } = await authClient.token();

    if (!data) {
        return {};
    }

    const token = data.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
}
