import { useState } from 'react'
import { Code2, Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, Zap } from 'lucide-react'
import toolbox from '../assets/toolbox.webp'
import backlyLogo from '../assets/BACKLY.webp'
import './Signup.scss'
import authApi from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const initialValues = { email: '', password: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateField(name, value) {
  if (name === 'email') {
    return !value.trim() ? 'Email address is required.' : emailPattern.test(value.trim()) ? '' : 'Enter a valid email address.'
  }
  if (name === 'password') {
    return !value ? 'Password is required.' : ''
  }
  return ''
}

function InputField({ id, label, icon: Icon, value, onChange, onBlur, error, hint, isPassword = false, type = 'text', placeholder }) {
  const [showPassword, setShowPassword] = useState(false)
  return <div className="input-field">
    <label className="input-field__label" htmlFor={id}>{label}</label>
    <div className={`input-field__control${error ? ' input-field__control--error' : ''}`}>
      <span className="input-field__icon"><Icon size={18} strokeWidth={1.75} /></span>
      <input id={id} name={id} className="input-field__input" type={isPassword ? (showPassword ? 'text' : 'password') : type} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} />
      {isPassword && <button className="input-field__toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
    </div>
    {error ? <p className="input-field__error" id={`${id}-error`}>{error}</p> : hint ? <p className="input-field__hint" id={`${id}-hint`}>{hint}</p> : null}
  </div>
}

function Feature({ icon: Icon, title, children }) {
  return <li className="feature-item"><span className="feature-item__icon"><Icon size={20} /></span><div><p className="feature-item__title">{title}</p><p className="feature-item__description">{children}</p></div></li>
}

function BacklyLogo() {
  return <div className="signup-logo"><img src={backlyLogo} alt="" /><span>BACKLY</span></div>
}

function PromoPanel() {
  return <section className="promo-panel">
    <BacklyLogo />
    <div className="promo-panel__body">
      <span className="promo-panel__eyebrow">Developer tools, simplified.</span>
      <h1>Everything you need,<br />in <span>one place.</span></h1>
      <p>Sign in and continue building with powerful backend tools built for developers.</p>
      <ul>
        <Feature icon={Code2} title="All-in-One Toolkit">Access essential backend tools in one place.</Feature>
        <Feature icon={ShieldCheck} title="Secure & Private">Your data is encrypted and always kept private.</Feature>
        <Feature icon={Zap} title="Built for Developers">Fast, reliable and developer-first experience.</Feature>
      </ul>
    </div>
    <img className="promo-panel__illustration" src={toolbox} alt="" aria-hidden="true" />
  </section>
}

export default function Login() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const update = (field) => (event) => {
    const value = event.target.value
    setValues((previous) => ({ ...previous, [field]: value }))
    setServerError('')
    if (hasSubmitted) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }))
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setHasSubmitted(true)
    setServerError('')
    const nextErrors = Object.fromEntries(
      Object.entries(values)
        .map(([key, value]) => [key, validateField(key, value)])
        .filter(([, error]) => error),
    )
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setIsSubmitting(true)

    try {
      const res = await authApi.login({
        email: values.email.trim(),
        password: values.password,
      })

      await login(res?.data?.data)
      setIsSubmitting(false)
      setSubmitted(true)
      navigate('/home')
    } catch (error) {
      setServerError(error.response?.data?.message || '')
    } finally {
      setIsSubmitting(false)
    }
  }

  const input = (props) => <InputField {...props} value={values[props.id]} onChange={update(props.id)} error={hasSubmitted ? errors[props.id] : ''} />

  return <div className="signup-page"><div className="signup"><PromoPanel /><section className="signup__panel"><div className="signup__card">{submitted ? <div className="signup__success"><span><LogIn size={28} /></span><h2>Welcome back</h2><p>You’re signed in and ready to continue.</p></div> : <><header><h2>Welcome back</h2><p>Sign in to your BACKLY workspace.</p></header><form onSubmit={submit} noValidate>{input({ id: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'Enter your email address' })}{input({ id: 'password', label: 'Password', icon: Lock, isPassword: true, placeholder: 'Enter your password' })}{serverError && <p className="submit-error" role="alert">{serverError}</p>}<button className="signup-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : <><LogIn size={18} />Log in</>}</button></form></>}</div></section></div></div>
}
