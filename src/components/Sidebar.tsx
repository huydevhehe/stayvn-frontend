import { Link } from "react-router-dom"

export default function Sidebar() {
    return (
        <aside
            style={{
                width: "220px",
                height: "100vh",
                borderRight: "1px solid #eee",
                padding: "20px",
            }}
        >
            <h2>StayBooking</h2>

            <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link to="/">Dashboard</Link>
                <Link to="/hotels">Hotels</Link>
                <Link to="/rooms">Rooms</Link>
                <Link to="/bookings">Bookings</Link>
            </nav>
        </aside>
    )
}