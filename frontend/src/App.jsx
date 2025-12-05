import './App.css'
import { SignInButton, SignedOut, SignedIn, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {

  return (
    <>
      <h1>Welcome to Evalo</h1>

      <SignedOut>
        <SignInButton mode="modal" >
          <button>Log In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  );
}

export default App
