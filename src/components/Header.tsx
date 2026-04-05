import { useAuth } from "../auth/useAuth"

export default function Header() {
    const { user, logout } = useAuth()

    return (
        <header
            style={{
                height: "60px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                background: "#ffffff",
            }
            }
        >
            <h3 style={{ margin: 0 }}> StayBooking </h3>

            < div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span>{user?.email} </span>

                < button
                    onClick={logout}
                    style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        background: "#f5f5f5",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </header>
    )
}