/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useRouteError } from "react-router";

export default function ErrorPage() {
  const error: any = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Unexpected Application Error!
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            {error?.status === 404
              ? "404 Not Found"
              : error?.statusText || error?.message || "Something went wrong."}
          </p>
          <p className="text-gray-500 mb-6">
            Sorry, something went wrong. Please try again or contact support if
            the problem persists.
          </p>
          <Button onClick={() => navigate(-1)} className="mb-2 w-full">
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
