export default function PasswordInputField({ bascoota }) {
  return (
    <div>
      <input type="password" />
      <label>{bascoota ? "Bascoota" : "Password"}</label>
    </div>
  );
}