/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function AccountVerificationSuccessAlert() {
  return (
    <div className="rounded-md bg-green-700 p-2">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-100"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-100">
            Email is successfully sent to your Email
          </p>
        </div>
      </div>
    </div>
  );
}
