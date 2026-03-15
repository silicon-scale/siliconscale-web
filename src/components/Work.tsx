'use client'

import ddenImage from '../assets/Project-Images/dden.png'
import mnrdcImage from '../assets/Project-Images/mnrdc.png'
import rdcImage from '../assets/Project-Images/rdc.png'
import axelsImage from '../assets/Project-Images/axels.png'

import { useState, useEffect, useRef } from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function Work() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  const projects = [
    {
      id: 'dden',
      title: "DDEN",
      description: "A comprehensive digital platform for educational excellence and innovation.",
      color: 'accent-emerald',
      rotation: 'rotate-2',
      image: ddenImage,
      link: 'https://www.dden.in/',
      tag: 'Education',
      year: '2024',
    },
    {
      id: 'micronano',
      title: "MICRONANO",
      description: "Advanced micro and nano technology application platform for research and development.",
      color: 'accent-blue',
      rotation: '-rotate-1',
      image: mnrdcImage,
      link: 'https://app.micronano.paruluniversity.ac.in/',
      tag: 'Research',
      year: '2024',
    },
    {
      id: 'rdc',
      title: "RDC",
      description: "Research and Development Center fostering innovation and technological advancement.",
      color: 'accent-purple',
      rotation: 'rotate-1',
      image: rdcImage,
      link: 'https://rdc.paruluniversity.ac.in/',
      tag: 'Innovation',
      year: '2023',
    },
    {
      id: 'axels',
      title: "AXELS",
      description: "Next-generation platform for accelerated learning and skill enhancement.",
      color: 'accent-red',
      rotation: '-rotate-2',
      image: axelsImage,
      link: 'https://axels-beta.vercel.app/',
      tag: 'EdTech',
      year: '2024',
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const ClothesPin = () => (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg">
      <div className="relative w-5 h-10">
        <div className="absolute left-0 top-0 w-2.5 h-10 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-l-md shadow-md border-r border-orange-300/30">
          <div className="absolute inset-0 opacity-30 rounded-l-md"
               style={{
                 backgroundImage: `linear-gradient(0deg, rgba(139,69,19,0.2) 0%, transparent 20%, rgba(160,82,45,0.15) 40%, transparent 60%, rgba(139,69,19,0.2) 80%, transparent 100%)`,
                 backgroundSize: '100% 8px'
               }} />
        </div>
        <div className="absolute right-0 top-0 w-2.5 h-10 bg-gradient-to-l from-yellow-200 to-orange-200 rounded-r-md shadow-md border-l border-orange-300/30">
          <div className="absolute inset-0 opacity-30 rounded-r-md"
               style={{
                 backgroundImage: `linear-gradient(0deg, rgba(139,69,19,0.2) 0%, transparent 20%, rgba(160,82,45,0.15) 40%, transparent 60%, rgba(139,69,19,0.2) 80%, transparent 100%)`,
                 backgroundSize: '100% 8px'
               }} />
        </div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm shadow-sm">
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-gray-400 rounded-full" />
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-gray-400 rounded-full" />
        </div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2 bg-gradient-to-b from-orange-200 to-orange-300 rounded-b-md" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2 bg-gradient-to-b from-orange-200 to-orange-300 rounded-b-md" />
      </div>
    </div>
  )

  const RopeAnchor = ({ side }: { side: 'left' | 'right' }) => (
    <div className={`absolute ${side === 'left' ? 'left-0 sm:-left-10' : 'right-0 sm:-right-10'} top-4 w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-800 rounded-full shadow-xl border border-gray-400`}>
      <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-gray-300 rounded-full opacity-80" />
      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-black/60 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-900 rounded-full" />
      {/* Enhanced screw detail */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-0.5 bg-gray-700/50 rounded-full" />
    </div>
  )

  const RopeElement = ({ delay = '0s' }: { delay?: string }) => (
    <div className="absolute top-8 left-0 right-0 h-4 rope-sway" style={{ animationDelay: delay }}>
      <div className="w-full h-full bg-gradient-to-b from-yellow-800 via-amber-900 to-yellow-900 rounded-full shadow-lg" />
      <div className="absolute inset-0 opacity-90 rounded-full"
           style={{
             backgroundImage: `
               repeating-conic-gradient(from 0deg at 50% 50%, #8B4513 0deg, #A0522D 30deg, #654321 60deg, #8B4513 90deg, #A0522D 120deg, #654321 150deg, #8B4513 180deg, #A0522D 210deg, #654321 240deg, #8B4513 270deg, #A0522D 300deg, #654321 330deg),
               repeating-linear-gradient(45deg, rgba(139,69,19,0.6) 0px, rgba(160,82,45,0.4) 2px, transparent 4px, rgba(101,67,33,0.6) 6px, transparent 8px),
               repeating-linear-gradient(-45deg, rgba(160,82,45,0.5) 0px, transparent 2px, rgba(139,69,19,0.6) 4px, rgba(101,67,33,0.4) 6px, transparent 8px)
             `,
             backgroundSize: '100% 100%, 12px 100%, 14px 100%'
           }} />
      <div className="absolute inset-0 opacity-60 rounded-full"
           style={{
             backgroundImage: `
               radial-gradient(ellipse at 20% 30%, rgba(218,165,32,0.8) 0%, transparent 30%),
               radial-gradient(ellipse at 60% 20%, rgba(205,133,63,0.6) 0%, transparent 25%),
               radial-gradient(ellipse at 80% 70%, rgba(210,180,140,0.7) 0%, transparent 35%),
               radial-gradient(ellipse at 40% 80%, rgba(222,184,135,0.5) 0%, transparent 30%)
             `
           }} />
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-700 to-transparent rounded-full opacity-80" />
      <div className="absolute top-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-950 to-transparent rounded-full opacity-70" />
      <div className="absolute -bottom-3 left-0 right-0 h-4 bg-black/30 rounded-full blur-xl" />
      <div className="absolute -bottom-1 left-0 right-0 h-2 bg-black/50 rounded-full blur-sm" />
    </div>
  )

  const PhotoCard = ({
    project,
    index,
    swayClass,
  }: {
    project: typeof projects[0]
    index: number
    swayClass: string
  }) => {
    const isHovered = hoveredPhoto === project.id
    return (
      <div
        key={project.id}
        className={`relative transform transition-all duration-700 ${
          isHovered ? 'scale-105 -translate-y-3' : 'scale-100'
        } ${swayClass}`}
        style={{ transitionDelay: `${index * 200 + 800}ms` }}
        onMouseEnter={() => setHoveredPhoto(project.id)}
        onMouseLeave={() => setHoveredPhoto(null)}
      >
        <ClothesPin />

        {/* Thin string connecting pin to photo */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-gray-600 to-transparent"
          style={{ top: '-32px', height: '32px', opacity: 0.5 }}
        />

        <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
          <div
            className="relative bg-white p-2 pb-8 shadow-2xl cursor-pointer w-[260px] sm:w-[280px] max-w-[100vw] transition-all duration-300"
            style={{
              filter: isHovered ? 'brightness(1.1) contrast(1.05)' : 'brightness(1) contrast(0.95)',
              boxShadow: isHovered
                ? `0 32px 60px rgba(0,0,0,0.8), 0 12px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(255,200,100,0.15)`
                : `0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)`,
              transform: isHovered
                ? `perspective(800px) rotateX(${mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg)`
                : 'perspective(800px) rotateX(0deg) rotateY(0deg)',
              transition: 'box-shadow 0.3s ease, transform 0.2s ease, filter 0.3s ease',
            }}
          >
            {/* Top edge aged paper border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-100/60 to-transparent" />

            {/* Film frame holes - top */}
            <div className="absolute -top-1 left-4 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-800/20 border border-gray-300/30" />
              ))}
            </div>
            <div className="absolute -top-1 right-4 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-800/20 border border-gray-300/30" />
              ))}
            </div>

            {/* Photo Area */}
            <div className="h-48 mb-4 rounded-sm relative overflow-hidden">
              <ImageWithFallback
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover rounded-sm transition-transform duration-500"
                style={{
                  filter: 'sepia(15%) saturate(85%) brightness(90%) contrast(1.1)',
                  transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                }}
              />

              {/* Darkroom development effects */}
              <div className="absolute inset-0 bg-red-900/5 rounded-sm" />
              <div className="absolute inset-0 opacity-[0.03] rounded-sm"
                   style={{
                     backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,69,19,0.8) 1px, transparent 0)`,
                     backgroundSize: '3px 3px'
                   }} />

              {/* Vignette overlay */}
              <div className="absolute inset-0 rounded-sm"
                   style={{
                     background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
                   }} />

              {/* Corner curl effect */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full transform rotate-45" />

              {/* Hover overlay — subtle warm tint */}
              <div
                className="absolute inset-0 rounded-sm transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,200,100,0.08) 0%, transparent 60%)',
                  opacity: isHovered ? 1 : 0,
                }}
              />
            </div>

            {/* Text */}
            <div className="relative px-1">
              <h3 className="font-black text-lg text-gray-800 mb-1.5 leading-tight tracking-wide">
                {project.title}
              </h3>

              {/* Thin ruled line under title */}
              <div className="w-8 h-0.5 bg-black/60 mb-2 rounded-full" />

              <p className="text-sm text-gray-600 leading-relaxed">
                {project.description}
              </p>

              {/* Visit link hint */}
              <div
                className="mt-3 flex items-center gap-1 transition-all duration-300"
                style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(4px)' }}
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-black">
                  Visit Project
                </span>
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Vintage photo aging effects */}
            <div className="absolute top-3 right-3 w-4 h-4 bg-yellow-100/30 rounded-full" />
            <div className="absolute bottom-8 left-3 w-2 h-8 bg-yellow-100/20 rounded-full transform rotate-15" />

            {/* Left edge aged texture */}
            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-yellow-200/30 via-transparent to-yellow-200/20" />

            {/* Developer stamp */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 font-mono opacity-60 tracking-widest">
              SILICON SCALE
            </div>

            {/* Bottom edge shadow for depth */}
            <div className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent" />
          </div>
        </a>

        {/* Cast shadow under photo */}
        <div
          className="absolute -bottom-3 left-4 right-4 h-4 rounded-full blur-md transition-all duration-300"
          style={{
            background: 'rgba(0,0,0,0.5)',
            opacity: isHovered ? 0.7 : 0.4,
            transform: isHovered ? 'scaleX(0.95)' : 'scaleX(1)',
          }}
        />
      </div>
    )
  }

  return (
    <>
      {/* Injected keyframe styles */}
      <style>{`
        @keyframes rope-sway {
          0%, 100% { transform: scaleY(1) translateY(0px); }
          50% { transform: scaleY(1.003) translateY(1px); }
        }
        @keyframes photo-sway-1 {
          0%, 100% { transform: rotate(-1.5deg) translateX(0px); }
          50% { transform: rotate(1.5deg) translateX(2px); }
        }
        @keyframes photo-sway-2 {
          0%, 100% { transform: rotate(2deg) translateX(0px); }
          50% { transform: rotate(-1deg) translateX(-2px); }
        }
        @keyframes photo-sway-3 {
          0%, 100% { transform: rotate(0.5deg) translateX(0px); }
          50% { transform: rotate(-2deg) translateX(1px); }
        }
        @keyframes dust-float {
          0% { opacity: 0; transform: translateY(0px) translateX(0px); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-30px) translateX(10px); }
        }
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.7; }
          98% { opacity: 0.85; }
        }
        .rope-sway { animation: rope-sway 6s ease-in-out infinite; }
        .photo-sway-1 { animation: photo-sway-1 8s ease-in-out infinite; }
        .photo-sway-2 { animation: photo-sway-2 7s ease-in-out infinite; }
        .photo-sway-3 { animation: photo-sway-3 9s ease-in-out infinite; }
        .rotate-15 { transform: rotate(15deg); }
        .dust-1 { animation: dust-float 5s ease-in-out infinite; animation-delay: 0s; }
        .dust-2 { animation: dust-float 7s ease-in-out infinite; animation-delay: 2s; }
        .dust-3 { animation: dust-float 6s ease-in-out infinite; animation-delay: 4s; }
        .safelight-flicker { animation: flicker 12s ease-in-out infinite; }
      `}</style>

      <section
        id="services"
        ref={sectionRef}
        className="relative py-20"
        style={{ background: 'black', overflow: 'visible' }}
      >
        {/* Photo Lab Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Darkroom ambient lighting */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl safelight-flicker" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-900/15 rounded-full blur-2xl" />

          {/* Enhanced: subtle grid lines like a contact sheet */}
          <div className="absolute inset-0 opacity-[0.025]"
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,200,100,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,200,100,0.5) 1px, transparent 1px)',
                 backgroundSize: '80px 80px',
               }} />

          {/* Floating dust particles */}
          <div className="dust-1 absolute top-1/4 left-1/3 w-1 h-1 bg-amber-200/30 rounded-full blur-[1px]" />
          <div className="dust-2 absolute top-1/2 left-2/3 w-0.5 h-0.5 bg-amber-300/20 rounded-full" />
          <div className="dust-3 absolute top-3/4 left-1/4 w-1 h-1 bg-yellow-100/20 rounded-full blur-sm" />

          {/* Equipment silhouettes */}
          <div className="absolute bottom-8 left-8 w-16 h-24 bg-black/40 rounded-t-lg transform rotate-3" />
          <div className="absolute bottom-8 right-8 w-12 h-20 bg-black/30 rounded-lg transform -rotate-2" />

          {/* Chemical trays suggestion */}
          <div className="absolute bottom-12 left-1/4 w-32 h-8 bg-black/30 rounded-lg transform rotate-1" />
          <div className="absolute bottom-12 right-1/4 w-28 h-6 bg-black/25 rounded-lg transform -rotate-1" />

          {/* Enhanced: red safelight glow on floor */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-16 bg-red-900/10 rounded-full blur-3xl" />

          {/* Top vignette */}
          <div className="absolute top-0 left-0 right-0 h-32"
               style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' }} />
          {/* Bottom vignette */}
          <div className="absolute bottom-0 left-0 right-0 h-32"
               style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

          {/* Header */}
          <div className="text-center my-16">
            <h2
              style={{ fontSize: 'clamp(1.9rem, 2vw, 2.4rem)', fontWeight: 900, color: '#ffffff' }}
              className={`leading-tight mb-2 md:mb-3 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            >
              What We Developed
            </h2>

            {/* Decorative line under heading */}
            <div className={`flex items-center justify-center gap-3 mb-4 transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>

            <p className={`text-xl text-white leading-relaxed max-w-3xl mx-auto transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Developed with precision, delivered with passion
            </p>
          </div>

          {/* Photo Lab Clotheslines */}
          <div
            className={`w-full transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            style={{ overflow: 'visible' }}
          >

            {/* First Clothesline - Top Row */}
            <div className="relative mb-24" style={{ overflow: 'visible' }}>
              <RopeElement delay="0s" />
              <RopeAnchor side="left" />
              <RopeAnchor side="right" />

              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-16 pt-20 max-w-7xl mx-auto px-4">
                {projects.slice(0, 3).map((project, index) => (
                  <PhotoCard
                    key={project.id}
                    project={project}
                    index={index}
                    swayClass={index === 0 ? 'photo-sway-1' : index === 1 ? 'photo-sway-2' : 'photo-sway-3'}
                  />
                ))}
              </div>
            </div>

            {/* Second Clothesline - Bottom Row */}
            <div className="relative" style={{ overflow: 'visible' }}>
              <RopeElement delay="2s" />
              <RopeAnchor side="left" />
              <RopeAnchor side="right" />

              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-16 pt-20 max-w-7xl mx-auto px-4">
                {projects.slice(3, 6).map((project, index) => (
                  <PhotoCard
                    key={project.id}
                    project={project}
                    index={index + 3}
                    swayClass={index === 0 ? 'photo-sway-3' : index === 1 ? 'photo-sway-1' : 'photo-sway-2'}
                  />
                ))}
              </div>
            </div>

            {/* Darkroom atmosphere note */}
            <div className="mt-20 text-center">
              <p className="text-sm text-white leading-relaxed max-w-2xl mx-auto">
                At SiliconScale, every project is built with precision—combining strategy, design, and engineering to create scalable digital experience
              </p>

              {/* Small decorative bottom rule */}
              <div className="flex justify-center mt-4">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}