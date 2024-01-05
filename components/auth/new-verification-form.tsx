"use client"

import { useCallback, useEffect, useState } from "react"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { useSearchParams } from "next/navigation"
import { BeatLoader } from "react-spinners"
import { newVerification } from "@/actions/new-verification.action"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isVerified, setIsVerified] = useState<boolean | undefined>(false)

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (success || error || isVerified) return

    if (!token) {
      setError("Missing token")
      return
    }
    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success)
          setIsVerified(true)
        } else {
          setError(data.error)
        }
      })
      .catch(() => {
        setError("Something went wrong")
      })
  }, [token, success, error, isVerified])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!isVerified && !success && <FormError message={error} />}
      </div>
    </CardWrapper>
  )
}
