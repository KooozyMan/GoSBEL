export default function Confirmation({ type, message }) {
    return (
        <div className={type}>
            {message}
        </div>
    );
}