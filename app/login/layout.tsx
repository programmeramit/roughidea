import React, { Suspense } from 'react'


const LoginLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </div>
    )
}

export default LoginLayout
