export default function Application({ name, setName }) {
    return (
        <div className="application-container">Application<input className="application-input" type="text" value={name} onChange={(e) => setName(e.target.value)}></input></div>
    );
}