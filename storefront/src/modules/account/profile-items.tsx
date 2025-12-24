'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HttpTypes } from '@medusajs/types'
import { useClickOutside } from '@lib/hooks/use-click-outside'
import ProfileBillingAddress from './profile-billing-address'
import ProfileEmail from './profile-email'
import ProfileName from './profile-name'
import ProfilePassword from './profile-password'
import ProfilePhone from './profile-phone'
import {
  LockIcon,
  MailIcon,
  PhoneIcon,
  ContactRound,
  MapPinned
} from 'lucide-react'

export interface ProfileItemsProps {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

export default function ProfileItems({ customer, regions }: ProfileItemsProps) {
  const cards = [
    {
      title: 'Name',
      value: `${customer.first_name} ${customer.last_name}`,
      description: 'Change your name',
      icon: <ContactRound />,
      ctaText: 'Edit',
      ctaLink: 'https://ui.aceternity.com/templates',
      content: () => <ProfileName customer={customer} />
    },
    {
      title: 'Email',
      value: customer.email,
      description: 'Change your email',
      icon: <MailIcon />,
      ctaText: 'Edit',
      ctaLink: 'https://ui.aceternity.com/templates',
      content: () => <ProfileEmail customer={customer} />
    },

    {
      title: 'Phone',
      value: customer.phone,
      description: 'Change your phone number',
      icon: <PhoneIcon />,
      ctaText: 'Edit',
      ctaLink: 'https://ui.aceternity.com/templates',
      content: () => <ProfilePhone customer={customer} />
    },
    {
      title: 'Password',
      value: '******',
      description: 'Change your password',
      icon: <LockIcon />,
      ctaText: 'Edit',
      ctaLink: 'https://ui.aceternity.com/templates',
      content: () => <ProfilePassword customer={customer} />
    },
    {
      title: 'Billing address',
      value: '',
      description: 'Modify your billing address',
      icon: <MapPinned />,
      ctaText: 'Edit',
      ctaLink: 'https://ui.aceternity.com/templates',
      content: () => (
        <ProfileBillingAddress customer={customer} regions={regions} />
      )
    }
  ]
  const [active, setActive] = useState<(typeof cards)[number] | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null)
      }
    }
    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])
  useClickOutside(ref, () => setActive(null))
  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mask glass fixed inset-0 z-100 h-full w-full bg-black/50"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="absolute inset-0 z-101 grid place-items-center">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="relative flex w-full max-w-[500px] flex-col overflow-hidden rounded bg-card">
              <div className="flex items-center bg-muted gap-4 p-4">
                <motion.div
                  layoutId={`icon-${active.title}-${id}`}
                  className="flex items-center justify-center bg-muted">
                  {active.icon}
                </motion.div>
                <div className="flex-1">
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="">
                    {active.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${active.description}-${id}`}
                    className="caption">
                    {active.description}
                  </motion.p>
                </div>
                <motion.button
                  layoutId={`button-${active.title}-${id}`}
                  onClick={() => setActive(null)}
                  className="ring-1 rounded px-2 py-1text-sm cursor-pointer hover:bg-accent">
                  Cancel
                </motion.button>
              </div>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-40 flex-col items-start gap-4 md:h-fit">
                {active.content()}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="mx-auto w-full max-w-2xl gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="flex cursor-pointer items-center gap-4 rounded p-4 hover:bg-muted">
            <motion.div layoutId={`icon-${card.title}-${id}`}>
              {card.icon}
            </motion.div>
            <div className="flex-1">
              <motion.h4 layoutId={`title-${card.title}-${id}`} className="my-0 uppercase">
                {card.title}
              </motion.h4>
              <p className="my-0 text-sm">
                {card.value}
              </p>
            </div>
            <div>
              <motion.p
                layoutId={`description-${card.description}-${id}`}
                className="my-0 text-muted-foreground">
                {card.description}
              </motion.p>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="mt-4 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-black hover:bg-green-500 hover:text-white md:mt-0">
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05
        }
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}
