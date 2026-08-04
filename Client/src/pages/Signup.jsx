import { useState } from "react";
import {
  Check,
  Code2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import toolbox from "../assets/toolbox.webp";
import backlyLogo from "../assets/BACKLY.webp";
import "./Signup.scss";
import authApi from "../api/auth";
import { useNavigate } from "react-router-dom";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};
const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function validateField(name, value, values = {}) {
  if (name === "fullName") {
    const trimmed = value.trim();
    if (!trimmed) return "Full name is required.";
    if (trimmed.length < 2) return "Name must be at least 2 characters.";
    return namePattern.test(trimmed)
      ? ""
      : "Name can only contain letters, spaces and hyphens.";
  }
  if (name === "email")
    return !value.trim()
      ? "Email address is required."
      : emailPattern.test(value.trim())
        ? ""
        : "Enter a valid email address.";
  if (name === "password") {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
    return /[0-9]/.test(value) ? "" : "Include at least one number.";
  }
  if (name === "confirmPassword")
    return !value
      ? "Please confirm your password."
      : value === values.password
        ? ""
        : "Passwords do not match.";
  if (name === "agreeToTerms")
    return value
      ? ""
      : "You must agree to the Terms of Service and Privacy Policy.";
  return "";
}

function InputField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  hint,
  isPassword = false,
  type = "text",
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="input-field">
      <label className="input-field__label" htmlFor={id}>
        {label}
      </label>
      <div
        className={`input-field__control${error ? " input-field__control--error" : ""}`}
      >
        <span className="input-field__icon">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <input
          id={id}
          name={id}
          className="input-field__input"
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />
        {isPassword && (
          <button
            className="input-field__toggle"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="input-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="input-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Feature({ icon: Icon, title, children }) {
  return (
    <li className="feature-item">
      <span className="feature-item__icon">
        <Icon size={20} />
      </span>
      <div>
        <p className="feature-item__title">{title}</p>
        <p className="feature-item__description">{children}</p>
      </div>
    </li>
  );
}

function BacklyLogo() {
  return (
    <div className="signup-logo">
      <img src={backlyLogo} alt="" />
      <span>BACKLY</span>
    </div>
  );
}

function GoogleIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.79-.07-1.54-.2-2.27H12v4.3h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.55Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.1H3.07v2.58A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.93A6 6 0 0 1 6.41 10.07V7.49H3.07a10 10 0 0 0 0 12.88l3.34-2.44Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.06c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.44C7.2 7.81 9.4 6.06 12 6.06Z"
      />
    </svg>
  );
}

function PromoPanel() {
  return (
    <section className="promo-panel">
      <BacklyLogo />
      <div className="promo-panel__body">
        <span className="promo-panel__eyebrow">
          Developer tools, simplified.
        </span>
        <h1>
          Everything you need,
          <br />
          in <span>one place.</span>
        </h1>
        <p>
          Create your account and unlock powerful backend tools built for
          developers.
        </p>
        <ul>
          <Feature icon={Code2} title="All-in-One Toolkit">
            Access essential backend tools in one place.
          </Feature>
          <Feature icon={ShieldCheck} title="Secure & Private">
            Your data is encrypted and always kept private.
          </Feature>
          <Feature icon={Zap} title="Built for Developers">
            Fast, reliable and developer-first experience.
          </Feature>
        </ul>
      </div>
      <img
        className="promo-panel__illustration"
        src={toolbox}
        alt=""
        aria-hidden="true"
      />
    </section>
  );
}

export default function Signup() {
  const [values, setValues] = useState(initialValues);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (event) => {
    const value = event.target.value;
    setServerError("");
    setValues((previous) => {
      const next = { ...previous, [field]: value };
      if (hasSubmitted)
        setErrors((current) => ({
          ...current,
          [field]: validateField(field, value, next),
          ...(field === "password"
            ? {
              confirmPassword: validateField(
                "confirmPassword",
                next.confirmPassword,
                next,
              ),
            }
            : {}),
        }));
      return next;
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    setHasSubmitted(true);
    setServerError("");

    const nextErrors = Object.fromEntries(
      Object.entries(values)
        .map(([key, value]) => [key, validateField(key, value, values)])
        .filter(([, error]) => error)
    );

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);

    try {

      await authApi.signup({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      navigate("/");
      setSubmitted(true);

    } catch (error) {

      setServerError(error.response?.data?.message || "");

    } finally {

      setIsSubmitting(false);

    }
  };

  const input = (props) => (
    <InputField
      {...props}
      value={values[props.id]}
      onChange={update(props.id)}
      error={hasSubmitted ? errors[props.id] : ""}
    />
  );
  return (
    <div className="signup-page">
      <div className="signup">
        <PromoPanel />
        <section className="signup__panel">
          <div className="signup__card">
            {submitted ? (
              <div className="signup__success">
                <span>
                  <UserPlus size={28} />
                </span>
                <h2>Account created</h2>
                <p>
                  Welcome to BACKLY! Your account has been created successfully.
                </p>
              </div>
            ) : (
              <>
                <header>
                  <h2>Create your account</h2>
                  <p>Join BACKLY and start building amazing things.</p>
                </header>
                <form onSubmit={submit} noValidate>
                  {input({
                    id: "fullName",
                    label: "Full Name",
                    icon: User,
                    placeholder: "Enter your full name",
                  })}
                  {input({
                    id: "email",
                    label: "Email Address",
                    icon: Mail,
                    type: "email",
                    placeholder: "Enter your email address",
                  })}
                  {input({
                    id: "password",
                    label: "Password",
                    icon: Lock,
                    isPassword: true,
                    placeholder: "Create a strong password",
                    hint: !(hasSubmitted && errors.password)
                      ? "Password must be at least 8 characters long."
                      : "",
                  })}
                  {input({
                    id: "confirmPassword",
                    label: "Confirm Password",
                    icon: Lock,
                    isPassword: true,
                    placeholder: "Confirm your password",
                  })}
                  <div className="checkbox">
                    <div>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={values.agreeToTerms}
                        onClick={() => {
                          const next = !values.agreeToTerms;
                          setServerError("");
                          setValues((current) => ({
                            ...current,
                            agreeToTerms: next,
                          }));
                          setErrors((current) => ({
                            ...current,
                            agreeToTerms: validateField("agreeToTerms", next),
                          }));
                        }}
                        className={values.agreeToTerms ? "checked" : ""}
                      >
                        {values.agreeToTerms && (
                          <Check size={13} strokeWidth={3} />
                        )}
                      </button>
                      <label>
                        I agree to the <a href="#terms">Terms of Service</a> and{" "}
                        <a href="#privacy">Privacy Policy</a>
                      </label>
                    </div>
                    {hasSubmitted && errors.agreeToTerms && (
                      <p>{errors.agreeToTerms}</p>
                    )}
                  </div>
                  {serverError && (
                    <p className="submit-error" role="alert">
                      {serverError}
                    </p>
                  )}
                  <button
                    className="signup-button"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Creating account…"
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Create Account
                      </>
                    )}
                  </button>
                  <div className="signup__divider">OR</div>
                  <button
                    className="signup-button signup-button--secondary"
                    type="button"
                  >
                    <GoogleIcon size={18} />
                    Sign up with Google
                  </button>
                </form>
                <p className="signup__footer">
                  Already have an account? <a href="/login">Log in</a>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
