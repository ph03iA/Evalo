import { SignInButton, SignedOut, SignedIn, SignOutButton, UserButton } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast';
function HomePage() {

    //fetch some data 
    return (
        <div>
            <button className="btn btn-secondary" onClick={() => toast.error("This ia a success message.")}>Click me</button>

            <SignedOut>
                <SignInButton mode="modal">
                    <button>Sign In</button>
                </SignInButton>
            </SignedOut>


            <SignedIn>
                <SignOutButton />
            </SignedIn>

            <UserButton />

        </div>
    )
}

export default HomePage
