import VerifyOtpForm from '@/components/ui/shared/Auth/verifyEmail'
import React from 'react'

export default async function VerifyEmailPage({searchParams}: {searchParams: Promise<{email: string}>}) {
  const { email } = await searchParams;

    
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-black/90">
      {/* Netflix-style background image with dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-eca797928898/1bc92e62-c513-43a7-aaee-dafb692135c3/US-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/60 sm:bg-black/50"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <VerifyOtpForm email={email}/>
      </div>
    </div>
  )
}