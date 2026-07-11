import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { BrandButton } from '@/components/ui/BrandButton'

const NotFound = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error(
        '404 Error: User attempted to access non-existent route:',
        location.pathname
      )
    }
  }, [location.pathname])

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6 text-white">
      <div className="text-center">
        <SectionEyebrow className="mb-3 bg-white/[0.04] text-[10px] tracking-[0.22em] text-white/55">
          Not Found
        </SectionEyebrow>
        <h1 className="mb-3 text-5xl font-black tracking-tight">404</h1>
        <p className="mb-7 text-base text-white/55">
          This page doesn&apos;t exist — but SiliconScale still does. Let&apos;s get you back.
        </p>
        <BrandButton type="button" onClick={() => navigate('/')}>
          Return Home
        </BrandButton>
      </div>
    </div>
  )
}

export default NotFound
