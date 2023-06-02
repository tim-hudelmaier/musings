import { signIn, getProviders } from 'next-auth/react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";

export function Signin({ providers }) {
    return (
        <>
            <div>
                <p>Sign in to access you notes.</p>
                {
                    providers &&
                    Object.values(providers).map(provider => (
                        <div key={provider.name} style={{ marginBottom: 0 }}>
                            <button onClick={() => signIn(provider.id)} >
                                Sign in with{' '} {provider.name}
                            </button>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Signin

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: { providers: providers ?? [] },
    }
}