import "./groups.css";

export default function Groups() {
  return (
    <div className="groups-container">

      <div className="groups-header">
        <h1>Select Group</h1>
        <button className="create-btn">
          + Create New Group
        </button>
      </div>

      <div className="groups-grid">

        <div className="group-card">
          <h2>Piso</h2>
          <p>Apartment expenses</p>
          <span>€120.00</span>
        </div>

        <div className="group-card">
          <h2>Viaje a Madrid</h2>
          <p>Vacation expenses</p>
          <span>€45.00</span>
        </div>

        <div className="group-card">
          <h2>Cena Jueves</h2>
          <p>Dinner expenses</p>
          <span>€0.00</span>
        </div>

        <div className="group-card">
          <h2>Gym Buddies</h2>
          <p>Sports expenses</p>
          <span>€15.50</span>
        </div>

      </div>

    </div>
  );
}