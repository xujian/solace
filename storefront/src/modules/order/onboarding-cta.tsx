"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button } from "@lib/components/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <div className="max-w-4xl h-full bg-muted w-full border rounded-lg">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <p className="text-foreground text-xl">
          Your test order was successfully created! 🎉
        </p>
        <p className="text-muted-foreground text-sm">
          You can now complete setting up your store in the admin.
        </p>
        <Button
          className="w-fit"
          size="lg"
          onClick={() => resetOnboardingState(orderId)}
        >
          Complete setup in admin
        </Button>
      </div>
    </div>
  )
}

export default OnboardingCta
