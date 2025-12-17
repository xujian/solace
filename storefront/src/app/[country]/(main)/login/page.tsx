import LoginForm from '@modules/account/login-form'

export default function LoginPage () {
  return (
    <div className="login-page flex h-full items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}